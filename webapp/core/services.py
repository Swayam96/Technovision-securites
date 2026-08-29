from fastapi import HTTPException

from core.auth import verify_password
from core.config import DEFAULT_NEW_USER_PASSWORD
from core.db import (
    create_user,
    delete_record,
    get_record,
    get_user_by_username,
    new_pipeline_id,
    save_record,
    set_password,
    set_pipeline_id,
    set_record_status,
    update_user,
)
from core.modules import Function, Module, get_function, get_module
from core.permissions import can_read, can_write
from core.roles import NEXT_HANDOFF, get_role, next_pipeline_stage


def require_module(module_id: str) -> Module:
    module = get_module(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module


def require_function(module_id: str, function_id: str) -> tuple[Module, Function]:
    module = require_module(module_id)
    fn = get_function(module_id, function_id)
    if not fn:
        raise HTTPException(status_code=404, detail="Function not found")
    return module, fn


def require_read(user: dict, module_id: str, function_id: str | None = None) -> Module:
    module = require_module(module_id)
    if function_id:
        require_function(module_id, function_id)
    if not can_read(user, module_id, function_id):
        raise HTTPException(status_code=403, detail="You do not have access to this module")
    return module


def require_write(user: dict, module_id: str, function_id: str | None = None) -> Module:
    require_read(user, module_id, function_id)
    if not can_write(user, module_id, function_id):
        raise HTTPException(status_code=403, detail="You have read-only access")
    return require_module(module_id)


def create_record(
    module_id: str,
    function_id: str,
    title: str,
    status: str,
    notes: str,
    owner_id: int | None = None,
) -> None:
    module, fn = require_function(module_id, function_id)
    if not title.strip():
        raise HTTPException(status_code=400, detail="Title required")
    pipeline_id = new_pipeline_id() if module_id == "sales-presales" else None
    save_record(
        module.id,
        fn.title,
        title,
        status,
        notes,
        owner_id=owner_id,
        pipeline_id=pipeline_id,
        function_id=fn.id,
    )


def update_record(
    module_id: str,
    function_id: str,
    record_id: int,
    title: str,
    status: str,
    notes: str,
) -> None:
    _, fn = require_function(module_id, function_id)
    if not title.strip():
        raise HTTPException(status_code=400, detail="Title required")
    if not get_record(record_id, module_id):
        raise HTTPException(status_code=404, detail="Record not found")
    save_record(
        module_id,
        fn.title,
        title,
        status,
        notes,
        record_id=record_id,
        function_id=fn.id,
    )


def remove_record(module_id: str, record_id: int) -> None:
    require_module(module_id)
    delete_record(record_id, module_id)


def admin_create_user(username: str, full_name: str, role_id: str) -> int:
    username = username.strip().lower()
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if not full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")
    if not get_role(role_id):
        raise HTTPException(status_code=400, detail="Invalid role")
    if get_user_by_username(username):
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(
        username,
        full_name,
        role_id,
        DEFAULT_NEW_USER_PASSWORD,
        must_change_password=True,
    )


def admin_update_user(
    user_id: int,
    full_name: str,
    role_id: str,
    is_active: bool,
    password: str | None,
    reset_defaults: bool,
) -> None:
    if not full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")
    if not get_role(role_id):
        raise HTTPException(status_code=400, detail="Invalid role")
    if password and len(password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")
    update_user(
        user_id,
        full_name,
        role_id,
        is_active,
        password=password or None,
        must_change_password=True if password else None,
    )
    if reset_defaults:
        from core.db import apply_role_defaults

        apply_role_defaults(user_id, role_id)


def change_own_password(user_id: int, stored_hash: str, current: str, new_password: str, confirm: str) -> None:
    if not verify_password(current, stored_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(new_password) < 4:
        raise HTTPException(status_code=400, detail="New password must be at least 4 characters")
    if new_password != confirm:
        raise HTTPException(status_code=400, detail="New passwords do not match")
    if current == new_password:
        raise HTTPException(status_code=400, detail="Choose a different password from the temporary one")
    set_password(user_id, new_password, must_change_password=False)


def advance_pipeline(module_id: str, record_id: int, owner_id: int | None) -> tuple[str, str]:
    record = get_record(record_id, module_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    next_module = next_pipeline_stage(module_id)
    if not next_module or module_id not in NEXT_HANDOFF:
        raise HTTPException(status_code=400, detail="This record is already at the last stage")
    dest_module, dest_fn, note_prefix = NEXT_HANDOFF[module_id]
    fn = get_function(dest_module, dest_fn)
    pipeline_id = record["pipeline_id"] or new_pipeline_id()
    if not record["pipeline_id"]:
        set_pipeline_id(record["id"], pipeline_id)
    save_record(
        dest_module,
        fn.title if fn else dest_fn,
        record["title"],
        "Open",
        f"{note_prefix}. Previous notes: {record['notes'] or '—'}",
        owner_id=owner_id,
        pipeline_id=pipeline_id,
        source_id=record["id"],
        function_id=dest_fn,
    )
    set_record_status(record["id"], "Handed over")
    return dest_module, dest_fn

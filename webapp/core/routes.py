from fastapi import APIRouter, Form, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse

from core.config import TAGLINE
from core.auth import verify_password
from core.db import (
    apply_role_defaults,
    counts_by_module,
    dashboard_stats,
    function_record_counts,
    get_record,
    get_user_by_id,
    get_user_by_username,
    get_user_permissions,
    list_pipeline,
    list_records,
    list_users,
    save_user_permissions,
)
from core.permissions import (
    can_write,
    nav_modules,
    parse_permission_form,
    permission_grid,
    readable_functions,
)
from core.roles import PIPELINE, PIPELINE_LABELS, ROLES, defaults_for_role, next_pipeline_stage
from core.services import (
    admin_create_user,
    admin_update_user,
    advance_pipeline,
    change_own_password,
    create_record,
    remove_record,
    require_function,
    require_read,
    require_write,
    update_record,
)

router = APIRouter()


def _templates(request: Request):
    return request.app.state.templates


def _user(request: Request) -> dict:
    return request.state.user


def _ctx(request: Request, **extra):
    user = _user(request)
    nav = nav_modules(user)
    data = {
        "request": request,
        "user": user,
        "nav_modules": nav,
        "nav_ids": [item["module"].id for item in nav],
        "role_title": user["role_title"],
        "pipeline": PIPELINE,
        "pipeline_labels": PIPELINE_LABELS,
    }
    data.update(extra)
    return data


def _form_list(value) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v) for v in value]
    return [str(value)]


@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request, error: str = "", message: str = ""):
    if getattr(request.state, "user", None):
        return RedirectResponse("/", status_code=303)
    return _templates(request).TemplateResponse(
        "login.html",
        {"request": request, "error": error, "message": message},
    )


@router.post("/login")
def login_submit(request: Request, username: str = Form(...), password: str = Form(...)):
    row = get_user_by_username(username)
    if not row or not row["is_active"] or not verify_password(password, row["password_hash"]):
        return _templates(request).TemplateResponse(
            "login.html",
            {"request": request, "error": "Invalid username or password.", "message": ""},
            status_code=401,
        )
    request.session["user_id"] = row["id"]
    if row["must_change_password"]:
        return RedirectResponse("/change-password", status_code=303)
    return RedirectResponse("/", status_code=303)


@router.get("/change-password", response_class=HTMLResponse)
def change_password_page(request: Request, error: str = ""):
    user = _user(request)
    return _templates(request).TemplateResponse(
        "change_password.html",
        {
            "request": request,
            "error": error,
            "forced": user["must_change_password"],
            "app_name": request.app.title,
        },
    )


@router.post("/change-password")
def change_password_submit(
    request: Request,
    current_password: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
):
    user = _user(request)
    row = get_user_by_id(user["id"])
    try:
        change_own_password(
            user["id"],
            row["password_hash"],
            current_password,
            new_password,
            confirm_password,
        )
    except HTTPException as exc:
        return _templates(request).TemplateResponse(
            "change_password.html",
            {
                "request": request,
                "error": exc.detail,
                "forced": user["must_change_password"],
                "app_name": request.app.title,
            },
            status_code=400,
        )
    return RedirectResponse("/", status_code=303)


@router.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/login", status_code=303)


@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    user = _user(request)
    nav = nav_modules(user)
    module_ids = [item["module"].id for item in nav]
    return _templates(request).TemplateResponse(
        "home.html",
        _ctx(
            request,
            tagline=TAGLINE,
            counts=counts_by_module(module_ids),
            stats=dashboard_stats(module_ids),
            modules=[item["module"] for item in nav],
            active_nav="dashboard",
        ),
    )


@router.get("/modules/{module_id}", response_class=HTMLResponse)
def module_page(request: Request, module_id: str):
    user = _user(request)
    module = require_read(user, module_id)
    fns = readable_functions(user, module)
    return _templates(request).TemplateResponse(
        "module_overview.html",
        _ctx(
            request,
            module=module,
            functions=fns,
            counts=function_record_counts(module_id),
            active_nav=module_id,
            next_stage=next_pipeline_stage(module_id),
            next_label=PIPELINE_LABELS.get(next_pipeline_stage(module_id) or "", ""),
        ),
    )


@router.get("/modules/{module_id}/{function_id}", response_class=HTMLResponse)
def function_page(request: Request, module_id: str, function_id: str, q: str = Query("")):
    user = _user(request)
    if module_id == "organization-administration" and function_id in ("users", "permissions"):
        require_read(user, module_id, function_id)
        return RedirectResponse("/admin/users", status_code=303)
    module = require_read(user, module_id, function_id)
    _, fn = require_function(module_id, function_id)
    return _templates(request).TemplateResponse(
        "module.html",
        _ctx(
            request,
            module=module,
            fn=fn,
            records=list_records(module_id, q, function_id=function_id),
            query=q,
            can_write=can_write(user, module_id, function_id),
            active_nav=module_id,
            active_fn=function_id,
            next_stage=next_pipeline_stage(module_id),
            next_label=PIPELINE_LABELS.get(next_pipeline_stage(module_id) or "", ""),
        ),
    )


@router.get("/modules/{module_id}/{function_id}/records/{record_id}/edit", response_class=HTMLResponse)
def edit_record_page(request: Request, module_id: str, function_id: str, record_id: int):
    user = _user(request)
    module = require_read(user, module_id, function_id)
    _, fn = require_function(module_id, function_id)
    record = get_record(record_id, module_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    trail = list_pipeline(record["pipeline_id"]) if record["pipeline_id"] else []
    return _templates(request).TemplateResponse(
        "edit_record.html",
        _ctx(
            request,
            module=module,
            fn=fn,
            record=record,
            can_write=can_write(user, module_id, function_id),
            active_nav=module_id,
            active_fn=function_id,
            trail=trail,
            next_stage=next_pipeline_stage(module_id),
            next_label=PIPELINE_LABELS.get(next_pipeline_stage(module_id) or "", ""),
        ),
    )


@router.post("/modules/{module_id}/{function_id}/records")
def create_record_route(
    request: Request,
    module_id: str,
    function_id: str,
    title: str = Form(...),
    status: str = Form("Open"),
    notes: str = Form(""),
):
    user = _user(request)
    require_write(user, module_id, function_id)
    create_record(module_id, function_id, title, status, notes, owner_id=user["id"])
    return RedirectResponse(url=f"/modules/{module_id}/{function_id}", status_code=303)


@router.post("/modules/{module_id}/{function_id}/records/{record_id}")
def update_record_route(
    request: Request,
    module_id: str,
    function_id: str,
    record_id: int,
    title: str = Form(...),
    status: str = Form("Open"),
    notes: str = Form(""),
):
    user = _user(request)
    require_write(user, module_id, function_id)
    update_record(module_id, function_id, record_id, title, status, notes)
    return RedirectResponse(url=f"/modules/{module_id}/{function_id}", status_code=303)


@router.post("/modules/{module_id}/{function_id}/records/{record_id}/delete")
def delete_record_route(request: Request, module_id: str, function_id: str, record_id: int):
    user = _user(request)
    require_write(user, module_id, function_id)
    remove_record(module_id, record_id)
    return RedirectResponse(url=f"/modules/{module_id}/{function_id}", status_code=303)


@router.post("/modules/{module_id}/{function_id}/records/{record_id}/advance")
def advance_record_route(request: Request, module_id: str, function_id: str, record_id: int):
    user = _user(request)
    require_write(user, module_id, function_id)
    dest_module, dest_fn = advance_pipeline(module_id, record_id, owner_id=user["id"])
    if can_write(user, dest_module, dest_fn) or can_write(user, dest_module):
        return RedirectResponse(url=f"/modules/{dest_module}/{dest_fn}", status_code=303)
    return RedirectResponse(url=f"/modules/{module_id}/{function_id}", status_code=303)


@router.get("/admin/users", response_class=HTMLResponse)
def users_page(request: Request, error: str = "", message: str = "", created: str = ""):
    user = _user(request)
    require_read(user, "organization-administration", "users")
    if created:
        message = "Created successfully."
    return _templates(request).TemplateResponse(
        "users.html",
        _ctx(
            request,
            people=list_users(),
            roles=ROLES,
            error=error,
            message=message,
            active_nav="organization-administration",
            active_fn="users",
        ),
    )


@router.post("/admin/users")
def users_create(
    request: Request,
    username: str = Form(...),
    full_name: str = Form(...),
    role_id: str = Form(...),
):
    user = _user(request)
    require_write(user, "organization-administration", "users")
    try:
        new_id = admin_create_user(username, full_name, role_id)
    except HTTPException as exc:
        return _templates(request).TemplateResponse(
            "users.html",
            _ctx(
                request,
                people=list_users(),
                roles=ROLES,
                error=exc.detail,
                message="",
                active_nav="organization-administration",
                active_fn="users",
            ),
            status_code=400,
        )
    if user["can_manage_permissions"]:
        return RedirectResponse(f"/admin/users/{new_id}/permissions?created=1", status_code=303)
    return RedirectResponse("/admin/users", status_code=303)


@router.get("/admin/users/{user_id}", response_class=HTMLResponse)
def user_edit_page(request: Request, user_id: int, error: str = "", message: str = ""):
    actor = _user(request)
    require_write(actor, "organization-administration", "users")
    person = get_user_by_id(user_id)
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    return _templates(request).TemplateResponse(
        "user_edit.html",
        _ctx(
            request,
            person=person,
            roles=ROLES,
            error=error,
            message=message,
            active_nav="organization-administration",
            active_fn="users",
        ),
    )


@router.post("/admin/users/{user_id}")
def user_edit_save(
    request: Request,
    user_id: int,
    full_name: str = Form(...),
    role_id: str = Form(...),
    is_active: str = Form("0"),
    password: str = Form(""),
    reset_defaults: str = Form("0"),
):
    actor = _user(request)
    require_write(actor, "organization-administration", "users")
    person = get_user_by_id(user_id)
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        admin_update_user(
            user_id,
            full_name,
            role_id,
            is_active == "1",
            password.strip() or None,
            reset_defaults == "1",
        )
    except HTTPException as exc:
        return _templates(request).TemplateResponse(
            "user_edit.html",
            _ctx(
                request,
                person=get_user_by_id(user_id),
                roles=ROLES,
                error=exc.detail,
                message="",
                active_nav="organization-administration",
                active_fn="users",
            ),
            status_code=400,
        )
    return RedirectResponse(f"/admin/users/{user_id}?message=saved", status_code=303)


@router.get("/admin/users/{user_id}/permissions", response_class=HTMLResponse)
def user_permissions_page(request: Request, user_id: int, created: str = ""):
    actor = _user(request)
    require_write(actor, "organization-administration", "permissions")
    person = get_user_by_id(user_id)
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    stored = get_user_permissions(user_id)
    if person["role_id"] == "admin" and not stored:
        stored = defaults_for_role("admin")
    return _templates(request).TemplateResponse(
        "permissions.html",
        _ctx(
            request,
            person=person,
            grid=permission_grid(stored),
            created=bool(created),
            active_nav="organization-administration",
            active_fn="permissions",
        ),
    )


@router.post("/admin/users/{user_id}/permissions")
async def user_permissions_save(request: Request, user_id: int):
    actor = _user(request)
    require_write(actor, "organization-administration", "permissions")
    person = get_user_by_id(user_id)
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    form = await request.form()
    reads = _form_list(form.getlist("read"))
    writes = _form_list(form.getlist("write"))
    save_user_permissions(user_id, parse_permission_form(reads, writes))
    return RedirectResponse("/admin/users?created=1", status_code=303)


@router.post("/admin/users/{user_id}/permissions/defaults")
def user_permissions_defaults(request: Request, user_id: int):
    actor = _user(request)
    require_write(actor, "organization-administration", "permissions")
    person = get_user_by_id(user_id)
    if not person:
        raise HTTPException(status_code=404, detail="User not found")
    apply_role_defaults(user_id, person["role_id"])
    return RedirectResponse(f"/admin/users/{user_id}/permissions", status_code=303)

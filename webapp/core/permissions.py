from __future__ import annotations

from typing import Any

from core.modules import MODULES, Module, get_function, get_module


PermMap = dict[tuple[str, str], tuple[bool, bool]]


def is_admin(user: dict[str, Any] | None) -> bool:
    return bool(user and user.get("role_id") == "admin")


def _flag(user: dict[str, Any], module_id: str, function_id: str, write: bool) -> bool:
    if is_admin(user):
        return True
    perms: PermMap = user.get("perms") or {}
    read, can_w = perms.get((module_id, function_id), (False, False))
    return bool(can_w if write else read or can_w)


def can_read(user: dict[str, Any], module_id: str, function_id: str | None = None) -> bool:
    if is_admin(user):
        return True
    if function_id:
        return _flag(user, module_id, function_id, write=False)
    module = get_module(module_id)
    if not module:
        return False
    return any(_flag(user, module_id, fn.id, write=False) for fn in module.functions)


def can_write(user: dict[str, Any], module_id: str, function_id: str | None = None) -> bool:
    if is_admin(user):
        return True
    if function_id:
        return _flag(user, module_id, function_id, write=True)
    module = get_module(module_id)
    if not module:
        return False
    return any(_flag(user, module_id, fn.id, write=True) for fn in module.functions)


def readable_functions(user: dict[str, Any], module: Module):
    return tuple(fn for fn in module.functions if can_read(user, module.id, fn.id))


def nav_modules(user: dict[str, Any]) -> list[dict[str, Any]]:
    items = []
    for module in MODULES:
        fns = readable_functions(user, module)
        if not fns:
            continue
        items.append({"module": module, "functions": fns})
    return items


def permission_grid(stored: PermMap) -> list[dict[str, Any]]:
    rows = []
    for module in MODULES:
        functions = []
        for fn in module.functions:
            read, write = stored.get((module.id, fn.id), (False, False))
            functions.append(
                {
                    "id": fn.id,
                    "title": fn.title,
                    "key": f"{module.id}:{fn.id}",
                    "can_read": bool(read or write),
                    "can_write": bool(write),
                }
            )
        rows.append({"module": module, "functions": functions})
    return rows


def parse_permission_form(read_keys: list[str], write_keys: list[str]) -> PermMap:
    writes = set(write_keys)
    reads = set(read_keys) | writes
    out: PermMap = {}
    for key in reads | writes:
        if ":" not in key:
            continue
        module_id, function_id = key.split(":", 1)
        if not get_function(module_id, function_id):
            continue
        write = key in writes
        out[(module_id, function_id)] = (True, write)
    return out

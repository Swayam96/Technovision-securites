from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from core.config import (
    APP_NAME,
    APP_VERSION,
    COMPANY_NAME,
    COMPANY_URL,
    ON_RENDER,
    SESSION_SECRET,
    STATIC_DIR,
    TEMPLATES_DIR,
)
from core.db import get_user_by_id, get_user_permissions, init_db, ping_db
from core.modules import MODULES, MODULE_BY_ID
from core.permissions import can_read, can_write, is_admin
from core.roles import get_role, ROLE_BY_ID
from core.routes import router

PUBLIC_PATHS = {"/login", "/health"}
PASSWORD_PATHS = {"/change-password", "/logout"}


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


def _safe_user(row) -> dict:
    role = get_role(row["role_id"])
    user = {
        "id": row["id"],
        "username": row["username"],
        "full_name": row["full_name"],
        "role_id": row["role_id"],
        "role_title": role.title if role else row["role_id"],
        "must_change_password": bool(row["must_change_password"]),
        "is_active": bool(row["is_active"]),
        "perms": get_user_permissions(row["id"]),
    }
    user["is_admin"] = is_admin(user)
    user["can_view_users"] = can_read(user, "organization-administration", "users")
    user["can_manage_users"] = can_write(user, "organization-administration", "users")
    user["can_manage_permissions"] = can_write(user, "organization-administration", "permissions")
    return user


def create_app() -> FastAPI:
    app = FastAPI(title=APP_NAME, version=APP_VERSION, lifespan=lifespan)

    templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
    templates.env.globals.update(
        {
            "app_name": APP_NAME,
            "company_name": COMPANY_NAME,
            "company_url": COMPANY_URL,
            "modules": MODULES,
            "module_by_id": MODULE_BY_ID,
            "role_by_id": ROLE_BY_ID,
        }
    )
    app.state.templates = templates
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
    app.include_router(router)

    @app.middleware("http")
    async def auth_gate(request: Request, call_next):
        path = request.url.path
        user = None
        user_id = request.session.get("user_id") if hasattr(request, "session") else None
        if user_id:
            row = get_user_by_id(int(user_id))
            if row and row["is_active"]:
                user = _safe_user(row)
            else:
                request.session.clear()
        request.state.user = user

        if path.startswith("/static") or path in PUBLIC_PATHS:
            return await call_next(request)
        if not user:
            return RedirectResponse("/login", status_code=303)
        if user["must_change_password"] and path not in PASSWORD_PATHS:
            return RedirectResponse("/change-password", status_code=303)
        return await call_next(request)

    @app.get("/health")
    def health():
        try:
            ping_db()
            database = "ok"
        except Exception:
            database = "error"
        return {"status": "ok", "app": APP_NAME, "database": database}

    app.add_middleware(
        SessionMiddleware,
        secret_key=SESSION_SECRET,
        max_age=60 * 60 * 12,
        https_only=ON_RENDER,
        same_site="lax",
    )
    return app

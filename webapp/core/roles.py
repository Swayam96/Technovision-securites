from dataclasses import dataclass

from core.modules import MODULES, get_module


@dataclass(frozen=True, slots=True)
class Role:
    id: str
    title: str


ROLES: tuple[Role, ...] = (
    Role("admin", "TE Management / Admin"),
    Role("sales-manager", "Sales Manager"),
    Role("sales-executive", "Sales Executive"),
    Role("presales", "Presales / BOQ Engineer"),
    Role("project-manager", "Project Manager"),
    Role("project-coordinator", "Project Coordinator"),
    Role("technical-engineer", "Technical Engineer"),
    Role("purchase-manager", "Purchase Manager"),
    Role("purchase-executive", "Purchase Executive"),
    Role("store-manager", "Store Manager"),
    Role("store-executive", "Store Executive"),
    Role("logistics", "Logistics Coordinator"),
    Role("service-manager", "Service Manager"),
    Role("service-coordinator", "Service Coordinator"),
    Role("service-engineer", "Service Engineer"),
    Role("accounts", "Accounts / Finance"),
    Role("hr", "HR / Administration"),
)

ROLE_BY_ID = {role.id: role for role in ROLES}

ADMIN_ONLY_FUNCTIONS = {
    ("organization-administration", "users"),
    ("organization-administration", "permissions"),
}

PIPELINE: tuple[str, ...] = (
    "sales-presales",
    "purchase-procurement",
    "inventory-logistics",
    "projects-installation",
    "service-amc",
)

PIPELINE_LABELS = {
    "sales-presales": "Sales",
    "purchase-procurement": "Purchase",
    "inventory-logistics": "Logistics",
    "projects-installation": "Installation",
    "service-amc": "Support",
}

NEXT_HANDOFF = {
    "sales-presales": ("purchase-procurement", "purchase-order", "Sent from Sales / Presales"),
    "purchase-procurement": ("inventory-logistics", "material-receipt", "Materials received from Purchase"),
    "inventory-logistics": ("projects-installation", "project-master", "Stock issued for installation"),
    "projects-installation": ("service-amc", "amc", "Handover to Service & AMC"),
}

ROLE_MIGRATE = {
    "mis": "admin",
    "org": "hr",
    "crm": "sales-executive",
    "purchase": "purchase-executive",
    "logistics": "logistics",
    "installation": "technical-engineer",
    "support": "service-engineer",
    "finance": "accounts",
}

MODULE_MIGRATE = {
    "crm-sales": "sales-presales",
    "presales-boq": "sales-presales",
    "system-administration": "organization-administration",
    "finance-accounts": "mis-management",
}


def get_role(role_id: str) -> Role | None:
    return ROLE_BY_ID.get(role_id)


def next_pipeline_stage(module_id: str) -> str | None:
    if module_id not in PIPELINE:
        return None
    index = PIPELINE.index(module_id)
    if index >= len(PIPELINE) - 1:
        return None
    return PIPELINE[index + 1]


def _grant(module_ids: list[str], *, write: bool = True, exclude: set[tuple[str, str]] | None = None) -> dict:
    out: dict[tuple[str, str], tuple[bool, bool]] = {}
    skip = exclude or set()
    for mid in module_ids:
        module = get_module(mid)
        if not module:
            continue
        for fn in module.functions:
            key = (mid, fn.id)
            if key in skip:
                continue
            out[key] = (True, write)
    return out


def _merge(*parts: dict) -> dict[tuple[str, str], tuple[bool, bool]]:
    merged: dict[tuple[str, str], tuple[bool, bool]] = {}
    for part in parts:
        merged.update(part)
    return merged


def all_permissions(write: bool = True) -> dict[tuple[str, str], tuple[bool, bool]]:
    return _grant([m.id for m in MODULES], write=write)


ROLE_DEFAULTS: dict[str, dict[tuple[str, str], tuple[bool, bool]]] = {
    "admin": all_permissions(True),
    "sales-manager": _merge(
        _grant(["sales-presales", "product-master-data"]),
        _grant(["mis-management"], write=False),
    ),
    "sales-executive": _grant(["sales-presales"]),
    "presales": _grant(["sales-presales", "product-master-data"]),
    "project-manager": _merge(
        _grant(["projects-installation", "product-master-data"]),
        _grant(["inventory-logistics", "assets-installed-base"], write=False),
        _grant(["mis-management"], write=False),
    ),
    "project-coordinator": _grant(["projects-installation"]),
    "technical-engineer": _grant(["projects-installation", "assets-installed-base"]),
    "purchase-manager": _merge(
        _grant(["purchase-procurement", "product-master-data"]),
        _grant(["inventory-logistics"], write=False),
    ),
    "purchase-executive": _grant(["purchase-procurement", "product-master-data"]),
    "store-manager": _grant(["inventory-logistics", "product-master-data"]),
    "store-executive": _grant(["inventory-logistics"]),
    "logistics": _grant(["inventory-logistics", "purchase-procurement"]),
    "service-manager": _merge(
        _grant(["service-amc", "assets-installed-base"]),
        _grant(["projects-installation"], write=False),
    ),
    "service-coordinator": _grant(["service-amc"]),
    "service-engineer": _grant(["service-amc", "assets-installed-base"]),
    "accounts": _merge(
        _grant(["mis-management"]),
        _grant(["sales-presales", "purchase-procurement"], write=False),
    ),
    "hr": _grant(
        ["organization-administration"],
        exclude=ADMIN_ONLY_FUNCTIONS,
    ),
}


def defaults_for_role(role_id: str) -> dict[tuple[str, str], tuple[bool, bool]]:
    return dict(ROLE_DEFAULTS.get(role_id, {}))

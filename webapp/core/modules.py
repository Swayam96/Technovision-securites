from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Function:
    id: str
    title: str


@dataclass(frozen=True, slots=True)
class Module:
    id: str
    title: str
    short: str
    icon: str
    fa_icon: str
    blurb: str
    functions: tuple[Function, ...]

    @property
    def entities(self) -> tuple[str, ...]:
        return tuple(fn.title for fn in self.functions)


MODULES: tuple[Module, ...] = (
    Module(
        "organization-administration",
        "Organization & Administration",
        "Org",
        "organization_administration.svg",
        "fas fa-building",
        "Company structure, employees, users, and HR operations.",
        (
            Function("company", "Company"),
            Function("branches", "Branches"),
            Function("departments", "Departments"),
            Function("designations", "Designations"),
            Function("users", "Users"),
            Function("permissions", "Permissions"),
            Function("employee-master", "Employee Master"),
            Function("employee-profile", "Employee Profile / Documents"),
            Function("attendance", "Attendance"),
            Function("leave", "Leave"),
            Function("shift", "Shift"),
            Function("overtime", "OT"),
            Function("night-shift", "Night Shift"),
            Function("payroll", "Payroll"),
        ),
    ),
    Module(
        "product-master-data",
        "Product & Master Data",
        "Products",
        "inventory_logistics.svg",
        "fas fa-boxes",
        "Item catalog, brands, attributes, and SKUs.",
        (
            Function("categories", "Product Categories / Item Groups"),
            Function("brands", "Brands"),
            Function("attributes", "Item Attributes"),
            Function("uom", "UOM"),
            Function("sku", "SKU / Item Master"),
            Function("product-import", "Product Import"),
        ),
    ),
    Module(
        "sales-presales",
        "Sales & Presales",
        "Sales",
        "presales_boq.svg",
        "fas fa-handshake",
        "Leads, surveys, BOQ, costing, and quotations.",
        (
            Function("client-enrollment", "Client / Customer Enrollment"),
            Function("lead", "Lead"),
            Function("enquiry", "Enquiry"),
            Function("site-survey", "Site Survey"),
            Function("requirement", "Requirement"),
            Function("boq-builder", "BOQ Builder"),
            Function("costing", "Costing"),
            Function("margin", "Margin"),
            Function("approval", "Management Approval"),
            Function("quotation", "Quotation"),
        ),
    ),
    Module(
        "purchase-procurement",
        "Purchase & Procurement",
        "Buy",
        "purchase_procurement.svg",
        "fas fa-shopping-cart",
        "Vendors, requisitions, RFQs, and purchase orders.",
        (
            Function("supplier", "Supplier / Vendor"),
            Function("purchase-requisition", "Purchase Requisition"),
            Function("rfq", "RFQ"),
            Function("vendor-comparison", "Vendor Comparison"),
            Function("purchase-order", "Purchase Order"),
            Function("material-receipt", "Material Receipt"),
        ),
    ),
    Module(
        "projects-installation",
        "Projects & Installation",
        "Projects",
        "projects_installation.svg",
        "fas fa-hard-hat",
        "Project sites, tasks, technicians, and closure.",
        (
            Function("project-master", "Project Master"),
            Function("site-details", "Site / Project Details"),
            Function("task-scheduler", "Task Scheduler"),
            Function("task-assignment", "Task Assignment"),
            Function("technician-allocation", "Technician Allocation"),
            Function("project-status", "New / WIP / Completed"),
            Function("installation-planning", "Installation Planning"),
            Function("progress", "Progress"),
            Function("terms", "T&C"),
            Function("closure", "Closure"),
        ),
    ),
    Module(
        "inventory-logistics",
        "Inventory & Logistics",
        "Stock",
        "inventory_logistics.svg",
        "fas fa-warehouse",
        "Warehouses, stock moves, serials, and dispatch.",
        (
            Function("warehouse", "Warehouse / Stores"),
            Function("stock", "Stock"),
            Function("stock-transfer", "Stock Transfer"),
            Function("material-issue", "Material Issue"),
            Function("material-return", "Material Return"),
            Function("serial-batch", "Serial / Batch Tracking"),
            Function("dispatch", "Dispatch / Logistics"),
        ),
    ),
    Module(
        "service-amc",
        "Service & AMC",
        "AMC",
        "service_amc.svg",
        "fas fa-tools",
        "Service calls, AMC, breakdowns, and closure.",
        (
            Function("service-request", "Service Request"),
            Function("service-call", "Service Call"),
            Function("technician-assignment", "Technician Assignment"),
            Function("preventive-maintenance", "Preventive Maintenance"),
            Function("amc", "AMC"),
            Function("breakdown", "Breakdown / Complaint"),
            Function("service-closure", "Service Closure"),
        ),
    ),
    Module(
        "assets-installed-base",
        "Assets / Installed Base",
        "Assets",
        "inventory_logistics.svg",
        "fas fa-server",
        "Customer equipment, serials, warranty, and AMC history.",
        (
            Function("customer-assets", "Customer Assets"),
            Function("installed-equipment", "Installed Equipment"),
            Function("serial-numbers", "Serial Numbers"),
            Function("installation-history", "Installation History"),
            Function("warranty", "Warranty"),
            Function("amc-history", "AMC History"),
        ),
    ),
    Module(
        "mis-management",
        "MIS & Management",
        "MIS",
        "mis_management.svg",
        "fas fa-chart-line",
        "Dashboards and management MIS.",
        (
            Function("sales-dashboard", "Sales Dashboard"),
            Function("project-dashboard", "Project Dashboard"),
            Function("service-dashboard", "Service Dashboard"),
            Function("procurement-dashboard", "Procurement Dashboard"),
            Function("inventory-dashboard", "Inventory Dashboard"),
            Function("employee-productivity", "Employee Productivity"),
            Function("management-mis", "Management MIS"),
        ),
    ),
)

MODULE_BY_ID = {module.id: module for module in MODULES}
FUNCTION_BY_KEY = {
    (module.id, fn.id): fn for module in MODULES for fn in module.functions
}


def get_module(module_id: str) -> Module | None:
    return MODULE_BY_ID.get(module_id)


def get_function(module_id: str, function_id: str) -> Function | None:
    return FUNCTION_BY_KEY.get((module_id, function_id))

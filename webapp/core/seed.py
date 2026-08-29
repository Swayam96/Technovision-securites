SEED_RECORDS: tuple[tuple[str, str, str, str, str, str], ...] = (
    # module_id, function_id, entity, title, status, notes
    ("sales-presales", "lead", "Lead", "Acme Security HQ — CCTV upgrade", "Open", "Warm lead from referral"),
    ("sales-presales", "client-enrollment", "Client / Customer Enrollment", "Harbor Logistics Pvt Ltd", "Active", "Existing AMC client"),
    ("sales-presales", "boq-builder", "BOQ Builder", "Plant-B access control BOQ", "Draft", "Awaiting site measurements"),
    ("purchase-procurement", "purchase-order", "Purchase Order", "PO-1042 Hikvision NVRs", "Ordered", "ETA 10 days"),
    ("inventory-logistics", "warehouse", "Warehouse / Stores", "Pune Central Store", "Active", "Primary spare parts hub"),
    ("projects-installation", "project-master", "Project Master", "Skyline Mall Phase-2", "In Progress", "Cameras + boom barriers"),
    ("service-amc", "service-request", "Service Request", "Gate reader offline — Unit 14", "Open", "Priority medium"),
    ("assets-installed-base", "installed-equipment", "Installed Equipment", "Harbor Logistics — Gate 2 reader", "Active", "Installed 2024"),
    ("organization-administration", "employee-master", "Employee Master", "Riya Sharma — Project Lead", "Active", "West region"),
    ("mis-management", "management-mis", "Management MIS", "August installation SLA", "Published", "94% on-time"),
    ("product-master-data", "sku", "SKU / Item Master", "Hikvision DS-2CD2143G2 4MP Dome", "Active", "Standard CCTV SKU"),
    ("product-master-data", "brands", "Brands", "Hikvision", "Active", "Primary camera vendor"),
)

# username, full_name, role_id, password, must_change_password
SEED_USERS: tuple[tuple[str, str, str, str, int], ...] = (
    ("admin", "TE Management", "admin", "admin123", 0),
)

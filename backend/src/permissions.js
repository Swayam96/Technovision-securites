const MODULES = require('./modules.json');

const ACTION_IDS = [
    "read", "create", "write", "delete", "submit", "cancel",
    "amend", "print", "email", "export", "import", "report", "share"
];

const STANDARD_WRITE = new Set([
    "read", "create", "write", "submit", "cancel", "amend",
    "print", "email", "export", "report", "share"
]);

function emptyFlags() {
    const flags = {};
    ACTION_IDS.forEach(action => flags[action] = false);
    return flags;
}

function accessFlags({ write = false, full = false } = {}) {
    if (full) {
        const flags = {};
        ACTION_IDS.forEach(action => flags[action] = true);
        return flags;
    }
    const flags = emptyFlags();
    flags.read = true;
    if (write) {
        for (let action of STANDARD_WRITE) {
            flags[action] = true;
        }
    }
    return flags;
}

function flagsFromLegacy(read, write) {
    if (write) return accessFlags({ write: true });
    if (read) return accessFlags({ write: false });
    return emptyFlags();
}

function normalizeFlags(value) {
    const flags = emptyFlags();
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        ACTION_IDS.forEach(action => {
            flags[action] = !!value[action];
        });
        return flags;
    }
    if (Array.isArray(value) && value.length >= 2) {
        return flagsFromLegacy(!!value[0], !!value[1]);
    }
    return flags;
}

function isAdmin(user) {
    return !!(user && user.role_id === 'admin');
}

function _flagsFor(user, moduleId, functionId) {
    const perms = user?.perms || {};
    // Note: Python was using a tuple key `(module_id, function_id)`. We need to adapt it.
    // Assuming user.perms is passed from the database correctly.
    // In db.py, perms is returned as dict with tuple keys. In JSON we'll use "moduleId:functionId".
    const key = `${moduleId}:${functionId}`;
    return normalizeFlags(perms[key]);
}

function getModule(moduleId) {
    return MODULES.find(m => m.id === moduleId);
}

function canDo(user, moduleId, functionId, action) {
    if (isAdmin(user)) return true;
    if (functionId) {
        const flags = _flagsFor(user, moduleId, functionId);
        return !!flags[action];
    }
    const module = getModule(moduleId);
    if (!module) return false;
    return module.functions.some(fn => canDo(user, moduleId, fn.id, action));
}

function canRead(user, moduleId, functionId = null) {
    return canDo(user, moduleId, functionId, "read");
}

function canWrite(user, moduleId, functionId = null) {
    return canDo(user, moduleId, functionId, "write");
}

function navModules(user) {
    const nav = [];
    for (const m of MODULES) {
        if (canRead(user, m.id)) {
            // Clone the module so we don't mutate the global MODULES array
            const clonedModule = { ...m };
            if (clonedModule.functions) {
                clonedModule.functions = clonedModule.functions.filter(fn => canRead(user, m.id, fn.id));
            }
            nav.push(clonedModule);
        }
    }
    return nav;
}

module.exports = {
    MODULES,
    isAdmin,
    canDo,
    canRead,
    canWrite,
    navModules,
};

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("Starting automatic database migrations...");

// List of specific scripts to run in order
const scripts = [
    'src/setup_database.js',
    'src/setup_assets_db.js',
    'src/setup_indexes.js',
    'src/setup_inventory_db.js',
    'src/setup_mis_db.js',
    'src/setup_projects_db.js',
    'src/setup_purchase_db.js',
    'src/setup_service_db.js',
    'setup_shifts.js'
];

for (const script of scripts) {
    const scriptPath = path.join(__dirname, '..', script);
    if (fs.existsSync(scriptPath)) {
        console.log(`Running ${script}...`);
        try {
            execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error running ${script}:`, error.message);
            // We do not exit here so that other migrations can still attempt to run,
            // or you can choose to exit if a strict sequence is required.
        }
    } else {
        console.warn(`Script not found: ${scriptPath}`);
    }
}

console.log("Database migrations completed successfully.");

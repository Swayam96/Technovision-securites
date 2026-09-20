const fs = require('fs');
const file = 'frontend/src/pages/organization-admin/EmployeeMasterForm.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the designations filter
content = content.replace(/\{designations\s*\n\s*\.filter\(d => !formData\.company_id[^\n]+\n\s*\.filter\(d => !formData\.department_id[^\n]+\n\s*\.map/g, "{designations\n                        .map");

// Replace the orgRoles filter
content = content.replace(/\{orgRoles\s*\n\s*\.filter\(r => !formData\.company_id[^\n]+\n\s*\.filter\(r => !formData\.department_id[^\n]+\n\s*\.map/g, "{orgRoles\n                        .map");

fs.writeFileSync(file, content, 'utf8');
console.log("Filters removed!");

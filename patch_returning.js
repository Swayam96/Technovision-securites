const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend/src/models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

let updated = 0;

for (const file of files) {
    const filePath = path.join(modelsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern 1: INSERT INTO xxx (...) VALUES (...)`,
    // Replace with: INSERT INTO xxx (...) VALUES (...) RETURNING id`,
    content = content.replace(/\) VALUES \(\$\{placeholders\}\)`,\s*values\);/g, ") VALUES (${placeholders}) RETURNING id`, values);");
    
    // Pattern 2: Employee_profile.js
    if (file === 'employee_profile.js') {
        content = content.replace(/ \?\)`,/g, " ?) RETURNING id`,");
    }
    
    // Pattern 3: leave.js, attendance.js etc if they use execute("INSERT INTO...
    if (file === 'leave.js') {
        content = content.replace(/VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?\)`,/g, "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,");
    }
    
    if (file === 'attendance.js') {
        content = content.replace(/VALUES \(\?, \?, \?, \?\)','/g, "VALUES (?, ?, ?, ?) RETURNING id','"); // wait this is a string
        content = content.replace(/VALUES \(\?, \?, \?, \?'/g, "VALUES (?, ?, ?, ?) RETURNING id'"); 
        content = content.replace(/VALUES \(\?, \?, \?, \?\)','/g, "VALUES (?, ?, ?, ?) RETURNING id',"); // array element
    }
    
    if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        updated++;
    }
}

console.log(`Updated ${updated} models with RETURNING id.`);

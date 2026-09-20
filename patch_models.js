const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend/src/models');

const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

let updated = 0;

for (const file of files) {
    const filePath = path.join(modelsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to replace:
    // const values = SOMETHING_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    // with:
    // const values = SOMETHING_COLUMNS.map(c => {
    //     let val = data[c] !== undefined ? data[c] : null;
    //     if (val === "" && c.endsWith("_id")) val = null;
    //     return val;
    // });
    
    const regex = /const values = ([A-Z_]+)\.map\(c => data\[c\] !== undefined \? data\[c\] : null\);/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, `const values = $1.map(c => {
        let val = data[c] !== undefined ? data[c] : null;
        if (val === "" && c.endsWith("_id")) val = null;
        return val;
    });`);
        fs.writeFileSync(filePath, content, 'utf8');
        updated++;
    }
}

console.log(`Updated ${updated} models.`);

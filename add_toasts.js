const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/src/pages');

function getFormFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFormFiles(filePath, fileList);
        } else if (file.endsWith('Form.jsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const formFiles = getFormFiles(pagesDir);

let changed = 0;

for (const file of formFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('react-hot-toast')) {
        continue;
    }

    // Insert import at the top (after the first import)
    content = content.replace(/import React[^;]*;\n/, "$&\nimport toast from 'react-hot-toast';\n");
    // If no match for some reason, prepend
    if (!content.includes('react-hot-toast')) {
        content = "import toast from 'react-hot-toast';\n" + content;
    }

    // Look for `navigate(`/modules/` inside the file, but we must only replace the one in the success block.
    
    const hasIsEdit = content.includes('const isEdit');
    const toastMsg = hasIsEdit ? "toast.success(isEdit ? 'Updated successfully!' : 'Created successfully!');" : "toast.success('Saved successfully!');";

    // Most navigate calls in handleSubmit are preceded by whitespace (tabs/spaces).
    // The cancel button usually looks like: `onClick={() => navigate('/modules/` or `onClick={() => navigate('...`
    // We can avoid replacing the onClick by looking for newline + whitespace + navigate.
    
    content = content.replace(/(\n\s*)navigate\(['"`]\/modules\//g, `$1${toastMsg}$1navigate('/modules/`);
    
    fs.writeFileSync(file, content, 'utf8');
    changed++;
}

console.log(`Updated ${changed} files.`);

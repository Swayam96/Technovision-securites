import re

file_path = r'd:\SEM 6\technovision with react and node\frontend\src\App.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace React import if needed
if 'Suspense' not in content:
    content = content.replace("import React from 'react';", "import React, { Suspense } from 'react';\nimport Loader from './components/Loader';")

# Find all imports like: import Dashboard from './pages/core/Dashboard';
# But ignore layout/auth components if we don't want to lazy load them?
# Let's just lazy load everything under './pages' except maybe Login and NotFound
def replacer(match):
    comp = match.group(1)
    path = match.group(2)
    if comp in ['Login', 'ChangePassword', 'NotFound']:
        return match.group(0) # Keep as standard import
    return f"const {comp} = React.lazy(() => import('{path}'));"

content = re.sub(r"import\s+([A-Za-z0-9_]+)\s+from\s+'(\./pages/[^']+)';", replacer, content)

# Ensure Routes are wrapped in Suspense
if '<Suspense fallback={<Loader />}>' not in content:
    content = content.replace('<Routes>', '<Suspense fallback={<Loader />}><Routes>')
    content = content.replace('</Routes>', '</Routes></Suspense>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.jsx successfully")

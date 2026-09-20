import os
import re

PAGES_DIR = r"d:\SEM 6\technovision with react and node\frontend\src\pages"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already injected
    if 'DataImportExport' in content:
        return

    # Check if there is a 'New' button
    new_btn_match = re.search(r'(<button[^>]*onClick=\{.*?navigate\([^)]*new[^)]*\)\}[^>]*>.*?New.*?</button>)', content, re.IGNORECASE | re.DOTALL)
    if not new_btn_match:
        # Try finding a Link to new
        new_btn_match = re.search(r'(<Link[^>]*to=\{?[^}]*new[^}]*\}?[^>]*>.*?New.*?</Link>)', content, re.IGNORECASE | re.DOTALL)
        if not new_btn_match:
            return

    new_btn_code = new_btn_match.group(1)
    
    # Guess the data variable (e.g. users from setUsers, items from setItems)
    state_match = re.search(r'const\s+\[([a-zA-Z0-9_]+),\s*set[a-zA-Z0-9_]+\]\s*=\s*useState\(\[\]\)', content)
    if not state_match:
        return
    data_var = state_match.group(1)

    # Guess the fetch function
    fetch_match = re.search(r'const\s+([a-zA-Z0-9_]+)\s*=\s*async\s*\(\)\s*=>\s*\{[^}]*axios\.get\([\'"]\/api\/([a-zA-Z0-9_-]+)', content)
    fetch_fn = fetch_match.group(1) if fetch_match else '() => window.location.reload()'
    table_name = fetch_match.group(2) if fetch_match else data_var
    # some table names have hyphens in api, let's just replace hyphens with underscores
    table_name = table_name.replace('-', '_')

    # Determine import depth
    rel_path = os.path.relpath(filepath, PAGES_DIR)
    depth = rel_path.count(os.sep) + 1
    import_prefix = '../' * depth
    import_stmt = f"import DataImportExport from '{import_prefix}components/DataImportExport';"

    # Insert import after React import
    content = re.sub(r"(import React.*?;\n)", r"\1" + import_stmt + "\n", content, count=1)

    # Insert DataImportExport component after New button
    component_code = f'\n          <DataImportExport data={{{data_var}}} tableName="{table_name}" onImportSuccess={{{fetch_fn}}} />'
    new_content = content.replace(new_btn_code, new_btn_code + component_code)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected into {rel_path}")

for root, dirs, files in os.walk(PAGES_DIR):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))


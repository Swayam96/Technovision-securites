import os
import re

PAGES_DIR = r"d:\SEM 6\technovision with react and node\frontend\src\pages"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for {loading ? ... Loading... ... } pattern inside <tbody>
    # We want to match: <tr><td colSpan="X"...>Loading...</td></tr>
    
    # Let's find loading indicator with colSpan
    match = re.search(r'<tr>\s*<td[^>]*colSpan={?["\']?(\d+)["\']?}?[^>]*>.*?[Ll]oading.*?</td>\s*</tr>', content, re.IGNORECASE | re.DOTALL)
    
    if not match:
        return

    col_span = match.group(1)
    
    # We also need to import TableSkeleton
    if 'TableSkeleton' not in content:
        # Determine import depth
        rel_path = os.path.relpath(filepath, PAGES_DIR)
        depth = rel_path.count(os.sep) + 1
        import_prefix = '../' * depth
        import_stmt = f"import TableSkeleton from '{import_prefix}components/TableSkeleton';"
        
        content = re.sub(r"(import React.*?;\n)", r"\1" + import_stmt + "\n", content, count=1)

    # Replace the exact match with TableSkeleton
    new_loader = f'<TableSkeleton columns={{{col_span}}} />'
    content = content.replace(match.group(0), new_loader)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Injected TableSkeleton into {rel_path} with {col_span} columns")

for root, dirs, files in os.walk(PAGES_DIR):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))


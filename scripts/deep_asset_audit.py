import os
import re
import sys
from collections import defaultdict

assets_dir = "app/src/main/assets/www"
extensions_to_parse = ['.js', '.html', '.css', '.json']
image_extensions = ['.png', '.gif', '.webp']

def find_files(dir_path, extensions):
    files = []
    for root, dirs, filenames in os.walk(dir_path):
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                files.append(os.path.join(root, filename))
    return files

def extract_references(content):
    # Simple regex to find image paths in quotes
    pattern = r'["\']([^"\']*\.(?:png|gif|webp))["\']'
    matches = re.findall(pattern, content, re.IGNORECASE)
    return matches

def resolve_path(base_dir, ref, assets_dir):
    if ref.startswith('/'):
        # Treat as absolute from assets root
        return os.path.join(assets_dir, ref.lstrip('/'))
    else:
        # Relative to base_dir
        return os.path.join(base_dir, ref)

def main():
    if not os.path.exists(assets_dir):
        print(f"Assets directory {assets_dir} not found")
        sys.exit(1)

    parsed_files = find_files(assets_dir, extensions_to_parse)
    referenced = set()
    for file_path in parsed_files:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            continue
        refs = extract_references(content)
        base_dir = os.path.dirname(file_path)
        for ref in refs:
            resolved = resolve_path(base_dir, ref, assets_dir)
            resolved = os.path.normpath(resolved)
            referenced.add(resolved)

    # Find all actual assets
    actual_assets = set()
    duplicates = defaultdict(list)
    for root, dirs, filenames in os.walk(assets_dir):
        for filename in filenames:
            if any(filename.lower().endswith(ext) for ext in image_extensions):
                full_path = os.path.join(root, filename)
                actual_assets.add(full_path)
                basename = os.path.basename(filename)
                duplicates[basename].append(full_path)

    # Duplicates: same basename in different locations
    duplicate_files = {name: paths for name, paths in duplicates.items() if len(paths) > 1}

    # Missing: referenced not in actual
    missing = referenced - actual_assets

    # Orphaned: actual not in referenced
    orphaned = actual_assets - referenced

    # Report
    print("Asset Integrity Report")
    print("======================")
    if missing:
        print("Missing Assets:")
        for m in sorted(missing):
            print(f"  {m}")
    else:
        print("No missing assets.")

    if duplicate_files:
        print("Duplicate Files (same name):")
        for name, paths in sorted(duplicate_files.items()):
            print(f"  {name}:")
            for p in paths:
                print(f"    {p}")
    else:
        print("No duplicate files.")

    if orphaned:
        print("Orphaned Files:")
        for o in sorted(orphaned):
            print(f"  {o}")
    else:
        print("No orphaned files.")

    # Fail if missing or duplicates
    if missing or duplicate_files:
        print("Issues found. Exiting with error.")
        sys.exit(1)
    else:
        print("All checks passed.")

if __name__ == "__main__":
    main()

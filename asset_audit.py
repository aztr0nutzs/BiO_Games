
import os
import re
import glob

# Asset directories to scan for unused files
ASSET_DIRS = [
    'bio_assets',
    'cabinets_symbols',
    'new_slot',
    'new_symbols',
    'knxt4/assets',
    'wheel'
]

# File types to scan for asset references
SCAN_FILES = ['.html', '.js']

# Regex to find asset references in files
# This will find anything that looks like a file path with an image/audio extension
ASSET_REGEX = r'["']([^"']+\.(?:png|jpg|jpeg|gif|svg|wav|mp3|ogg))["']'

def find_referenced_assets(root_dir):
    """Find all asset paths referenced in the project's code."""
    referenced_assets = set()
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if any(filename.endswith(ext) for ext in SCAN_FILES):
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    found_paths = re.findall(ASSET_REGEX, content)
                    for path in found_paths:
                        # Normalize the path
                        normalized_path = os.path.normpath(os.path.join(os.path.dirname(file_path), path))
                        referenced_assets.add(normalized_path)
                except Exception as e:
                    print(f"Could not read {file_path}: {e}")
    return referenced_assets

def find_all_assets(root_dir):
    """Find all asset files in the asset directories."""
    all_assets = set()
    for asset_dir in ASSET_DIRS:
        full_asset_dir = os.path.join(root_dir, asset_dir)
        for dirpath, _, filenames in os.walk(full_asset_dir):
            for filename in filenames:
                if any(filename.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.wav', '.mp3', '.ogg']):
                    all_assets.add(os.path.join(dirpath, filename))
    return all_assets

def run_audit(root_dir):
    """Performs the asset audit."""
    print("Starting asset audit...")
    
    referenced_assets = find_referenced_assets(root_dir)
    all_assets = find_all_assets(root_dir)

    # Normalize all asset paths for comparison
    all_assets_normalized = {os.path.normpath(p) for p in all_assets}

    # 1. Check for missing files (referenced but not found)
    print("\n--- Checking for Missing Assets (Referenced but not on disk) ---")
    missing_assets = []
    for ref_asset in referenced_assets:
        if ref_asset not in all_assets_normalized:
            # Check if the path is trying to go up directories and if we can resolve it
            # This is a naive check, might need more robust path resolution
            if not os.path.exists(ref_asset):
                 missing_assets.append(ref_asset)

    if missing_assets:
        for asset in missing_assets:
            print(f"  - MISSING: {asset}")
    else:
        print("  ✅ No missing assets found.")

    # 2. Check for unused files (on disk but not referenced)
    print("\n--- Checking for Unused Assets (On disk but not referenced) ---")
    
    # We need to see if the *relative* path of an on-disk asset is in any of the reference paths
    referenced_assets_basenames = {os.path.basename(p) for p in referenced_assets}
    
    unused_assets = []
    for asset_path in all_assets_normalized:
        if os.path.basename(asset_path) not in referenced_assets_basenames:
            unused_assets.append(asset_path)

    if unused_assets:
        print(f"  Found {len(unused_assets)} potentially unused assets.")
        for asset in unused_assets:
            print(f"  - UNUSED: {asset}")
    else:
        print("  ✅ No unused assets found.")
        
    # 3. Check for absolute paths
    print("\n--- Checking for Absolute Paths in Code ---")
    absolute_paths_found = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if any(filename.endswith(ext) for ext in SCAN_FILES):
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    # A bit of a naive check for absolute-like paths
                    if re.search(r'["'](/|C:)[^"']+', content):
                        absolute_paths_found.append(file_path)
                except: # ignore files we cant read
                    pass
                        
    if absolute_paths_found:
        for path in set(absolute_paths_found):
            print(f"  - POTENTIAL ABSOLUTE PATH in: {path}")
    else:
        print("  ✅ No absolute paths found.")


if __name__ == '__main__':
    project_root = os.path.dirname(os.path.abspath(__file__))
    run_audit(project_root)

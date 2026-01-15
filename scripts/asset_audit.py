#!/usr/bin/env python3
"""
Asset Audit Script - Phase 2
Scans for missing files, unused files, and broken paths in the project
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

class AssetAuditor:
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.asset_references = defaultdict(list)
        self.asset_files = set()
        self.missing_assets = []
        self.unused_assets = []
        
    def scan_asset_files(self):
        """Scan all asset directories for files"""
        asset_dirs = [
            'app/src/main/assets/www',
            'bio_assets',
            'bio_slotz',
            'knxt4',
            'wheel',
            'new_slot',
            'new_symbols',
            'cabinets_symbols'
        ]
        
        for asset_dir in asset_dirs:
            dir_path = self.project_root / asset_dir
            if dir_path.exists():
                for file_path in dir_path.rglob('*'):
                    if file_path.is_file():
                        rel_path = file_path.relative_to(self.project_root)
                        self.asset_files.add(str(rel_path))
        
        print(f"Found {len(self.asset_files)} asset files")
    
    def scan_references(self):
        """Scan code files for asset references"""
        patterns = [
            r'["\']([^"\']*\.(png|jpg|jpeg|gif|svg|mp3|wav|ogg|html|css|js))["\']',
            r'file:///android_asset/www/([^\'"]+)',
            r'assets/([^\'"]+\.(png|jpg|jpeg|gif|svg|mp3|wav|ogg))',
        ]
        
        code_extensions = ['.js', '.html', '.css', '.java', '.kt']
        
        for file_path in self.project_root.rglob('*'):
            if file_path.is_file() and file_path.suffix in code_extensions:
                try:
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                    for pattern in patterns:
                        matches = re.findall(pattern, content)
                        for match in matches:
                            asset_ref = match[0] if isinstance(match, tuple) else match
                            self.asset_references[asset_ref].append(str(file_path.relative_to(self.project_root)))
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
        
        print(f"Found {len(self.asset_references)} asset references")
    
    def find_missing_assets(self):
        """Find referenced assets that don't exist"""
        for asset_ref, referencing_files in self.asset_references.items():
            found = False
            for asset_file in self.asset_files:
                if asset_ref in asset_file or asset_file.endswith(asset_ref):
                    found = True
                    break
            
            if not found:
                self.missing_assets.append({
                    'asset': asset_ref,
                    'referenced_in': referencing_files
                })
        
        print(f"Found {len(self.missing_assets)} missing assets")
    
    def find_unused_assets(self):
        """Find assets that are never referenced"""
        referenced_files = set()
        for asset_ref in self.asset_references.keys():
            for asset_file in self.asset_files:
                if asset_ref in asset_file or asset_file.endswith(asset_ref):
                    referenced_files.add(asset_file)
        
        self.unused_assets = list(self.asset_files - referenced_files)
        print(f"Found {len(self.unused_assets)} potentially unused assets")
    
    def generate_report(self, output_file='asset_audit_report.json'):
        """Generate audit report"""
        report = {
            'total_assets': len(self.asset_files),
            'total_references': len(self.asset_references),
            'missing_assets': self.missing_assets,
            'unused_assets': self.unused_assets[:100],  # Limit to first 100
            'summary': {
                'missing_count': len(self.missing_assets),
                'unused_count': len(self.unused_assets)
            }
        }
        
        output_path = self.project_root / output_file
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\nReport saved to {output_path}")
        print(f"\nSummary:")
        print(f"  Total assets: {report['total_assets']}")
        print(f"  Missing assets: {report['summary']['missing_count']}")
        print(f"  Unused assets: {report['summary']['unused_count']}")
        
        if self.missing_assets:
            print(f"\nMissing assets:")
            for item in self.missing_assets[:10]:
                print(f"  - {item['asset']}")
                print(f"    Referenced in: {', '.join(item['referenced_in'][:3])}")

if __name__ == '__main__':
    auditor = AssetAuditor('.')
    auditor.scan_asset_files()
    auditor.scan_references()
    auditor.find_missing_assets()
    auditor.find_unused_assets()
    auditor.generate_report()

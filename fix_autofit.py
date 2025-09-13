#!/usr/bin/env python3
import re

# Read the file
with open('/Users/marcusberley/nextjs-blog/create_streamlined_dashboard.py', 'r') as f:
    content = f.read()

# Pattern to match the auto-fit columns sections
pattern = r'        # Auto-fit columns\n(.*?)\n            ws\.column_dimensions\[column_letter\]\.width = .*?\n'

# Replacement
replacement = '        # Auto-fit columns\n        self.auto_fit_columns(ws)\n'

# Replace all occurrences
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back to the file
with open('/Users/marcusberley/nextjs-blog/create_streamlined_dashboard.py', 'w') as f:
    f.write(content)

print("Fixed auto-fit column sections")
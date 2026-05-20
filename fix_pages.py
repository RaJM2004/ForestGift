import os
import re

pages_dir = r"c:\Users\DELL\Downloads\ZeroKost\ANVRikh_Project\ForestGift-main\ForestGift-main\client\src\features\user\pages"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update imports
    content = content.replace('from "react-router"', 'from "react-router-dom"')
    content = content.replace('from "motion/react"', 'from "framer-motion"')
    
    # 2. Add local Link if it doesn't exist or replace it with a simple span/div
    content = content.replace('<Link to="/"', '<div')
    content = content.replace('</Link>', '</div>')

    # 3. Simplify the shell
    # Find the main return block and simplify it
    # We want to remove the full min-h-screen container and headers
    pattern = re.compile(r'return\s*\(\s*<div className="min-h-screen bg-background">.*?<div className="p-4 md:p-6">', re.DOTALL)
    content = pattern.sub('return (\n    <div className="pb-24">', content)
    
    # Remove the bottom MobileNav call
    content = re.sub(r'<MobileNav\s*/>', '', content)
    
    # Remove the extra DesktopSidebar function at the end
    content = re.sub(r'function DesktopSidebar.*?}\s*$', '', content, flags=re.DOTALL)
    # Remove the extra SidebarLink function
    content = re.sub(r'function SidebarLink.*?}\s*$', '', content, flags=re.DOTALL)
    
    # Remove component imports that are now unused/redundant
    content = re.sub(r'import { MobileHeader } from ".*?";', '', content)
    content = re.sub(r'import { MobileNav } from ".*?";', '', content)
    content = re.sub(r'import { Link,.*? } from "react-router-dom";', 'import { Link } from "react-router-dom";', content)

    # 4. Fix closing divs
    # We replaced the start with <div className="pb-24">, so we need to match the closing divs carefully.
    # The original had 4 divs deep at the content start: min-h-screen -> DesktopSidebar(X) -> ml-60 -> content-padding
    # Now we just have 1. Let's try to fix the end by removing the extra 2 closing divs.
    content = content.replace('      </div>\n    </div>\n\n    {/* Mobile Bottom Navigation */}\n\n  );\n}', '    </div>\n  );\n}')
    content = content.replace('      </div>\n    </div>\n\n  );\n}', '    </div>\n  );\n}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(pages_dir):
    if filename.endswith(".tsx"):
        print(f"Processing {filename}...")
        process_file(os.path.join(pages_dir, filename))

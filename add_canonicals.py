import os
from bs4 import BeautifulSoup

BASE_URL = "https://ai20.city"
ROOT_DIR = "."
EXCLUDE_DIRS = {"dist", "node_modules", ".git", ".tmp", ".agent", "backend", "execution", "directives"}

def add_canonical_tags():
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                
                # Calculate canonical URL
                rel_path = path.replace("\\", "/").replace("./", "")
                if rel_path == "index.html":
                    canonical_url = BASE_URL + "/"
                else:
                    canonical_url = BASE_URL + "/" + rel_path
                
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    soup = BeautifulSoup(content, "html.parser")
                    
                    if not soup.head:
                        print(f"Skipping {path}: No <head> tag found.")
                        continue
                        
                    # Check if canonical tag exists
                    existing_canonical = soup.find("link", {"rel": "canonical"})
                    if existing_canonical:
                        if existing_canonical['href'] == canonical_url:
                            # print(f"Skipping {path}: Canonical tag already exists and is correct.")
                            continue
                        else:
                            print(f"Updating {path}: Canonical tag exists but differs. updating...")
                            existing_canonical['href'] = canonical_url
                    else:
                        # Append new canonical tag
                        new_tag = soup.new_tag("link", rel="canonical", href=canonical_url)
                        soup.head.append(new_tag)
                        soup.head.append("\n  ") # Formatting
                        print(f"Added canonical to {path}")
                    
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(str(soup))
                    
                    count += 1
                    
                except Exception as e:
                    print(f"Error processing {path}: {e}")

    print(f"Finished. Modified {count} files.")

if __name__ == "__main__":
    add_canonical_tags()

import os
from datetime import datetime

BASE_URL = "https://ai20.city"
ROOT_DIR = "."
EXCLUDE_DIRS = {"dist", "node_modules", ".git", ".tmp", ".agent", "backend", "execution", "directives"}
EXCLUDE_FILES = {"google", "yandex"} # heuristics to exclude verification files if any

def generate_sitemap():
    urls = []
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Modify dirs in-place to exclude unwanted directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                # Normalize path separators
                path = path.replace("\\", "/")
                
                # Remove leading ./
                if path.startswith("./"):
                    path = path[2:]
                
                # Construct URL
                if path == "index.html":
                    url = BASE_URL + "/"
                else:
                    url = BASE_URL + "/" + path
                
                # Get last modified time
                last_mod = datetime.fromtimestamp(os.path.getmtime(os.path.join(root, file))).strftime('%Y-%m-%d')
                
                urls.append((url, last_mod))

    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url, last_mod in urls:
        sitemap_content += '  <url>\n'
        sitemap_content += f'    <loc>{url}</loc>\n'
        sitemap_content += f'    <lastmod>{last_mod}</lastmod>\n'
        sitemap_content += '  </url>\n'
    
    sitemap_content += '</urlset>'
    
    with open("sitemap.xml", "w") as f:
        f.write(sitemap_content)
    
    print(f"Generated sitemap.xml with {len(urls)} URLs.")

if __name__ == "__main__":
    generate_sitemap()

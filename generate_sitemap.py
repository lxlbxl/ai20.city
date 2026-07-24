import os
from datetime import datetime
import region_config as rc

BASE_URL = rc.REGION_CFG["origin"]  # region-aware host (eu./us.ai20.city)
ROOT_DIR = "."
EXCLUDE_DIRS = {"dist", "node_modules", ".git", ".tmp", ".agent", "backend", "execution", "directives"}
EXCLUDE_FILES = {"google", "yandex"} # heuristics to exclude verification files if any

def generate_sitemap():
    urls = []
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Modify dirs in-place to exclude unwanted directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            # Apex-only chooser + admin shell don't belong in a regional sitemap.
            if file in ("region-select.html", "admin.html"):
                continue
            if file.endswith(".html"):
                full = os.path.join(root, file)
                # Never advertise a noindex page in the sitemap (city x niche
                # pages are noindex until they carry verified local data).
                try:
                    with open(full, "r", encoding="utf-8", errors="ignore") as fh:
                        head = fh.read(4000)
                    if "noindex" in head:
                        continue
                except OSError:
                    pass
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
    
    # Vite copies public/ into dist/, so the sitemap must live there or a stale
    # copy silently wins. public/ is what actually ships.
    os.makedirs("public", exist_ok=True)
    for target in ("public/sitemap.xml", "sitemap.xml"):
        with open(target, "w", encoding="utf-8") as f:
            f.write(sitemap_content)

    generate_robots()

    print(f"Generated sitemap.xml with {len(urls)} URLs (region: {rc.REGION}).")


def generate_robots():
    """Per-region robots.txt pointing at THIS region's own sitemap."""
    lines = [
        "User-agent: *",
        "Allow: /",
        "",
        "Disallow: /admin.html",
        "",
        f"Sitemap: {BASE_URL}/sitemap.xml",
        "",
    ]
    os.makedirs("public", exist_ok=True)
    with open("public/robots.txt", "w", encoding="utf-8") as f:
        f.write(chr(10).join(lines))
    print(f"Generated public/robots.txt -> {BASE_URL}/sitemap.xml")


if __name__ == "__main__":
    generate_sitemap()

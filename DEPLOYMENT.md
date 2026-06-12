# Deployment Strategy

This repository contains thousands of dynamically generated pages (like `locations/` pages and `sitemap.xml`). To keep version control clean, fast, and avoid timeout issues, **we do not commit the generated HTML files to GitHub**.

Instead, we generate these files dynamically during the CI/CD deployment process.

## How it Works
The `package.json` build script has been configured to automatically run the Python generators before running the Vite build:

```json
"build": "python generate_locations.py && python generate_sitemap.py && vite build"
```

This means your hosting provider will handle generating the thousands of local pages on their servers right before deploying the final static site.

## Deployment Instructions

### For Vercel / Netlify / Cloudflare Pages

1. Connect your GitHub repository (`ai20.city`) to your hosting platform.
2. The platform will automatically detect the Vite framework and Node.js environment.
3. Configure the build settings as follows:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output / Publish Directory:** `dist`
4. **Important:** Your hosting provider must have Python installed in its build environment (most standard Ubuntu build images on Vercel/Netlify have Python 3 pre-installed).

### Running Locally

To generate the files on your own machine for testing:
```bash
npm run build
```

This will run the python scripts to generate `locations/` and `sitemap.xml`, and then bundle everything into the `dist/` directory.

### `.gitignore` Note
The `locations/` directory and `public/sitemap.xml` (or `sitemap.xml`) are ignored in `.gitignore` so you don't accidentally push 8,000+ files to GitHub and break the remote connection.

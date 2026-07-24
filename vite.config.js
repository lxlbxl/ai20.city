import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
import regionPlugin, { resolveRegion } from './vite-plugin-region.js';

// Find all HTML files
const htmlFiles = glob.sync('**/*.html', {
    ignore: ['dist/**', 'node_modules/**']
});

const input = htmlFiles.reduce((acc, file) => {
    const name = file.replace(/\.html$/, '').replace(/\\/g, '/');
    acc[name] = resolve(__dirname, file);
    return acc;
}, {});

const REGION = resolveRegion();

export default defineConfig({
    base: './',
    plugins: [regionPlugin()],
    // Bake the active region into the client bundle (region-config.js reads this).
    define: {
        'import.meta.env.VITE_REGION': JSON.stringify(REGION),
    },
    build: {
        rollupOptions: {
            input,
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        },
        outDir: 'dist',
    },
    // Proxy for local development to the PHP backend
    server: {
        proxy: {
            '/backend/api': {
                target: 'http://localhost:8000', // Assuming you run php -S localhost:8000
                changeOrigin: true,
            }
        }
    }
});

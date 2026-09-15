const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const SPA_ROUTES = new Set([
    '/',
    '/products',
    '/gift-boxes',
    '/price-list',
    '/how-to-order',
    '/about',
    '/contact'
]);

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': (ext === '.html' || ext === '.css' || ext === '.js')
            ? 'no-cache, no-store, must-revalidate'
            : 'public, max-age=86400'
    });

    fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
    let cleanUrl;
    try {
        cleanUrl = decodeURIComponent(req.url.split('?')[0]);
    } catch (e) {
        cleanUrl = req.url.split('?')[0];
    }

    // Normalize trailing slash (except root '/')
    const normalizedPath = cleanUrl.length > 1 && cleanUrl.endsWith('/')
        ? cleanUrl.slice(0, -1)
        : cleanUrl;

    // Check if it's one of the SPA / page routes
    if (SPA_ROUTES.has(normalizedPath)) {
        const indexPath = path.join(__dirname, 'index.html');
        return serveFile(indexPath, res);
    }

    // Resolve static file path
    let filePath = path.join(__dirname, cleanUrl);

    // Safety check against directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            return serveFile(filePath, res);
        }

        // Handle subpath requests for static assets (e.g. /products/css/style.css -> /css/style.css)
        const assetMatch = cleanUrl.match(/\/(css|js|assets)\/.+/i);
        if (assetMatch) {
            const fallbackPath = path.join(__dirname, assetMatch[0]);
            if (fallbackPath.startsWith(__dirname) && fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
                return serveFile(fallbackPath, res);
            }
        }

        // If request has no extension, fallback to index.html (SPA routing support)
        if (!path.extname(cleanUrl)) {
            const indexPath = path.join(__dirname, 'index.html');
            if (fs.existsSync(indexPath)) {
                return serveFile(indexPath, res);
            }
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});

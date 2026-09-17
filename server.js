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

    // API: Submit customer quotation requirement
    if (req.method === 'POST' && normalizedPath === '/api/submit-quotation') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const dbPath = path.join(__dirname, 'data', 'quotations_database.json');
                const csvPath = path.join(__dirname, 'data', 'quotations_database.csv');

                // 1. Append to JSON Database
                let records = [];
                if (fs.existsSync(dbPath)) {
                    try { records = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '[]'); } catch(e) { records = []; }
                }
                records.unshift(data);
                fs.writeFileSync(dbPath, JSON.stringify(records, null, 2), 'utf8');

                // 2. Append to CSV Database
                if (!fs.existsSync(csvPath)) {
                    const headers = '"Date & Time","Quotation ID","Customer Name","Phone","Delivery Address","City","State","PIN Code","Total Items","Wholesale Total (₹)","Selected Crackers","Delivery Notes","Status"\n';
                    fs.writeFileSync(csvPath, headers, 'utf8');
                }
                const escapeCsv = (str) => '"' + String(str || '').replace(/"/g, '""') + '"';
                const csvRow = [
                    escapeCsv(data.timestamp),
                    escapeCsv(data.quotationId),
                    escapeCsv(data.customerName),
                    escapeCsv(data.phone),
                    escapeCsv(data.address),
                    escapeCsv(data.city),
                    escapeCsv(data.state),
                    escapeCsv(data.pincode),
                    data.totalItems || 0,
                    data.estimatedTotal || 0,
                    escapeCsv(data.crackersList),
                    escapeCsv(data.deliveryNotes),
                    escapeCsv(data.status)
                ].join(',') + '\n';
                fs.appendFileSync(csvPath, csvRow, 'utf8');

                console.log(`[QUOTATION SAVED] ${data.quotationId} from ${data.customerName} (${data.phone}) - Total: ₹${data.estimatedTotal}`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    quotationId: data.quotationId,
                    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE/edit?usp=sharing'
                }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // API: Retrieve all quotation requirements
    if (req.method === 'GET' && normalizedPath === '/api/quotations') {
        const dbPath = path.join(__dirname, 'data', 'quotations_database.json');
        let records = [];
        if (fs.existsSync(dbPath)) {
            try { records = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '[]'); } catch(e) { records = []; }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(records));
    }

    // API: Google Sheet Information
    if (req.method === 'GET' && normalizedPath === '/api/google-sheet-info') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE/edit?usp=sharing',
            googleSheetId: '1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE',
            title: 'PRANAV CRACKERS - Website Database'
        }));
    }

    // API: Track order requirement status
    if (req.method === 'GET' && normalizedPath === '/api/track-order') {
        const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
        const query = (urlParams.get('query') || '').trim();

        if (!query) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ found: false, error: 'Query parameter required' }));
        }

        const dbPath = path.join(__dirname, 'data', 'quotations_database.json');
        let records = [];
        if (fs.existsSync(dbPath)) {
            try { records = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '[]'); } catch(e) { records = []; }
        }

        const cleanQ = query.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matched = records.find(r => {
            const rId = String(r.quotationId || r.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const rPhone = String(r.phone || '').replace(/[^0-9]/g, '');
            const rName = String(r.customerName || '').toLowerCase();
            return (rId && rId.includes(cleanQ)) ||
                   (rPhone && (rPhone.includes(cleanQ) || cleanQ.includes(rPhone))) ||
                   (rName && rName.includes(query.toLowerCase()));
        });

        if (matched) {
            const orderObj = {
                id: matched.quotationId || matched.id,
                customerName: matched.customerName,
                phone: matched.phone,
                city: matched.city,
                state: matched.state,
                itemsCount: matched.totalItems || matched.itemsCount,
                estimatedTotal: matched.estimatedTotal,
                timestamp: matched.timestamp,
                status: matched.status || 'Waiting for Payment',
                crackersList: matched.crackersList || ''
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ found: true, order: orderObj }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ found: false, message: 'No quotation found matching query' }));
        }
    }

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

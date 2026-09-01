/**
 * Simple HTTP server for Amazon-Deforestation-Risk-3D project.
 * Serves all files with the correct Content-Type headers.
 *
 * Usage:
 *   node server.js
 *
 * Then open: http://localhost:5500
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif' : 'image/gif',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
  '.webp': 'image/webp',
  ''     : 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).toLowerCase();
  const mime     = MIME[ext] || MIME[''];

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      return;
    }

    res.writeHead(200, {
      'Content-Type'  : mime,
      'Content-Length': stat.size,
      'Cache-Control' : 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  GeoAI Server running at:');
  console.log('  \x1b[36mhttp://127.0.0.1:' + PORT + '\x1b[0m');
  console.log('');
  console.log('  Open your project at:');
  console.log('  \x1b[32mhttp://127.0.0.1:' + PORT + '/index.html\x1b[0m');
  console.log('');
  console.log('  Press Ctrl+C to stop the server.');
  console.log('');
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  // Remove query parameters
  let pathname = req.url.split('?')[0];
  
  // If it's a request to /tw_tj_leg/, serve index.html
  if (pathname === '/tw_tj_leg/' || pathname === '/tw_tj_leg') {
    pathname = '/tw_tj_leg/index.html';
  }
  
  // Remove the /tw_tj_leg/ prefix for file lookup
  if (pathname.startsWith('/tw_tj_leg/')) {
    pathname = pathname.slice('/tw_tj_leg'.length);
  }
  
  // Try to serve the file
  let filePath = path.join(DIST_DIR, pathname);
  
  // If it's a directory, try to serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  } else {
    // For SPA, serve index.html for non-existent routes
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(indexPath));
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/tw_tj_leg/`);
});

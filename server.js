const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const validateLogin = require('./public/validate');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_BODY_BYTES = 10 * 1024;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

// Demo account (no database in this project). Only a salted scrypt hash is kept in memory.
const DEMO_EMAIL = 'demo@juice-sh.op';
const DEMO_SALT = crypto.randomBytes(16);
const DEMO_HASH = crypto.scryptSync('demo12345', DEMO_SALT, 64);

function checkCredentials(email, password) {
  const hash = crypto.scryptSync(password, DEMO_SALT, 64);
  const passwordOk = crypto.timingSafeEqual(hash, DEMO_HASH);
  return email.trim().toLowerCase() === DEMO_EMAIL && passwordOk;
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function handleLogin(req, res) {
  let body = '';
  req.on('data', function (chunk) {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) {
      sendJson(res, 413, { message: 'Request too large.' });
      req.destroy();
    }
  });
  req.on('end', function () {
    let data;
    try { data = JSON.parse(body); } catch (e) { return sendJson(res, 400, { message: 'Invalid JSON.' }); }
    if (!data || typeof data !== 'object') return sendJson(res, 400, { message: 'Invalid request.' });

    // Server-side validation: same rules as the browser, enforced again here.
    const result = validateLogin(data.email, data.password);
    if (!result.valid) return sendJson(res, 400, { message: 'Validation failed.', errors: result.errors });

    if (!checkCredentials(data.email, data.password)) {
      return sendJson(res, 401, { message: 'Invalid email or password.' });
    }
    sendJson(res, 200, { message: 'Login successful.' });
  });
}

const server = http.createServer(function (req, res) {
  if (req.method === 'POST' && req.url === '/api/login') return handleLogin(req, res);

  if (req.method === 'GET') {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.normalize(path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath));
    if (!file.startsWith(PUBLIC_DIR + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    return fs.readFile(file, function (err, content) {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(content);
    });
  }
  res.writeHead(405);
  res.end('Method not allowed');
});

if (require.main === module) {
  server.listen(PORT, function () { console.log('mimic_juice running at http://localhost:' + PORT); });
}
module.exports = server;

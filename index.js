const http = require('http');
const zlib = require('zlib');
const Busboy = require('busboy');

const PORT = process.env.PORT || 10000;
const LOGIN = '1160491';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/login') {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    return res.end(LOGIN);
  }

  if (req.method === 'POST' && req.url === '/zipper') {
    const bb = Busboy({ headers: req.headers });
    const chunks = [];

    bb.on('file', (name, file) => {
      file.on('data', chunk => chunks.push(chunk));
    });

    bb.on('close', () => {
      const input = Buffer.concat(chunks);

      zlib.gzip(input, (err, gzipped) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('gzip error');
        }

        res.writeHead(200, {
          'Content-Type': 'application/gzip',
          'Content-Disposition': 'attachment; filename="result.gz"'
        });

        res.end(gzipped);
      });
    });

    req.pipe(bb);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, '0.0.0.0');
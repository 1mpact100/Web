const express = require('express');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 10000;

app.get('/login', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('1160491');
});

app.post('/zipper', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).type('text/plain').send('no file');
  }

  zlib.gzip(req.file.buffer, (err, gzipped) => {
    if (err) {
      return res.status(500).type('text/plain').send('gzip error');
    }

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
    res.send(gzipped);
  });
});

app.listen(PORT, '0.0.0.0');
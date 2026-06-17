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

function zipper(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).type('text/plain').send('no file');
  }

  const file = req.files[0];

  zlib.gzip(file.buffer, (err, result) => {
    if (err) {
      return res.status(500).type('text/plain').send('gzip error');
    }

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
    res.send(result);
  });
}

app.post('/zipper', upload.any(), zipper);
app.post('/zipper/', upload.any(), zipper);

app.use((err, req, res, next) => {
  res.status(500).type('text/plain').send('server error');
});

app.listen(PORT, '0.0.0.0');
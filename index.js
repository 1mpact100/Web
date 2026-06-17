const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/login', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('1160491');
});

function zipper(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).type('text/plain').send('form parse error');
    }

    const uploaded = Object.values(files)[0];

    if (!uploaded) {
      return res.status(400).type('text/plain').send('no file');
    }

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    const filePath = file.filepath;

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        return res.status(500).type('text/plain').send('read error');
      }

      zlib.gzip(data, (zipErr, gzipped) => {
        if (zipErr) {
          return res.status(500).type('text/plain').send('gzip error');
        }

        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
        res.send(gzipped);
      });
    });
  });
}

app.post('/zipper', zipper);
app.post('/zipper/', zipper);

app.listen(PORT, '0.0.0.0');
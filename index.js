const express = require('express');
const { PNG } = require('pngjs');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/login', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('1160491');
});

app.get('/makeimage', (req, res) => {
  const width = Math.max(1, parseInt(req.query.width, 10) || 1);
  const height = Math.max(1, parseInt(req.query.height, 10) || 1);

  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = 255;
      png.data[idx + 1] = 255;
      png.data[idx + 2] = 255;
      png.data[idx + 3] = 255;
    }
  }

  res.setHeader('Content-Type', 'image/png');
  png.pack().pipe(res);
});

app.listen(PORT, '0.0.0.0');
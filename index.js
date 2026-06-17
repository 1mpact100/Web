const express = require('express');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 10000;

app.get('/login', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('1160491');
});

app.post('/decypher', upload.fields([
  { name: 'key', maxCount: 1 },
  { name: 'secret', maxCount: 1 }
]), (req, res) => {
  try {
    const key = req.files.key[0].buffer.toString('utf8');
    const secretBuffer = req.files.secret[0].buffer;

    let encrypted;

    const secretText = secretBuffer.toString('utf8').trim();

    if (/^[A-Za-z0-9+/=\r\n]+$/.test(secretText)) {
      encrypted = Buffer.from(secretText, 'base64');
    } else {
      encrypted = secretBuffer;
    }

    const decrypted = crypto.privateDecrypt(
      {
        key,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      encrypted
    );

    res.type('text/plain; charset=utf-8');
    res.send(decrypted.toString('utf8'));
  } catch (err) {
    res.status(500).type('text/plain; charset=utf-8');
    res.send('decryption error');
  }
});

app.listen(PORT, '0.0.0.0');
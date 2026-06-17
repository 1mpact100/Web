const express = require('express');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 10000;

function login(req, res) {
  res.type('text/plain; charset=utf-8');
  res.send('1160491');
}

app.get('/login', login);
app.get('/login/', login);

function tryDecrypt(privateKey, data) {
  const paddings = [
    crypto.constants.RSA_PKCS1_OAEP_PADDING,
    crypto.constants.RSA_PKCS1_PADDING
  ];

  for (const padding of paddings) {
    try {
      return crypto.privateDecrypt({ key: privateKey, padding }, data);
    } catch {}
  }

  throw new Error('cannot decrypt');
}

function decypher(req, res) {
  try {
    if (!req.files?.key?.[0] || !req.files?.secret?.[0]) {
      return res.status(400).type('text/plain; charset=utf-8').send('missing files');
    }

    const privateKey = req.files.key[0].buffer.toString('utf8');
    const secretBuffer = req.files.secret[0].buffer;
    const secretText = secretBuffer.toString('utf8').trim();

    const variants = [
      secretBuffer,
      Buffer.from(secretText, 'base64'),
      Buffer.from(secretText, 'hex')
    ];

    for (const variant of variants) {
      try {
        const decrypted = tryDecrypt(privateKey, variant);
        return res.type('text/plain; charset=utf-8').send(decrypted.toString('utf8'));
      } catch {}
    }

    res.status(500).type('text/plain; charset=utf-8').send('decryption error');
  } catch (err) {
    res.status(500).type('text/plain; charset=utf-8').send('decryption error');
  }
}

app.post('/decypher', upload.fields([
  { name: 'key', maxCount: 1 },
  { name: 'secret', maxCount: 1 }
]), decypher);

app.post('/decypher/', upload.fields([
  { name: 'key', maxCount: 1 },
  { name: 'secret', maxCount: 1 }
]), decypher);

app.listen(PORT, '0.0.0.0');
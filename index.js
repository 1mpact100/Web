const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

app.get('/translate', async (req, res) => {
  const text = req.query.text || 'кот';

  const payload = {
    folderId: process.env.YANDEX_FOLDER_ID,
    sourceLanguageCode: 'ru',
    targetLanguageCode: 'en',
    texts: [text]
  };

  try {
    const response = await fetch(
      'https://translate.api.cloud.yandex.net/translate/v2/translate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify({
      ok: response.ok,
      status: response.status,
      hasApiKey: Boolean(process.env.YANDEX_API_KEY),
      hasFolderId: Boolean(process.env.YANDEX_FOLDER_ID),
      yandexResponse: data
    }, null, 2));
  } catch (err) {
    res.status(500).type('text/plain; charset=utf-8').send(String(err));
  }
});

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');

  res.end(`<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>1160491</title>
<script defer>
window.addEventListener('DOMContentLoaded', () => {
  const inp = document.querySelector('input');
  const h1 = document.querySelector('h1');

  inp.addEventListener('input', async () => {
    const word = inp.value.trim();

    if (!word) {
      h1.textContent = '';
      return;
    }

    const response = await fetch('/translate?text=' + encodeURIComponent(word));
    h1.textContent = await response.text();
  });
});
</script>
</head>
<body><input><h1></h1></body>
</html>`);
});

app.listen(PORT, '0.0.0.0');
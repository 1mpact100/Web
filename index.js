const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

app.get('/translate', async (req, res) => {
  const text = req.query.text || '';

  if (!text) {
    res.type('text/plain; charset=utf-8');
    return res.send('');
  }

  try {
    const response = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${YANDEX_API_KEY}`
      },
      body: JSON.stringify({
        folderId: YANDEX_FOLDER_ID,
        sourceLanguageCode: 'ru',
        targetLanguageCode: 'en',
        texts: [text]
      })
    });

    const data = await response.json();
    const translated = data.translations?.[0]?.text || '';

    res.type('text/plain; charset=utf-8');
    res.send(translated);
  } catch {
    res.type('text/plain; charset=utf-8');
    res.send('');
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
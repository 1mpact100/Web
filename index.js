const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/translate', async (req, res) => {
  const text = req.query.text || '';

  try {
    const r = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`
      },
      body: JSON.stringify({
        folderId: process.env.YANDEX_FOLDER_ID,
        sourceLanguageCode: 'ru',
        targetLanguageCode: 'en',
        texts: [text]
      })
    });

    const data = await r.json();
    res.type('text/plain; charset=utf-8');
    res.send(data.translations?.[0]?.text || '');
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
let n = 0;
async function tr() {
  const input = document.querySelector('input');
  const h1 = document.querySelector('h1');
  const v = input.value.trim();
  const k = ++n;

  if (!v) {
    h1.textContent = '';
    return;
  }

  const r = await fetch('/translate?text=' + encodeURIComponent(v));
  const t = await r.text();

  if (k === n) h1.textContent = t;
}

window.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('input');
  input.oninput = tr;
  input.onchange = tr;
  input.onkeyup = tr;
});
</script>
</head>
<body><input><h1></h1></body>
</html>`);
});

app.listen(PORT, '0.0.0.0');
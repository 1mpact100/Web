const express = require('express');
const translate = require('translate-google-api');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/translate', async (req, res) => {
  try {
    const text = req.query.text || '';

    const result = await translate(text, {
      from: 'ru',
      to: 'en'
    });

    res.type('text/plain; charset=utf-8');
    res.send(result[0] || '');
  } catch {
    res.status(500).send('');
  }
});

app.get('/', (req, res) => {
  res.type('html');
  res.send(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>1160491</title>
</head>
<body>
  <input>
  <h1></h1>

  <script>
    const input = document.querySelector('input');
    const h1 = document.querySelector('h1');

    input.addEventListener('input', async () => {
      const word = input.value.trim();

      if (!word) {
        h1.textContent = '';
        return;
      }

      try {
        const response = await fetch(
          '/translate?text=' + encodeURIComponent(word)
        );

        h1.textContent = await response.text();
      } catch {
        h1.textContent = '';
      }
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0');
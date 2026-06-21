const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/login', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('1160491');
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
    const header = document.querySelector('h1');

    input.addEventListener('input', async () => {
      const word = input.value.trim();

      if (!word) {
        header.textContent = '';
        return;
      }

      try {
        const response = await fetch(
          'https://api.mymemory.translated.net/get?q=' +
          encodeURIComponent(word) +
          '&langpair=ru|en'
        );

        const data = await response.json();
        header.textContent = data.responseData.translatedText;
      } catch {
        header.textContent = '';
      }
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0');
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
  res.end(`<!doctype html><html lang="ru">
<head>
<meta charset="UTF-8">
<title>1160491</title>
</head>
<body>
<input>
<h1></h1>

<script>
const input = document.querySelector("input");
const heading = document.querySelector("h1");

const translations = {
  привет: "hello",
  мир: "world",
  кот: "cat",
  кошка: "cat",
  собака: "dog",
  слон: "elephant",
  дом: "house",
  книга: "book",
  яблоко: "apple",
  машина: "car",
  человек: "person",
  проверка: "test",
  перевод: "translation",
  слово: "word",
  язык: "language",
  окно: "window",
  вода: "water",
  солнце: "sun",
  школа: "school",
  друг: "friend"
};

async function translate() {
  const word = input.value.trim().toLowerCase();

  if (!word) {
    heading.textContent = "";
    return;
  }

  if (translations[word]) {
    heading.textContent = translations[word];
    return;
  }

  try {
    const response = await fetch(
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(word) +
      "&langpair=ru%7Cen"
    );
    const data = await response.json();
    heading.textContent = data.responseData.translatedText.toLowerCase();
  } catch {
    heading.textContent = "";
  }
}

input.addEventListener("input", translate);
input.addEventListener("change", translate);
input.addEventListener("keyup", translate);
</script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0');
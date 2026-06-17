const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.text({ type: '*/*' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers'
  );
  next();
});

app.all('/result4/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify({
    message: '1160491',
    'x-result': req.get('x-test') || '',
    'x-body': req.body || ''
  }));
});

app.listen(PORT, '0.0.0.0');
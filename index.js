const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const compiler = webpack({ ...webpackConfig, mode: 'development' });

dotenv.config();

const DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  middleware(compiler, {
    noInfo: true,
    writeToDisk: true,
  })
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'popup.html'));
});

app.listen(PORT, err => {
  const info = `==> Listening on port ${PORT} Open up http://127.0.0.1:${PORT} dev:${DEV}`;
  if (err) {
    console.error(err);
  }
  console.info(info);
});

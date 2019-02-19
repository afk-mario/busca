module.exports = {
  verbose: true,
  sourceDir: 'dist',
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: 'firefox-developer-edition',
    browserConsole: true,
    startUrl: [
      'about:debugging',
      'https://www.youtube.com/watch?v=C4Uc-cztsJo',
    ],
  },
};

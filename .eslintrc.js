module.exports = {
  extends: ['airbnb', 'prettier'],
  rules: {
    'no-console': 0,
  },
  globals: {
    browser: true,
    document: true,
    localStorage: true,
    chrome: true,
    fetch: true,
    Request: true,
    Headers: true,
    location: true,
  },
};

export function sortByScore(a, b) {
  const scoreA = parseInt(a.score, 10);
  const scoreB = parseInt(b.score, 10);
  if (scoreA < scoreB) return 1;
  if (scoreA > scoreB) return -1;
  return 0;
}

export const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function parseTags(_tags) {
  const tags = _tags.split(',');
  tags.push('fromBrowser');
  return tags;
}

export function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, tabs => {
    const tab = tabs[0];
    const { url } = tab;
    // console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

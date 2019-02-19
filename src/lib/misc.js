import { ORDER_OPTIONS } from '~lib/constants';

export function restoreOptions(emitter) {
  function setCurrentChoice(result) {
    const { token = '' } = result;
    emitter.emit('token:update', token);
  }

  function onError(error) {
    console.error(`Error: ${error}`);
  }

  const getting = browser.storage.local.get('token');
  getting.then(setCurrentChoice, onError);
}

export function sortByScore(a, b) {
  const sortA = a ? parseInt(a.score, 10) : 0;
  const sortB = b ? parseInt(b.score, 10) : 0;
  if (sortA < sortB) return 1;
  if (sortA > sortB) return -1;
  return 0;
}

export function sortByComments(a, b) {
  const sortA = a ? parseInt(a.comments, 10) : 0;
  const sortB = b ? parseInt(b.comments, 10) : 0;
  if (sortA < sortB) return 1;
  if (sortA > sortB) return -1;
  return 0;
}

export function sortByDate(a, b) {
  const sortA = a ? parseInt(a.age, 10) : 0;
  const sortB = b ? parseInt(b.age, 10) : 0;
  if (sortA < sortB) return 1;
  if (sortA > sortB) return -1;
  return 0;
}

export function getSortedResults(order, results) {
  switch (order) {
    case ORDER_OPTIONS[0]:
      return results.sort(sortByScore);
    case ORDER_OPTIONS[1]:
      return results.sort(sortByComments);
    case ORDER_OPTIONS[2]:
      return results.sort(sortByDate);
    default:
      return results.sort(sortByScore);
  }
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

export function removeDuplicatesBy(keyFn, array) {
  const mySet = new Set();
  return array.filter(x => {
    const key = keyFn(x);
    const isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

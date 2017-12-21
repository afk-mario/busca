// import Uri from 'urijs';
import { handleErrors, flatten, sortByScore } from '../../lib/misc';

function getYoutubeURLs(url) {
  let gotVidId = false;
  let videoId = '';
  let urls = [];
  if (url.indexOf('v=') !== -1) {
    [, videoId] = url.split('v=');
    if (videoId !== '') gotVidId = true;
    const ampersandPosition = videoId.indexOf('&');

    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
  }

  if (gotVidId) {
    const prefixes = [
      'http://www.youtube.com/watch?v=',
      'https://www.youtube.com/watch?v=',
      'http://www.youtu.be/',
      'https://www.youtu.be/',
    ];

    urls = prefixes
      .map(prefix => `${prefix}${videoId}`)
      .filter(item => item !== url);
  }

  return urls;
}

function constructUrls(url) {
  if (url.indexOf('http') === -1) {
    return [];
  }
  let urls = [url];
  if (url.indexOf('youtube.com') !== -1) {
    urls = urls.concat(getYoutubeURLs(url));
  }
  if (url.startsWith('https')) {
    urls = urls.concat(url.replace('https', 'http'));
  }
  return urls;
}

function getAllURLVersions(URL) {
  let url = URL;
  // remove firefox reader
  if (url.indexOf('about:reader?url=') === 0) {
    url = decodeURIComponent(url.substring('about:reader?url='.length));
  }

  const urls = constructUrls(url);

  const result = urls.map(item => {
    const query = encodeURIComponent(item);
    const redditUrl = `https://www.reddit.com/api/info.json?url=${query}`;
    return redditUrl;
  });

  console.log(result);

  return result;
}

function handleResponse(jsonData) {
  const now = new Date();
  const timestamp = now.getTime();

  const submissions = jsonData.data.children.map(entry => ({
    fullname: entry.data.name,
    link: `https://reddit.com${entry.data.permalink}`,
    title: entry.data.title,
    score: entry.data.score.toString(),
    age: timestamp - entry.data.created_utc * 1000,
    comments: entry.data.num_comments,
    subreddit: entry.data.subreddit,
    likes: entry.data.likes,
    user: entry.data.author,
  }));

  return submissions;
}

function getURLSubmissions(path) {
  return fetch(path, { mode: 'cors', credentials: 'include' })
    .then(handleErrors)
    .then(response => response.json())
    .then(result => handleResponse(result))
    .catch(error => console.error(error));
}

export default function getAllSubmissions(url) {
  const redditUrls = getAllURLVersions(url);
  const allPromises = redditUrls.map(redditUrl => getURLSubmissions(redditUrl));

  // flatten the array
  return Promise.all(allPromises).then(results =>
    flatten(results)
      .filter((el, i, a) => i === a.indexOf(el))
      .sort(sortByScore)
  );
}

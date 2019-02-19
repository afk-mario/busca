// import Uri from 'urijs';
import { handleErrors, flatten } from '../../lib/misc';

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

    // some youtube id's contain a dash at the start and reddit search interprets that as NOT
    // workaround is to search without the dash in the id
    if (videoId.indexOf('-') === 0) {
      videoId = videoId.substring(1);
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

function constructUrls(URL) {
  let url = URL;
  if (url.indexOf('http') === -1) {
    return [];
  }

  let urls = [url];
  if (url.indexOf('youtube.com') !== -1) {
    urls = urls.concat(getYoutubeURLs(url));
  } else {
    // remove query string
    [url] = url.split('?');
    // console.log(url);
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

  return result;
}

function handleResponse(response) {
  const now = new Date();
  const timestamp = now.getTime();
  const {
    data: { children },
  } = response;
  console.log(children);

  const submissions = children.map(({ data }) => ({
    fullname: data.name,
    link: `https://reddit.com${data.permalink}`,
    title: data.title,
    score: data.score.toString(),
    age: timestamp - data.created_utc * 1000,
    date: new Date(data.created_utc * 1000),
    comments: data.num_comments,
    subreddit: data.subreddit,
    likes: data.likes,
    user: data.author,
  }));

  return submissions;
}

function getURLSubmissions(path) {
  return fetch(path)
    .then(handleErrors)
    .then(response => response.json())
    .then(result => handleResponse(result))
    .catch(error => console.error(error));
}

export default function getAllSubmissions(url) {
  const redditUrls = getAllURLVersions(url);
  const allPromises = redditUrls.map(redditUrl => getURLSubmissions(redditUrl));

  // flatten the array
  return Promise.all(allPromises).then(results => flatten(results));
}

import { handleErrors, flatten, sortByScore } from '../../lib/misc';

function getEncodedStrings(url) {
  const arr = [];
  const urlWithSlash = `${url}/`;

  const s = `https://www.reddit.com/api/info.json?url=${encodeURIComponent(
    url
  )}`;
  const sWithSlash = `https://www.reddit.com/api/info.json?url=${encodeURIComponent(
    urlWithSlash
  )}`;

  arr.push(s);
  arr.push(sWithSlash);

  return arr;
}

function getAllURLVersions(URL) {
  let url = URL;

  if (url.indexOf('about:reader?url=') === 0) {
    url = decodeURIComponent(url.substring('about:reader?url='.length));
  }

  const host = url.split('/')[2];
  let result = [];

  if (
    (host === 'youtube.com' || host === 'www.youtube.com') &&
    url.split('/')[3].indexOf('watch?') === 0
  ) {
    let youtubeID = (() => {
      const query = url.substring(url.indexOf('?') + 1);
      const parameters = query.split('&');
      for (let i = 0; i < parameters.length; i += 1) {
        const pair = parameters[i].split('=');
        if (pair[0] === 'v') {
          return pair[1];
        }
      }
      return '';
    })();

    // some youtube id's contain a dash at the start and reddit search interprets that as NOT
    // workaround is to search without the dash in the id
    if (youtubeID.indexOf('-') === 0) {
      youtubeID = youtubeID.substring(1);
    }

    let s = encodeURIComponent(
      `(url:${youtubeID}) (site:youtube.com OR site:youtu.be)`
    );
    s = `https://api.reddit.com/search.json?q=${s}`;
    result.push(s);
  } else {
    let withoutHttp = '';
    if (url.slice(-1) === '/') {
      url = url.substring(0, url.length - 1);
    }

    result = result.concat(getEncodedStrings(url));

    if (url.indexOf('https') === 0) {
      withoutHttp = url.substring(8);
    } else if (url.indexOf('http') === 0) {
      withoutHttp = url.substring(7);
    } else {
      withoutHttp = url;
    }

    result = result.concat(getEncodedStrings(withoutHttp));
  }
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

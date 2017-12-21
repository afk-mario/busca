import {
  getCurrentTabUrl,
  handleErrors,
  sortByScore,
  removeDuplicatesBy,
} from '../../lib/misc';
import getAllSubmissions from '../../containers/results/getResults';

export default (
  state = {
    results: [],
  },
  emitter
) => {
  const mState = state;
  mState.results = [];

  emitter.on('DOMContentLoaded', () => {
    emitter.on('results:got', results => {
      mState.results = results;
      emitter.emit('message:update', results.length > 0 ? '' : 'nothing found');
      emitter.emit('render');
    });

    getCurrentTabUrl(url => {
      mState.url = url;
      // return;
      fetch('https://www.reddit.com/api/me.json', {
        mode: 'cors',
        credentials: 'include',
      })
        .then(handleErrors)
        .then(response => response.json())
        .then(() => getAllSubmissions(url))
        .then(results => {
          const filtered = removeDuplicatesBy(x => x.fullname, results);
          const sorted = filtered.sort(sortByScore);
          emitter.emit('results:got', sorted);
        })
        .catch(error => console.error(error));

      emitter.emit('render');
    });
  });
};

import { getCurrentTabUrl, handleErrors } from '../../lib/misc';
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
      console.log(results);
      mState.results = results;
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
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(() => getAllSubmissions(url))
        .then(results => {
          emitter.emit('results:got', results);
          console.log(results);
        })
        .catch(error => console.log(error));

      emitter.emit('render');
    });
  });
};

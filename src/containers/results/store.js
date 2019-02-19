import { getCurrentTabUrl, handleErrors, removeDuplicatesBy } from '~lib/misc';

import getAllSubmissions from '~containers/results/getResults';

import { ORDER_OPTIONS } from '~lib/constants';

const store = (
  state = {
    results: [],
    order: ORDER_OPTIONS[0],
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

    emitter.on('order:set', order => {
      mState.order = order;
      emitter.emit('render');
    });

    getCurrentTabUrl(url => {
      mState.url = url;
      // return;
      fetch('https://www.reddit.com/api/me.json')
        .then(handleErrors)
        .then(response => response.json())
        .then(() => getAllSubmissions(url))
        .then(results => {
          const filtered = removeDuplicatesBy(x => x.fullname, results);
          emitter.emit('results:got', filtered);
        })
        .catch(error => console.error(error));

      emitter.emit('render');
    });
  });
};

export default store;

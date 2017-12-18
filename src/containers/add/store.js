import { getCurrentTabUrl } from '../../lib/misc';

function restoreOptions(emitter) {
  function setCurrentChoice(result) {
    const { token = '' } = result;
    emitter.emit('token:update', token);
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  const getting = browser.storage.local.get('token');
  getting.then(setCurrentChoice, onError);
}

export default (
  state = {
    link: '',
    tags: '',
    token: '',
  },
  emitter
) => {
  const mState = state;
  mState.url = '';
  mState.tags = '';
  mState.token = '';

  emitter.on('DOMContentLoaded', () => {
    getCurrentTabUrl(url => {
      mState.url = url;
      emitter.emit('render');
    });

    restoreOptions(emitter);

    emitter.on('url:update', url => {
      mState.url = url;
      emitter.emit('render');
    });

    emitter.on('tags:update', tags => {
      mState.tags = tags;
      emitter.emit('render');
    });

    emitter.on('token:update', token => {
      mState.token = token;

      if (typeof token === 'undefined' || !token) {
        emitter.emit('message:update', 'no token');
      }

      emitter.emit('render');
    });

    emitter.on('message:update', message => {
      mState.message = message;
      emitter.emit('render');
    });
  });
};

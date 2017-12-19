function restoreOptions(emitter) {
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

export default (
  state = {
    link: '',
    token: '',
  },
  emitter
) => {
  const mState = state;
  mState.url = '';
  mState.token = '';

  emitter.on('DOMContentLoaded', () => {
    restoreOptions(emitter);

    emitter.on('url:update', url => {
      mState.url = url;
      emitter.emit('render');
    });

    emitter.on('token:update', token => {
      mState.token = token;

      // if (typeof token === 'undefined' || !token) {
      //   emitter.emit('message:update', 'no token');
      // }

      emitter.emit('render');
    });

    emitter.on('message:update', message => {
      mState.message = message;
      emitter.emit('render');
    });

    emitter.emit('message:update', 'loading ...');
  });
};

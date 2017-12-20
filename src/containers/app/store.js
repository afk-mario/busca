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
    // restoreOptions(emitter);

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

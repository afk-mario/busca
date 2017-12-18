import choo from 'choo';

import App from './containers/app';
import Store from './containers/app/store';
import ResultsStore from './containers/results/store';

const app = choo();

if (process.env.NODE_ENV !== 'production') {
  const devtools = require('choo-devtools');
  app.use(devtools());
}
app.use(ResultsStore);
app.use(Store);
app.route('/popup.html', App);
app.mount('body');

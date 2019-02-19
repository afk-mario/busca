import choo from 'choo';
import devtools from 'choo-devtools';

import App from './containers/app';
import Store from './containers/app/store';
import ResultsStore from './containers/results/store';

const app = choo();

if (process.env.NODE_ENV !== 'production') {
  app.use(devtools());
}
app.use(ResultsStore);
app.use(Store);
app.route('/*', App);
app.mount('body');

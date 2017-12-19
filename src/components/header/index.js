import html from 'choo/html';
import materialicon from '../material-button';

import './style.css';

export default () => html`
  <header id="header">
    <div class="wrapper">
      <h1>busca</h1>
      ${materialicon('settings', () => {
        // e.preventdefault();
        // browser.runtime.openoptionspage();
      })}
    </div>
  </header>
`;

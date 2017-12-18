import html from 'choo/html';

import './style.css';

export default url => html`
  <section class="url">
    <div class="wrapper">
    <h2>url: </h2>
    ${url}
    </div>
  </header>
`;

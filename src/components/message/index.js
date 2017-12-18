import html from 'choo/html';

import './style.css';

export default message => html`
  <section class="message">
    <div class="wrapper">
    ${message}
    </div>
  </section>
`;

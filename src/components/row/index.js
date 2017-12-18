import html from 'choo/html';

import './style.css';

export default ({ text }) => html`
  <li>
    ${text}
  </li>
`;

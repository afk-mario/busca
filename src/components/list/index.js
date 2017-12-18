import html from 'choo/html';

import Row from '../row';
import './style.css';

export default items => html`
  <ul>
    ${items.map(item => Row(item))}
  </ul>
`;

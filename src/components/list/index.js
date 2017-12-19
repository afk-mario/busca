import html from 'choo/html';

import Row from '../row';
import './style.css';

export default items => html`
  <div class="wrapper">
    <ul class="list">
      ${items.map(item => Row(item))}
    </ul>
  </div>
`;

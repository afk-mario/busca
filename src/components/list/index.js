import html from 'choo/html';

import Row from '../row';
import Empty from '../empty';
import './style.css';

export default items => {
  const empty = Empty();
  const rows = items.map(item => Row(item));
  const content = items.length > 0 ? rows : empty;

  return html`
  <div class="wrapper">
    <ul class="list">
      ${content}
    </ul>
  </div>
`;
};

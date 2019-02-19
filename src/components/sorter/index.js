import html from 'choo/html';
import IconButton from '~components/icon-button';

import './style.css';

export default ({ sorters, onclick }) => {
  const buttons = sorters.map(item =>
    IconButton({
      ...item,
      onclick,
    })
  );

  return html`
  <div class="sort-list">
  <span class="sort-title">sort</span>
  <div className="sort-buttons">${buttons}</div>
  </div>
`;
};

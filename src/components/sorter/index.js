import html from 'choo/html';
import IconButton from '~components/icon-button';

import './style.css';

const arrow = up => {
  if (up)
    return html`
      <i class="material-icons">arrow_drop_down</i>
    `;
  return html`
    <i class="material-icons">arrow_drop_up</i>
  `;
};

export default ({ order, sorters, onclick }) => {
  const buttons = sorters.map(item => {
    const active = item.value === order;
    return html`
      <div class="sort-button">
        ${IconButton({
          ...item,
          active,
          onclick,
        })}
      </div>
    `;
  });

  return html`
    <div class="sort-list">
      <span class="sort-title">sort</span>
      <div className="sort-buttons">${buttons}</div>
    </div>
  `;
};

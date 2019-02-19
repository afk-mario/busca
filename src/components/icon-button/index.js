import html from 'choo/html';

import './style.css';

export default ({ active, icon, value, className, onclick }) => html`
  <button
    class="icon-button ${className} ${active && '-active'}"
    onclick=${() => {
      onclick(value);
    }}
  >
    <i class="material-icons">${icon}</i>
  </button>
`;

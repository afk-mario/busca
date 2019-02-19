import html from 'choo/html';

import './style.css';

export default ({ icon, value, label, onclick }) => html`
      <button onclick=${() => {
        onclick(value);
      }}>
        <i class="material-icons" alt=${label}>${icon}</i>
      </button>
`;

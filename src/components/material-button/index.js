import html from 'choo/html';
import './style.css';

export default (icon, onclick) => html`
  <a class="material" onclick=${onclick}>
    <i class="material-icons">${icon}</i>
  </a>
`;

import html from 'choo/html';

import github from '~components/github';
import './style.css';

export default () => html`
  <footer id="footer">
    <div class="wrapper">
      <h1>busca</h1>
      <a
        class="github"
        href="https://github.com/afk-mcz/busca"
        target="_blank"
        rel="noopener"
      >
        ${github()}
      </a>
    </div>
  </footer>
`;

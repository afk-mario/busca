import html from 'choo/html';

import './style.css';

export default direction => html`
    <div class="arrow ${direction}"></div>
`;

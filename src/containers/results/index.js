import html from 'choo/html';
import './style.css';

import List from '../../components/list';

export default function ResultsList(state) {
  const { results = [] } = state;

  return html`
    <body>
      <section class="results">
        ${List(results)}
      </section>
    </body>
  `;
}

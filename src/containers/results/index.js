import html from 'choo/html';
import './style.css';

import List from '../../components/list';

export default function ResultsList(state) {
  const { results = [{ link: 'no items' }] } = state;
  console.log(results);

  return html`
    <body>
      ${List(
        results.map(item => ({
          text: item.link,
        }))
      )}
    </body>
  `;
}

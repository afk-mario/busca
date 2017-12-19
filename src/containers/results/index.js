import html from 'choo/html';
import './style.css';

import List from '../../components/list';

export default function ResultsList(state) {
  const { results = [{ link: 'no items' }] } = state;
  // const results = [
  //   {
  //     link: 'https://reddit.com/r/comics/comments/7kqil8/nani_pt_2/',
  //     fullname: 't3_7kqil8',
  //     title: 'NANI!?!? Pt. 2',
  //     score: '6614',
  //     age: '12761355',
  //     comments: '131',
  //     subreddit: 'comics',
  //     likes: null,
  //     user: 'shenanigansen',
  //   },
  // ];

  return html`
    <body>
      <section class="results">
        ${List(results)}
      </section>
    </body>
  `;
}

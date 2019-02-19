import html from 'choo/html';

import List from '~components/list';
import Sorter from '~components/sorter';
import { ORDER_OPTIONS } from '~lib/constants';

import { getSortedResults } from '~lib/misc';

import './style.css';

const sortbuttons = [
  {
    label: 'By votes',
    value: 'VOTES',
    icon: 'arrow_drop_up',
  },
  {
    label: 'By comments',
    value: 'COMMENTS',
    icon: 'mode_comment',
  },
  {
    label: 'By date',
    value: 'DATE',
    icon: 'date_range',
  },
];

export default function ResultsList(state, emit) {
  const { results = [], order = ORDER_OPTIONS[0] } = state;
  const sorted = getSortedResults(order, results);
  const onclick = value => {
    emit('order:set', value);
  };

  return html`
      <section class="results">
        ${Sorter({
          sorters: sortbuttons,
          onclick,
        })}
        ${List(sorted)}
      </section>
  `;
}

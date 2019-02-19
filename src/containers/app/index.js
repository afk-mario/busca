import html from 'choo/html';

import Results from '~containers/results';

import Footer from '~components/footer';
import Message from '~components/message';

import './variables.css';
import './style.css';

export default function app(state, emit) {
  const { url, message } = state;

  const messageBlank = typeof message === 'undefined' || !message;
  const content = messageBlank ? Results(state, emit) : Message(message);

  return html`
    <body>
      <main>
        ${content}
      </main>
      ${Footer(url)}
    </body>
  `;
}

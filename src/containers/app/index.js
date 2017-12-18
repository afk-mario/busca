import html from 'choo/html';
import './variables.css';
import './style.css';

import Results from '../results';
import Header from '../../components/header';
import Message from '../../components/message';
import Url from '../../components/url';

export default function app(state) {
  const { url, message } = state;

  const messageBlank = typeof message === 'undefined' || !message;
  const content = messageBlank ? '' : Message(message);

  return html`
    <body>
      ${Header(url)}
      ${Url(url)}
      ${content}
      ${Results(state)}
    </body>
  `;
}

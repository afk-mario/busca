import html from 'choo/html';

import Arrow from '../arrow';
import './style.css';

const dateFormat = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
};

export default ({
  link,
  fullname,
  title,
  score,
  age,
  date,
  comments,
  subreddit,
  likes,
  user,
}) => html`
  <li class="row" id="${fullname}">
    <div class="score-container">
      ${Arrow('up')}
      <span class="score">${score}</span>
      ${Arrow('down')}
    </div>
    <a
      class="info-container"
      href="${link}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="main-info-container">
        <p class="title">${title}</p>
      </div>
      <div class="additional-info-container">
        <span class="comments -w-icon">
          <i class="material-icons">mode_comment</i>
          ${comments}
        </span>

        <span class="date -w-icon">
          <i class="material-icons">date_range</i>
          <span>
            ${date.toLocaleDateString(undefined, dateFormat)}
          </span>
        </span>
        <span class="subreddit">r/${subreddit}</span>
        <span class="user">u/${user}</span>
      </div>
    </a>
    <span class="age">${age}</span>
    <span class="likes">${likes}</span>
    <span class="link">${link}</span>
  </li>
`;

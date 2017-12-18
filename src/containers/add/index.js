import html from 'choo/html';

import './style.css';

export default ({ url, tags, updateUrl, updateTags, submit }) => html`
  <section class="submit">
    <div class="wrapper">
      <div class="form">
        <input id="url"
          placeholder="url"
          type="url"
          value="${url}"
          oninput=${updateUrl}
          />
         <input id="tags"
          placeholder="tags"
          type="text"
          value="${tags}"
          oninput=${updateTags}
          />
        <div class="button blue" onclick=${submit}>
          <span>save</span>
        </div>
      </div>
    </div>
  </section>
`;

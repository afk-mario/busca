# busca

![logo](https://github.com/afk-mcz/busca.afk/blob/master/dist/img/32icon_dark.svg)

A small web-extension to search the current tab on reddit.

# Issues

If the icon doesn't match the theme color make sure you have enable `svg.context-properties.content.enabled` on `about:config`

Inspired by [Reddit Submission Finder](https://addons.mozilla.org/en-US/firefox/addon/reddit-submission-finder/) , [Socialite](https://addons.mozilla.org/en-US/firefox/addon/socialite/) and [Reddit Check](https://github.com/hsbakshi/reddit-check)

# Screenshot

![Screenshot](https://github.com/afk-mcz/busca.afk/blob/master/screenshots/screenshot-1.png?raw=true)

# Running and building from source

Currently using webpack and web-ext to build the addon, if you want to try it yourself follow this steps:

To install the project dependencies run:

`yarn install` or `npm install`

To start webpack on dev mode run:

`yarn start` or `npm run start`

To run the addon on firefox run:

`web-ext run -s dist --firefox=PATH_TO_YOUR_FIREFOX_BIN --pre-install`

To build the production webpack bundle run:

`yarn build:prod` or `npm run build:prod`

To build the addon zip run:

`yarn build:fox` or `npm run build:fox`

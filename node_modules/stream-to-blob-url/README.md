# stream-to-blob-url [![Build Status][travis-image]][travis-url] [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url]

#### Convert a Readable Stream to a Blob URL

[![Sauce Test Status](https://saucelabs.com/browser-matrix/stream-to-blob-url.svg)](https://saucelabs.com/u/stream-to-blob-url)

This package converts a Readable Stream into a Blob URL.

This package is used by [WebTorrent](https://webtorrent.io).

### install

```
npm install stream-to-blob-url
```

### usage

```js
var toBlobURL = require('stream-to-blob-url')

toBlobURL(fs.createReadStream('file.txt'), 'file.txt', function (err, url) {
  if (err) return console.error(err.message)
  console.log(url)
})
```

### license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).

[travis-image]: https://img.shields.io/travis/feross/stream-to-blob-url/master.svg
[travis-url]: https://travis-ci.org/feross/stream-to-blob-url
[npm-image]: https://img.shields.io/npm/v/stream-to-blob-url.svg
[npm-url]: https://npmjs.org/package/stream-to-blob-url
[downloads-image]: https://img.shields.io/npm/dm/stream-to-blob-url.svg
[downloads-url]: https://npmjs.org/package/stream-to-blob-url

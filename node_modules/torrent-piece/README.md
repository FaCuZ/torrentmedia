# torrent-piece [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/feross/torrent-piece.svg?style=flat
[travis-url]: https://travis-ci.org/feross/torrent-piece
[npm-image]: https://img.shields.io/npm/v/torrent-piece.svg?style=flat
[npm-url]: https://npmjs.org/package/torrent-piece
[downloads-image]: https://img.shields.io/npm/dm/torrent-piece.svg?style=flat
[downloads-url]: https://npmjs.org/package/torrent-piece

### Torrent piece abstraction

[![Sauce Test Status](https://saucelabs.com/browser-matrix/torrent-piece.svg)](https://saucelabs.com/u/torrent-piece)

Also works in the browser with [browserify](http://browserify.org/)! This module is used by [WebTorrent](http://webtorrent.io) and [torrent-stream](https://npmjs.com/package/torrent-stream).

## install

```
npm install torrent-piece
```

## usage

```js
var Piece = require('torrent-piece')

Piece.BLOCK_LENGTH // 16384

var pieceLength = Piece.BLOCK_LENGTH * 5
var piece = new Piece(pieceLength)
piece.missing // 81920

piece.reserve() // 0
piece.set(0, someBuffer0)

piece.reserve() // 1
piece.reserve() // 2
piece.reserve() // 3

piece.set(1, someBuffer1)
piece.set(2, someBuffer2)
piece.set(3, someBuffer3)

piece.reserve() // 4
piece.cancel(4) // cancel the reservation of a chunk

piece.reserve() // 4 (given out again)
piece.set(4, someBuffer4)

// handy functions
piece.chunkLength(0) // 16384
piece.chunkOffset(0) // 0

// eventually, when no more chunks left...

piece.reserve() // -1 (signal that all chunks are reserved)
piece.missing // 0

var pieceBuffer = piece.flush()
console.log(pieceBuffer)
```

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).

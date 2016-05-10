/* global Blob, URL */

var once = require('once')

module.exports = function getBlobURL (stream, mimeType, cb) {
  cb = once(cb)
  var chunks = []
  stream
    .on('data', function (chunk) {
      chunks.push(chunk)
    })
    .on('end', function () {
      var blob = mimeType ? new Blob(chunks, { type: mimeType }) : new Blob(chunks)
      var url = URL.createObjectURL(blob)
      cb(null, url)
    })
    .on('error', cb)
}

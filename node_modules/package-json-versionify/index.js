"use strict";
var through = require('through2');

/*
 * Convenience method for turning a through2 stream
 * into a full string. Otherwise we may just get chunks,
 * because Node buffers are chunked based on file size.
 */
function streamToString(callback) {
  var contents = '';

  return through(
    function (chunk, enc, next) {
      contents += chunk.toString('utf8');
      next();
    },
    function (next) { // flush function
      callback.bind(this)(contents, next);
    }
  );
}

function versionify(filename) {
  if (!/\b(?:package.json)$/.test(filename)) {
    return through();
  }
  return streamToString(function (contents, next) {
    var pkg = JSON.parse(contents);
    this.push(JSON.stringify({version: pkg.version}));
    next();
  });
}

module.exports = versionify;

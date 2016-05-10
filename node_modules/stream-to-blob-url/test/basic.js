var toStream = require('string-to-stream')
var test = require('tape')
var toBlobURL = require('../')
var xhr = require('xhr')

test('basic usage', function (t) {
  t.plan(3)
  var str = '0123456789'
  var stream = toStream(str)
  toBlobURL(stream, 'text/plain', function (err, url) {
    t.error(err)
    xhr(url, function (err, res, buf) {
      t.error(err)
      t.deepEqual(buf, str)
    })
  })
})

test('stress test usage', function (t) {
  t.plan(3)
  var str = new Array(1000000).join('0123456789')
  var stream = toStream(str)
  toBlobURL(stream, 'text/plain', function (err, url) {
    t.error(err)
    xhr(url, function (err, res, buf) {
      t.error(err)
      t.deepEqual(buf, str)
    })
  })
})

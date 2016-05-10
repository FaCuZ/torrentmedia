var abstractTests = require('abstract-chunk-store/tests')
var fs = require('fs')
var FSChunkStore = require('./')
var test = require('tape')

var TMP_FILE = 'tmp/test_file'

// Run abstract tests with single backing file
abstractTests(test, function (chunkLength) {
  return new FSChunkStore(chunkLength, { path: TMP_FILE })
})

// Run abstract tests with single backing file (random temp file_
abstractTests(test, function (chunkLength) {
  return new FSChunkStore(chunkLength)
})

// Run abstract tests with multiple backing files
abstractTests(test, function (chunkLength) {
  return new FSChunkStore(chunkLength, {
    files: [
      { path: 'tmp/multi1', length: 500 },
      { path: 'tmp/multi2', length: 500 }
    ]
  })
})

test('length option', function (t) {
  var store = new FSChunkStore(10, { length: 20, path: TMP_FILE })
  store.put(0, new Buffer('0123456789'), function (err) {
    t.error(err)
    t.deepEqual(fs.readFileSync(TMP_FILE).slice(0, 10), new Buffer('0123456789'))
    store.put(1, new Buffer('1234567890'), function (err) {
      t.error(err)
      t.deepEqual(fs.readFileSync(TMP_FILE), new Buffer('01234567891234567890'))
      store.get(0, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, new Buffer('0123456789'))
        store.get(1, function (err, chunk) {
          t.error(err)
          t.deepEqual(chunk, new Buffer('1234567890'))
          t.deepEqual(fs.readFileSync(TMP_FILE), new Buffer('01234567891234567890'))
          store.destroy(function (err) {
            t.error(err)
            t.throws(function () {
              fs.readFileSync(TMP_FILE)
            })
            t.end()
          })
        })
      })
    })
  })
})

test('length option: less than chunk size', function (t) {
  var store = new FSChunkStore(10, { length: 7, path: TMP_FILE })
  store.put(0, new Buffer('0123456'), function (err) {
    t.error(err)
    t.deepEqual(fs.readFileSync(TMP_FILE), new Buffer('0123456'))
    store.get(0, function (err, chunk) {
      t.error(err)
      t.deepEqual(chunk, new Buffer('0123456'))
      store.destroy(function (err) {
        t.error(err)
        t.throws(function () {
          fs.readFileSync(TMP_FILE)
        })
        t.end()
      })
    })
  })
})

test('length option: less than chunk size, write too large', function (t) {
  var store = new FSChunkStore(10, { length: 7, path: TMP_FILE })
  store.put(0, new Buffer('0123456789'), function (err) {
    t.ok(err instanceof Error)
    store.destroy(function (err) {
      t.error(err)
      t.throws(function () {
        fs.readFileSync(TMP_FILE)
      })
      t.end()
    })
  })
})

test('length option: less than chunk size, get `offset` too large', function (t) {
  var store = new FSChunkStore(10, { length: 7, path: TMP_FILE })
  store.put(0, new Buffer('0123456'), function (err) {
    t.error(err)
    t.deepEqual(fs.readFileSync(TMP_FILE), new Buffer('0123456'))
    store.get(0, { offset: 8 }, function (err, chunk) {
      t.ok(err instanceof Error)
      store.destroy(function (err) {
        t.error(err)
        t.throws(function () {
          fs.readFileSync(TMP_FILE)
        })
        t.end()
      })
    })
  })
})

test('length option: less than chunk size, get `length` too large', function (t) {
  var store = new FSChunkStore(10, { length: 7, path: TMP_FILE })
  store.put(0, new Buffer('0123456'), function (err) {
    t.error(err)
    t.deepEqual(fs.readFileSync(TMP_FILE), new Buffer('0123456'))
    store.get(0, { length: 8 }, function (err, chunk) {
      t.ok(err instanceof Error)
      store.destroy(function (err) {
        t.error(err)
        t.throws(function () {
          fs.readFileSync(TMP_FILE)
        })
        t.end()
      })
    })
  })
})

test('length option: less than chunk size, get `offset + length` too large', function (t) {
  var store = new FSChunkStore(10, { length: 7, path: TMP_FILE })
  store.put(0, new Buffer('0123456'), function (err) {
    t.error(err)
    t.deepEqual(fs.readFileSync(TMP_FILE), new Buffer('0123456'))
    store.get(0, { offset: 4, length: 4 }, function (err, chunk) {
      t.ok(err instanceof Error)
      store.destroy(function (err) {
        t.error(err)
        t.throws(function () {
          fs.readFileSync(TMP_FILE)
        })
        t.end()
      })
    })
  })
})

test('multiple files', function (t) {
  var store = new FSChunkStore(10, {
    files: [
      { path: 'tmp/file1', length: 5 },
      { path: 'tmp/file2', length: 5 },
      { path: 'tmp2/file3', length: 8 },
      { path: 'tmp2/file4', length: 8 }
    ]
  })
  store.put(0, new Buffer('0123456789'), function (err) {
    t.error(err)
    t.deepEqual(fs.readFileSync('tmp/file1'), new Buffer('01234'))
    t.deepEqual(fs.readFileSync('tmp/file2'), new Buffer('56789'))
    store.get(0, function (err, chunk) {
      t.error(err)
      t.deepEqual(chunk, new Buffer('0123456789'))
      store.put(1, new Buffer('abcdefghij'), function (err) {
        t.error(err)
        t.deepEqual(fs.readFileSync('tmp2/file3'), new Buffer('abcdefgh'))
        store.get(1, function (err, chunk) {
          t.error(err)
          t.deepEqual(chunk, new Buffer('abcdefghij'))
          store.put(2, new Buffer('klmnop'), function (err) {
            t.error(err)
            t.deepEqual(fs.readFileSync('tmp2/file4'), new Buffer('ijklmnop'))
            store.get(2, function (err, chunk) {
              t.error(err)
              t.deepEqual(chunk, new Buffer('klmnop'))
              store.destroy(function (err) {
                t.error(err)
                t.throws(function () {
                  fs.readFileSync(TMP_FILE)
                })
                t.end()
              })
            })
          })
        })
      })
    })
  })
})

var tape = require('tape')
var rpc = require('./')

tape('query + response', function (t) {
  var server = rpc()
  var queried = false

  server.on('query', function (query, peer) {
    queried = true
    t.same(peer.address, '127.0.0.1')
    t.same(query.q.toString(), 'hello_world')
    t.same(query.a, {hej: 10})
    server.response(peer, query, {hello: 42})
  })

  server.bind(0, function () {
    var port = server.address().port
    var client = rpc()
    t.same(client.inflight, 0)
    client.query({host: '127.0.0.1', port: port}, {q: 'hello_world', a: {hej: 10}}, function (err, res) {
      t.same(client.inflight, 0)
      server.destroy()
      client.destroy()
      t.error(err)
      t.ok(queried)
      t.same(res.r, {hello: 42})
      t.end()
    })
    t.same(client.inflight, 1)
  })
})

tape('parallel query', function (t) {
  var server = rpc()

  server.on('query', function (query, peer) {
    server.response(peer, query, {echo: query.a})
  })

  server.bind(0, function () {
    var port = server.address().port
    var client = rpc()
    var peer = {host: '127.0.0.1', port: port}

    client.query(peer, {q: 'echo', a: 1}, function (_, res) {
      t.same(res.r, {echo: 1})
      done()
    })
    client.query(peer, {q: 'echo', a: 2}, function (_, res) {
      t.same(res.r, {echo: 2})
      done()
    })

    t.same(client.inflight, 2)

    function done () {
      if (client.inflight) return
      client.destroy()
      server.destroy()
      t.end()
    }
  })
})

tape('query + error', function (t) {
  var server = rpc()

  server.on('query', function (query, peer) {
    server.error(peer, query, 'oh no')
  })

  server.bind(0, function () {
    var port = server.address().port
    var client = rpc()
    client.query({host: '127.0.0.1', port: port}, {q: 'hello_world', a: {hej: 10}}, function (err) {
      client.destroy()
      server.destroy()
      t.ok(err)
      t.same(err.message, 'oh no')
      t.end()
    })
  })
})

tape('timeout', function (t) {
  var socket = rpc({timeout: 100})

  socket.query({host: 'example.com', port: 12345}, {q: 'timeout'}, function (err) {
    socket.destroy()
    t.ok(err)
    t.same(err.message, 'Query timed out')
    t.end()
  })
})


var crypto = require("crypto")
  , deed = require("../")
  , http = require("http")
  , test = require("tap").test
  ;

var SECRET = "secret"

test("none", function (t) {
  t.plan(3)
  var req = new http.IncomingMessage()
  deed(SECRET, req, function (er, req) {
    t.ok(er, "should error")
    t.is(er.message, "no X-Hub-Signature")
    t.ok(!req, "should not pass request")
    t.end()
  })
})

function opts (sig) {
  return {
    hostname: "localhost"
  , port: 1337
  , method: "POST"
  , headers: {
      "X-Hub-Signature": "sha1=" + sig
    }
  }
}

test("unverified", function (t) {
  t.plan(4)
  var server = http.createServer(function (req, res) {
    deed(SECRET, req, function (er, req) {
      t.ok(er, "should error")
      t.ok(!req, "should not pass request")
      t.is(er.message, "unverified X-Hub-Signature")
      res.end()
    })
  })
  server.listen(1337)

  var req = http.request(opts("hello"), function (res) {
    res.on("end", function () {
      server.close(function (er) {
        t.error(er, "should not error")
        t.end()
      })
    })
    res.resume()
  })
  req.end()
})

function sig (body) {
  var hmac = crypto.createHmac("sha1", SECRET)
  hmac.update(body)
  return hmac.digest("hex")
}

test("verified", function (t) {
  t.plan(3)
  var server = http.createServer(function (req, res) {
    deed(SECRET, req, function (er, req) {
      t.error(er, "should not error")
      t.ok(req, "should pass request")
      res.end()
    })
  })
  server.listen(1337)

  var body = "this is the body"

  var req = http.request(opts(sig(body)), function (res) {
    res.on("end", function () {
      server.close(function (er) {
        t.error(er, "should not error")
        t.end()
      })
    })
    res.resume()
  })
  req.write(body)
  req.end()
})

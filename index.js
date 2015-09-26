// deed - verify x-hub-signature

module.exports = deed

var string_decoder = require('string_decoder')
var crypto = require('crypto')
var stream = require('stream')
var util = require('util')

function Verify (sig) {
  stream.Transform.call(this)
  this.buf = 'sha1='
  this.sig = sig
  this.dec = new string_decoder.StringDecoder('hex')
  this._readableState.objectMode = true
}
util.inherits(Verify, stream.Transform)

Verify.prototype._transform = function (chunk, enc, cb) {
  this.buf += this.dec.write(chunk)
  cb()
}

Verify.prototype._flush = function () {
  this.push(this.buf === this.sig)
  delete this.buf
  delete this.sig
}

function deed (secret, req, cb) {
  var xub = 'X-Hub-Signature'
  var sig = req.headers[xub] || req.headers[xub.toLowerCase()]
  if (!sig) return cb(new Error('no ' + xub))
  var hmac = crypto.createHmac('sha1', secret)
  var verify = new Verify(sig)
  verify.once('readable', function () {
    verify.read() ? cb(null, req) : cb(new Error('unverified ' + xub))
  })
  verify.once('error', cb)
  hmac.once('error', cb)
  req.once('error', cb)
  req.pipe(hmac).pipe(verify)
  return req
}


// deed - verify x-hub-signature

module.exports = deed

var string_decoder = require('string_decoder')
  , crypto = require('crypto')
  , util = require('util')
  , stream = require('stream')
  ;

util.inherits(Verify, stream.Transform)
function Verify (sig) {
  stream.Transform.call(this)
  this.buf = 'sha1='
  this.sig = sig
  this.dec = new string_decoder.StringDecoder('hex')
  this._readableState.objectMode = true
}

Verify.prototype._transform = function (chunk, enc, cb) {
  this.buf += this.dec.write(chunk)
  cb()
}

Verify.prototype._flush = function () {
  this.push(this.buf === this.sig ? true : false)
}

function deed (secret, req, cb) {
  var xub = 'X-Hub-Signature'
    , sig = req.headers[xub] || req.headers[xub.toLowerCase()]
    ;
  if (!sig) return cb(new Error('no ' + xub))
  var hmac = crypto.createHmac('sha1', secret)
    , verify = new Verify(sig)
    ;
  verify.once('readable', function () {
    verify.read() ? cb(null, req) : cb(new Error('unverified ' + xub))
  })
  verify.once('error', cb)
  hmac.once('error', cb)
  req.once('error', cb)
  req.pipe(hmac).pipe(verify)
  return req
}

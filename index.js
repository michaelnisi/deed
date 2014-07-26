
// deed - verify x-hub-signature

module.exports = verify

var string_decoder = require('string_decoder')
  , crypto = require('crypto')
  ;

function write (buf) {
  return new string_decoder.StringDecoder('hex').write(buf)
}

function match (hmac, sig) {
  var chunk
    , str = 'sha1='
    ;
  while (null !== (chunk = hmac.read())) {
    str += write(chunk)
  }
  return str === sig
}

function verify (secret, req, cb) {
  var xub = 'X-Hub-Signature'
    , sig = req.headers[xub] || req.headers[xub.toLowerCase()]
    ;
  if (!sig) return cb(new Error('no ' + xub))
  var hmac = crypto.createHmac('sha1', secret)
  hmac.once('finish', function () {
    var verified = match(hmac, sig)
    verified ? cb(null, req) : cb(new Error('unverified ' + xub))
  })
  hmac.once('error', cb)
  req.once('error', cb)
  req.pipe(hmac)
  return req
}

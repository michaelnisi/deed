
# deed - verify x-hub-signature

The Deed [Node.js](http://nodejs.org/) module verifies `X-Hub-Signature` headers which are a simple way to verify HTTP POST requests. For example, this can be used to authorize requests to callback URLs, say, from [GitHub webhooks](https://developer.github.com/v3/repos/hooks/) or the [Facebook API](https://developers.facebook.com/docs/graph-api/real-time-updates/v2.0).

[![Build Status](https://secure.travis-ci.org/michaelnisi/deed.svg)](http://travis-ci.org/michaelnisi/deed) [![David DM](https://david-dm.org/michaelnisi/deed.svg)](http://david-dm.org/michaelnisi/deed)

## example

```js
var deed = require('deed')
  , http = require('http')
  ;
http.createServer(function (req, res) {
  deed('secret', req, function (er, req) {
    res.end(er ? 'go away' : 'ok')
  })
}).listen(1337)
```

## types

### cb (er, req) 

The callback receives an error, if verification failed, otherwise `null` and the authorized request are passed.

- `er` The error if an error occured or verification failed.
- `req` The verified request.

## exports

### deed (secret, req, cb) 

The sole function exported by Deed checks if the request body hashed with the secret matches the `X-Hub-Signature` header.

- `secret` The key to hash the payload.
- `req` The request to verify.
- `cb` cb()

The client must generate an HMAC signature of the payload and include that signature in the request headers. The `X-Hub-Signature` header's value must be `sha1=signature` where signature is a hexadecimal representation of a SHA1 signature. The signature must be computed using the HMAC algorithm with the request body as the data and the secret as the key.

Deed recomputes the SHA1 signature with the shared secret using the same method as the client. If the signature does not match, the request cannot be verified and should probably be dropped.

Originally this technique has been decribed in the [PubSubHubbub](http://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.3.html#authednotify) spec.

## Installation

[![NPM](https://nodei.co/npm/deed.svg)](https://npmjs.org/package/deed)

## License

[ISC License](https://github.com/michaelnisi/deed/blob/master/LICENSE)

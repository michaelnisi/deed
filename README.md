
# deed - verify x-hub-signature

The deed [Node.js](http://nodejs.org/) module verifies [X-Hub-Signature](http://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.3.html#aggregatedistribution) headers.  

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

- `er` The error if an error occures or the authorisation fails
- `req` The verified request

## exports

### deed (secret, req, cb) 

- `secret` The key to hash the payload
- `req` The request to verify
- `cb` cb()

## Installation

[![NPM](https://nodei.co/npm/deed.svg)](https://npmjs.org/package/deed)

## License

[ISC License](https://github.com/michaelnisi/deed/blob/master/LICENSE)

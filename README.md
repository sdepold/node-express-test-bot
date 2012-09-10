#node-express-test-bot

A little helper for test environments, that runs an express server, executes queries against it and kills the server afters.

## Installation

```console
npm install express-test-bot
```

## API

Load the library:
```js
var ExpressTestBot = require('express-test-bot')
```


Default usage:

```js
new ExpressTestBot().get('/', function(err, stdout, stderr) { })
```


With options:
```js
new ExpressTestBot({
  // app: path to the file which starts the express server
  // default value: process.cwd() + '/app.js'
  app: 'server.js',

  // debug: log some more information to stdout
  // default value: false
  debug: true
}).get('/', {
  // toFile: writes the stdout output into a file. useful for images/binary files
  // default value: null
  toFile: 'image.jpg'
}, function(err, stdout, stderr) {

})
```

## License

Hereby placed under MIT license.

#node-express-test-bot

A little helper for test environments, that runs an express server, executes queries against it and kills the server afters.

## Installation

```console
npm install express-test-bot
```

## API

```js
var ExpressTestBot = require('express-test-bot')

// default usage:
new ExpressTestBot().get('/', function(err, stdout, stderr) { })

// with options:
new ExpressTestBot({
  // app: path to the file which starts the express server
  // default value: process.cwd() + '/app.js'
  app: 'server.js'
}).get('/', {
  // toFile: writes the stdout output into a file. useful for images/binary files
  // default value: null
  toFile: 'image.jpg'
}, function(err, stdout, stderr) {

})
```

## License

Hereby placed under MIT license.

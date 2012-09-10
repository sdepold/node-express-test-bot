var exec = require('child_process').exec
  , fs   = require('fs')

// new ExpressTestBot({ app: 'app.js' }).get('/foo')

var ExpressTestBot = module.exports = function(options) {
  this.connections = 0
  this.options     = options || {}
  this.app         = require(options.app || process.cwd() + '/app.js')
}

ExpressTestBot.prototype.isRunning = function() {
  try {
    return !!this.app.address()
  } catch(e) {
    return !!this.app.fd
  }
}

ExpressTestBot.prototype.getPort = function() {
  if (this.isRunning()) {
    return this.app.address().port
  } else {
    return ~~(Math.random() * 5000) + 2000
  }
}

ExpressTestBot.prototype.get = function(optionsOrCallback, callbackOrNothing) {
  var url      = "http://localhost:" + this.getPort() + path
    , options  = (typeof optionsOrCallback === 'function') ? {} : optionsOrCallback
    , callback = (typeof optionsOrCallback === 'function') ? optionsOrCallback : callbackOrNothing
    , cmd      = "curl --silent '" + url + "'" + (options.toFile ? " > " + options.toFile : '')

  this.request(cmd, callback)
}

ExpressTestBot.prototype.request = function(cmd, callback) {
  this.connections = this.connections + 1

  if (!this.isRunning()) {
    this.app.listen(port)
    console.log("Express server listening on port %d", this.app.address().port)
  }

  exec(cmd, function(err, stdout, stderr) {
    this.connections = this.connections - 1

    if (callback) {
      callback(err, stdout, stderr)
    }


    if (this.connections === 0) {
      this.app.close()
      this.app.__listening = false
    }
  })
}

var exec = require('child_process').exec
  , fs   = require('fs')

var ExpressTestBot = module.exports = function(options) {
  this.connections = 0
  this.options     = options || {}
  this.app         = require(this.options.app || process.cwd() + '/app.js')
  this.port        = null
}

ExpressTestBot.prototype.isRunning = function() {
  try {
    return !!this.app.address()
  } catch(e) {
    return !!this.app.fd
  }
}

ExpressTestBot.prototype.getPort = function() {
  if (this.port) {
    return this.port
  } else if (this.isRunning()) {
    this.port = this.app.address().port
  } else {
    this.port = ~~(Math.random() * 5000) + 2000
  }

  return this.port
}

ExpressTestBot.prototype.get = function(path, optionsOrCallback, callbackOrNothing) {
  var url      = "http://localhost:" + this.getPort() + path
    , options  = (typeof optionsOrCallback === 'function') ? {} : optionsOrCallback
    , callback = (typeof optionsOrCallback === 'function') ? optionsOrCallback : callbackOrNothing
    , cmd      = "curl --silent '" + url + "'" + (options.toFile ? " > " + options.toFile : '')

  this.request(cmd, callback)
}

ExpressTestBot.prototype.request = function(cmd, callback) {
  this.connections = this.connections + 1

  if (!this.isRunning()) {
    this.startServer()
  }

  exec(cmd, function(err, stdout, stderr) {
    this.connections = this.connections - 1

    if (callback) {
      callback(err, stdout, stderr)
    }

    if (this.connections === 0) {
      this.killServer()
    }
  })
}

ExpressTestBot.prototype.startServer = function() {
  this.app.listen(this.getPort())
  console.log("Express server listening on port %d", this.app.address().port)
}

ExpressTestBot.prototype.killServer = function() {
  this.port = null
  this.app.close()
  this.app.__listening = false
}

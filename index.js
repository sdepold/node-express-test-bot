var exec     = require('child_process').exec
  , execSync = require('exec-sync')
  , fs       = require('fs')

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
    while(!this.port) {
      this.port = ~~(Math.random() * 5000) + 2000

      var netStats      = execSync('netstat -an | grep LISTEN | grep ' + this.port)
        , portAvailable = !!netStats.replace('\n', '').match(/^(\s*)$/)

      if(!portAvailable) {
        this.port = null
      }
    }
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

  this.log('Executing: ' + cmd)
  exec(cmd, function(err, stdout, stderr) {
    this.connections = this.connections - 1

    if (callback) {
      callback(err, stdout, stderr)
    }

    if (this.connections === 0) {
      this.killServer()
    }
  }.bind(this))
}

ExpressTestBot.prototype.startServer = function() {
  this.app.listen(this.getPort())
  this.log("Express server listening on port %d", this.app.address().port)
}

ExpressTestBot.prototype.killServer = function(callback) {
  this.port = null
  this.app.close(callback)
  this.app.__listening = false
  this.log('Server was shut down.')
}

ExpressTestBot.prototype.log = function(message) {
  if(this.options.debug) {
    console.log(message)
  }
}

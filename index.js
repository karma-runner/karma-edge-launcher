// Karma Edge Launcher
// =================

// Dependencies
// ------------

var path = require('path')
var spawn = require('child_process').spawn

var escapeRegex = new RegExp(/\\/, 'g')
var escapement = '\\\\'
var startScriptPath = path.join(__dirname, 'scripts/start_edge.ps1').replace(escapeRegex, escapement)
var stopScriptPath = path.join(__dirname, 'scripts/stop_edge.ps1').replace(escapeRegex, escapement)

// Constructor
function EdgeBrowser (baseBrowserDecorator) {
  baseBrowserDecorator(this)

  var self = this

  // Use start_edge script path as powershell argument, and url as script argument
  this._getOptions = function (url) {
    return [ startScriptPath, url ]
  }

  // Override onProcessExit to manage edge shutdown
  var baseOnProcessExit = this._onProcessExit
  this._onProcessExit = function (code, errorOutput) {
    // In case of error return immediatly
    if (code > 0 || errorOutput.length > 0) {
      baseOnProcessExit(code, errorOutput)
    } else {
      // Start stop process to close edge gracefully
      var stopProcess = spawn('powershell.exe', [ stopScriptPath ])

      stopProcess.stdout.on('data', self._onStdout)

      stopProcess.stderr.on('data', self._onStderr)

      stopProcess.on('error', self._onStderr)

      stopProcess.on('exit', function (code) {
        baseOnProcessExit(code, errorOutput)
      })
    }
  }
}

EdgeBrowser.prototype = {
  name: 'Edge',
  DEFAULT_CMD: {
    win32: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
  },
  ENV_CMD: 'EDGE_BIN'
}

EdgeBrowser.$inject = ['baseBrowserDecorator']

// Publish di module
// -----------------

module.exports = {
  'launcher:Edge': ['type', EdgeBrowser]
}

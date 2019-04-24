// Karma Edge Launcher
// =================

// Dependencies
// ------------

var path = require('path')
var exec = require('child_process').exec

var backslashRegex = /\\/g
var escapeBackslash = '\\\\'
var spaceRegex = / /g
var escapeSpace = '` '
var startScriptPath = path
    .join(__dirname, 'scripts/start_edge.ps1')
    .replace(backslashRegex, escapeBackslash)
    .replace(spaceRegex, escapeSpace)

// Constructor
function EdgeBrowser (baseBrowserDecorator, logger) {
  baseBrowserDecorator(this)

  var log = logger.create('launcher')

  function killEdgeProcess (cb) {
    exec('taskkill /t /f /im MicrosoftEdge.exe', function (err) {
      if (err) {
        log.error('Killing Edge process failed. ' + err)
      } else {
        log.debug('Killed Edge process')
      }
      cb()
    })
  }

  // Use start_edge script path as powershell argument, and url as script argument
  this._getOptions = function (url) {
    return [ startScriptPath, url ]
  }

  // Override onProcessExit to manage edge shutdown
  var baseOnProcessExit = this._onProcessExit
  this._onProcessExit = function (code, signal, errorOutput) {
    killEdgeProcess(function () {
      if (baseOnProcessExit) {
        baseOnProcessExit(code, signal, errorOutput)
      }
    })
  }
}

EdgeBrowser.prototype = {
  name: 'Edge',
  DEFAULT_CMD: {
    win32: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
  },
  ENV_CMD: 'EDGE_BIN'
}

EdgeBrowser.$inject = ['baseBrowserDecorator', 'logger']

// Publish di module
// -----------------

module.exports = {
  'launcher:Edge': ['type', EdgeBrowser]
}
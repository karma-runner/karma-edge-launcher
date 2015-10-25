// Karme Edge Launcher
// =================

// Dependencies
// ------------

var urlparse = require('url').parse
var urlformat = require('url').format

// Constants
// ---------

var EDGE_COMMAND = [
  'powershell',
  'start',
  'shell:AppsFolder\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge'
]

var TIMEOUT = 1000

// Constructor
function EdgeBrowser (baseBrowserDecorator) {
  baseBrowserDecorator(this)

  this._getOptions = function (url) {
    var urlObj = urlparse(url, true)

    // url.format does not want search attribute
    delete urlObj.search
    url = urlformat(urlObj)

    return EDGE_COMMAND.splice(1).concat(url)
  }

  var baseOnProcessExit = this._onProcessExit
  this._onProcessExit = function (code, errorOutput) {
    setTimeout(function () {
      baseOnProcessExit(code, errorOutput)
    }, TIMEOUT)
  }
}

EdgeBrowser.prototype = {
  name: 'Edge',
  DEFAULT_CMD: {
    win32: EDGE_COMMAND[0]
  },
  ENV_CMD: 'EDGE_BIN'
}

EdgeBrowser.$inject = ['baseBrowserDecorator']

// Publish di module
// -----------------

module.exports = {
  'launcher:Edge': ['type', EdgeBrowser]
}

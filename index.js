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
  'shell:AppsFolder\\Microsoft.Windows.Spartan_cw5n1h2txyewy!Microsoft.Spartan.Spartan'
]

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

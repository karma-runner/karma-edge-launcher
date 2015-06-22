// Karme IE Launcher
// =================

// Dependencies
// ------------

var urlparse = require('url').parse
var urlformat = require('url').format
var exec = require('child_process').exec

// Constants
// ---------

var PROCESS_NAME = 'iexplore.exe'

var EDGE_COMMAND = [
  'powershell',
  'start',
  'shell:AppsFolder\\Microsoft.Windows.Spartan_cw5n1h2txyewy!Microsoft.Spartan.Spartan'
]

// Constructor
function IEBrowser (baseBrowserDecorator, logger) {
  baseBrowserDecorator(this)

  var log = logger.create('launcher')

  // Spawning iexplore.exe spawns two processes (IE does that). The way karma kills the
  // browser process (hard kill) leaves the other process in memory.
  //
  // The second process is created using command-line args like this:
  //   "C:\Program Files\Internet Explorer\iexplore.exe" SCODEF:2632 CREDAT:275457 /prefetch:2
  // Where the SCODEF value is the pid of the 'original' process created by this launcher.
  //
  // This function kills any iexplore.exe process who's command line args match 'SCODEF:pid'.
  // On IE11 this will kill the extra process. On older versions, no process will be found.
  function killExtraIEProcess (pid, cb) {
    var scodef = 'SCODEF:' + pid

    // wmic.exe : http://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
    var wmic = 'wmic.exe Path win32_Process ' +
      'where "Name=\'' + PROCESS_NAME + "' and " +
      "CommandLine Like '%" + scodef + '%\'" call Terminate'

    exec(wmic, function (err) {
      if (err) {
        log.error('Killing extra IE process failed. ' + err)
      } else {
        log.debug('Killed extra IE process ' + pid)
      }
      cb()
    })

  }

  this._getOptions = function (url) {
    var urlObj = urlparse(url, true)

    // url.format does not want search attribute
    delete urlObj.search
    url = urlformat(urlObj)

    return EDGE_COMMAND.splice(1).concat(url)
  }

  var baseOnProcessExit = this._onProcessExit
  this._onProcessExit = function (code, errorOutput) {
    var pid = this._process.pid
    killExtraIEProcess(pid, function () {
      if (baseOnProcessExit) {
        baseOnProcessExit(code, errorOutput)
      }
    })
  }
}

IEBrowser.prototype = {
  name: 'IE',
  DEFAULT_CMD: {
    win32: EDGE_COMMAND[0]
  },
  ENV_CMD: 'IE_BIN'
}

IEBrowser.$inject = ['baseBrowserDecorator', 'logger']

// Publish di module
// -----------------

module.exports = {
  'launcher:IE': ['type', IEBrowser]
}

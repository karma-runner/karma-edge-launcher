/* global describe, beforeEach, afterEach, it, before, after */

var path = require('path')
var chai = require('chai')
chai.use(require('chai-url')) // ! \ chai-url need to be declared before chai-fs else it override path method!!!
chai.use(require('chai-fs'))

var expect = chai.expect

var di = require('di')
var osHomedir = require('os-homedir')
var proxyquire = require('proxyquire')
var spawn = require('child_process').spawn

// Pre-requis
var EventEmitter = require('events').EventEmitter

// Decorators
var shortcutFunction = function () { return function (launcher) {} }
var baseDecorator = require('../../node_modules/karma/lib/launchers/base.js').decoratorFactory
var captureTimeoutDecorator = shortcutFunction // require('../../node_modules/karma/lib/launchers/capture_timeout').decoratorFactory
var retryDecorator = shortcutFunction // require('../../node_modules/karma/lib/launchers/retry').decoratorFactory
var processDecorator = require('../../node_modules/karma/lib/launchers/process').decoratorFactory
var baseBrowserDecoratorFactory = function (baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator, processLauncherDecorator, processKillTimeout) {
  return function (launcher) {
    baseLauncherDecorator(launcher)
    captureTimeoutLauncherDecorator(launcher)
    retryLauncherDecorator(launcher)
    processLauncherDecorator(launcher, processKillTimeout)
  }
}

describe('launcher', function () {
  var EdgeLauncher, injector, launcher, module

  beforeEach(function () {
    EdgeLauncher = require('../../index')

    module = {
      id: ['value', 'edge-launcher-tests'],
      emitter: ['value', new EventEmitter()],
      name: ['value', 'Edge'],
      processKillTimeout: ['value', 60000],
      timer: ['value', 60000],
      baseLauncherDecorator: ['factory', baseDecorator],
      captureTimeoutLauncherDecorator: ['factory', captureTimeoutDecorator],
      retryLauncherDecorator: ['factory', retryDecorator],
      processLauncherDecorator: ['factory', processDecorator],
      baseBrowserDecorator: ['factory', baseBrowserDecoratorFactory],
      logger: [
        'value', {
          create: function () {
            return {
              error: function () {},
              debug: function () {}
            }
          }
        }
      ]
    }
  })

  afterEach(function () {
    injector = null
    launcher = null
  })

  describe('exports', function () {
    it('should export launcher:Edge', function (done) {
      var edgeLauncher = EdgeLauncher['launcher:Edge']
      // eslint-disable-next-line no-unused-expressions
      expect(edgeLauncher).to.be.defined
      done()
    })
  })

  describe('initialization', function () {
        // These tests run from the home directory to ensure that the launcher is
        // initialized properly regardless of the working directory

    var previousdir

    before(function () {
      previousdir = process.cwd()
      process.chdir(osHomedir())
    })

    after(function () {
      process.chdir(previousdir)
    })

    beforeEach(function () {
      injector = new di.Injector([module, EdgeLauncher])
      launcher = injector.get(['launcher:Edge'])
    })

    it('should initialize name', function (done) {
      expect(launcher.name).to.equal('Edge')
      done()
    })

    it('should initialize ENV_CMD', function (done) {
      expect(launcher.ENV_CMD).to.equal('EDGE_BIN')
      done()
    })

    it('should initialize DEFAULT_CMD.win32', function (done) {
      expect(launcher.DEFAULT_CMD.win32).to.be.a.file()
      done()
    })

        // baseLauncherDecorator
    it('should be decorated by baseLauncherDecorator', function (done) {
      expect(launcher.id).to.equal('edge-launcher-tests')
      expect(launcher.start).to.be.an('function')
      expect(launcher.kill).to.be.an('function')
      expect(launcher.forceKill).to.be.an('function')
      expect(launcher.restart).to.be.an('function')
      expect(launcher.markCaptured).to.be.an('function')
      expect(launcher.isCaptured).to.be.an('function')
      expect(launcher.toString).to.be.an('function')
      expect(launcher._done).to.be.an('function')
      done()
    })

        // captureTimeoutLauncherDecorator
        // Todo...

        // retryLauncherDecorator
        // Todo...

        // processLauncherDecorator
    it('should be decorated by processLauncherDecorator', function (done) {
      expect(launcher._tempDir).to.include('karma-edge-launcher-tests')
      expect(launcher.on).to.be.an('function')
      expect(launcher._start).to.be.an('function')
      expect(launcher._getCommand).to.be.an('function')
      expect(launcher._getOptions).to.be.an('function')
      expect(launcher._normalizeCommand).to.be.an('function')
      expect(launcher._onStdout).to.be.an('function')
      expect(launcher._onStderr).to.be.an('function')
      expect(launcher._execCommand).to.be.an('function')
      expect(launcher._onProcessExit).to.be.an('function')
      expect(launcher._clearTempDirAndReportDone).to.be.an('function')
      expect(launcher._onKillTimeout).to.be.an('function')
      done()
    })
  })

  describe('_getOptions', function () {
    var getOptions

    beforeEach(function () {
      getOptions = function (url, module) {
        injector = new di.Injector([module, EdgeLauncher])
        launcher = injector.get('launcher:Edge')
        return launcher._getOptions(url)
      }
    })

    it('should return the path to powershell script start_edge.ps1 and the given URL for launching Edge', function (done) {
      var url = 'http://foo.bar/baz/?qux=123'
      var options = getOptions(url, module)

      var powershellPath = path.normalize(options[0])
      expect(powershellPath).to.be.a.file()
      expect(powershellPath).to.include('start_edge.ps1')

      var optionUrl = options[1]
      expect(optionUrl).to.be.equal(url)
      expect(optionUrl).to.have.protocol('http')
            // Wait for it, see https://github.com/lennym/chai-url/issues/4
            // expect(options[1]).to.be.a.url()
      done()
    })
  })

  describe('_onProcessExit', function () {
    var childProcessCmd, onProcessExit
	
    beforeEach(function () {
      onProcessExit = function () {
        EdgeLauncher = proxyquire('../../index', {
          child_process: {
            exec: function (cmd, cb) {
              childProcessCmd = cmd
              cb()
            }
          }
        })
        injector = new di.Injector([module, EdgeLauncher])
        launcher = injector.get('launcher:Edge')
        launcher._onProcessExit(0, null, '')
      }
    })

    it('should call taskkill', function (done) {
      onProcessExit()
      expect(childProcessCmd).to.equal('taskkill /t /f /im MicrosoftEdge.exe')
      done()
    })
  })
})

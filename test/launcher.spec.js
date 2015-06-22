var di = require('di')
var mocks = require('mocks')

describe('launcher', function () {
  var EventEmitter, IELauncher, injector, launcher, module

  beforeEach(function () {
    EventEmitter = require('../node_modules/karma/lib/events').EventEmitter
    IELauncher = mocks.loadFile(__dirname + '/../index').module.exports
    module = {
      baseBrowserDecorator: ['value', function () {}],
      emitter: ['value', new EventEmitter()],
      logger: [
        'value', {
          create: function () {
            return {
              error: function () {},
              debug: function () {}
            }
          }
        }
      ],
      args: ['value', []]
    }
  })

  afterEach(function () {
    injector = null
    launcher = null
  })

  describe('exports', function () {
    it('should export launcher:IE', function (done) {
      expect(IELauncher['launcher:IE']).to.defined
      done()
    })
  })

  describe('initialization', function () {
    beforeEach(function () {
      injector = new di.Injector([module, IELauncher])
      launcher = injector.get('launcher:IE')
    })

    it('should initialize name', function (done) {
      expect(launcher.name).to.equal('IE')
      done()
    })

    it('should initialize ENV_CMD', function (done) {
      expect(launcher.ENV_CMD).to.equal('IE_BIN')
      done()
    })

    it('should initialize DEFAULT_CMD.win32', function (done) {
      expect(launcher.DEFAULT_CMD.win32).to.beDefined
      done()
    })
  })

  describe('_getOptions', function () {
    var getOptions

    beforeEach(function () {
      getOptions = function (url, module) {
        injector = new di.Injector([module, IELauncher])
        launcher = injector.get('launcher:IE')
        return launcher._getOptions('url')
      }
    })

    it('should include 3 arguments (2 from the Edge command and 1 for the url)', function (done) {
      var options
      options = getOptions('url', module)
      expect(options).to.have.length(3)
      done()
    })

    it('should return url as the last flag', function (done) {
      var options = getOptions('url', module)
      expect(options[options.length - 1]).to.equal('url')
      done()
    })
  })

  describe('_onProcessExit', function () {
    var child_processCmd, onProcessExit

    beforeEach(function () {
      onProcessExit = function () {
        var child_processMock
        child_processMock = {
          exec: function (cmd, cb) {
            child_processCmd = cmd
            cb()
          }
        }

        IELauncher = mocks.loadFile(__dirname + '/../index', {
          child_process: child_processMock
        }).module.exports
        injector = new di.Injector([module, IELauncher])
        launcher = injector.get('launcher:IE')
        launcher._process = {
          pid: 10
        }
        launcher._onProcessExit(1, 2)
      }
    })

    it('should call wmic with process ID', function (done) {
      onProcessExit()
      expect(child_processCmd).to.equal(
        'wmic.exe Path win32_Process where ' +
        '"Name=\'iexplore.exe\' and CommandLine Like \'%SCODEF:10%\'" call Terminate'
      )
      done()
    })
  })
})

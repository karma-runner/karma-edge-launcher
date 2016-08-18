var path = require('path')
var di = require('di')
var mocks = require('mocks')

describe('launcher', function () {
  var EventEmitter, EdgeLauncher, injector, launcher, module

  beforeEach(function () {
    EventEmitter = require('../node_modules/karma/lib/events').EventEmitter
    EdgeLauncher = mocks.loadFile(path.join(__dirname, '/../index')).module.exports
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
    it('should export launcher:Edge', function (done) {
      expect(EdgeLauncher['launcher:Edge']).to.defined
      done()
    })
  })

  describe('initialization', function () {
    beforeEach(function () {
      injector = new di.Injector([module, EdgeLauncher])
      launcher = injector.get('launcher:Edge')
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
      expect(launcher.DEFAULT_CMD.win32).to.beDefined
      done()
    })
  })

  describe('_getOptions', function () {
    var getOptions

    beforeEach(function () {
      getOptions = function (url, module) {
        injector = new di.Injector([module, EdgeLauncher])
        launcher = injector.get('launcher:Edge')
        return launcher._getOptions('url')
      }
    })

    it('should return the given URL and a keepalive flag for launching Edge', function (done) {
      var options = getOptions('url', module)
      expect(options).to.deep.equal(['url', '-k'])
      done()
    })
  })
})

var chai = require('chai')

// publish globals that all specs can use
global.expect = chai.expect
global.should = chai.should()

// chai plugins
chai.use(require('chai-fs'))

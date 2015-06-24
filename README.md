# karma-edge-launcher

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/nicolasmccurdy/karma-edge-launcher)
 [![npm version](https://img.shields.io/npm/v/karma-edge-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-edge-launcher) [![npm downloads](https://img.shields.io/npm/dm/karma-edge-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-edge-launcher)

[![Build Status](https://img.shields.io/travis/nicolasmccurdy/karma-edge-launcher/master.svg?style=flat-square)](https://travis-ci.org/nicolasmccurdy/karma-edge-launcher) [![Dependency Status](https://img.shields.io/david/nicolasmccurdy/karma-edge-launcher.svg?style=flat-square)](https://david-dm.org/nicolasmccurdy/karma-edge-launcher) [![devDependency Status](https://img.shields.io/david/dev/nicolasmccurdy/karma-edge-launcher.svg?style=flat-square)](https://david-dm.org/nicolasmccurdy/karma-edge-launcher#info=devDependencies)

> Launcher for Microsoft Edge.

This is a fork of the [launcher for Internet Explorer](https://github.com/karma-runner/karma-ie-launcher).

## Installation

The easiest way is to keep `karma-edge-launcher` as a devDependency, by running

```bash
npm install karma-edge-launcher --save-dev
```

### Enabling Loopback Address Access
By default, Edge does not have access to the loopback address, which prevents Edge from accessing `localhost` and, as a result, Karma. This is a known issue with Edge. For now, you must add an exception to give Edge access to your local instance of Karma.

Open PowerShell as an administrator and run this command:
```
CheckNetIsolation LoopbackExempt -a -n='Microsoft.Windows.Spartan_cw5n1h2txyewy'
```

This only needs to be run once per Windows install. You can check your exemptions with `CheckNetIsolation LoopbackExempt -s`.

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['Edge']
  });
};
```

You can pass list of browsers as a CLI argument too:
```bash
karma start --browsers Edge
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com

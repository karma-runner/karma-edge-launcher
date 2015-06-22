# karma-ie-launcher

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-ie-launcher)
 [![npm version](https://img.shields.io/npm/v/karma-ie-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-ie-launcher) [![npm downloads](https://img.shields.io/npm/dm/karma-ie-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-ie-launcher)

[![Build Status](https://img.shields.io/travis/karma-runner/karma-ie-launcher/master.svg?style=flat-square)](https://travis-ci.org/karma-runner/karma-ie-launcher) [![Dependency Status](https://img.shields.io/david/karma-runner/karma-ie-launcher.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-ie-launcher) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-ie-launcher.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-ie-launcher#info=devDependencies)

> Launcher for Internet Explorer.

## Installation

The easiest way is to keep `karma-ie-launcher` as a devDependency, by running

```bash
npm install karma-ie-launcher --save-dev
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
    browsers: ['IE']
  });
};
```

You can pass list of browsers as a CLI argument too:
```bash
karma start --browsers IE
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com

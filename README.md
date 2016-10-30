# karma-edge-launcher

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/nickmccurdy/karma-edge-launcher)
 [![npm version](https://img.shields.io/npm/v/karma-edge-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-edge-launcher) [![npm downloads](https://img.shields.io/npm/dm/karma-edge-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-edge-launcher)

[![Build Status](https://img.shields.io/travis/nickmccurdy/karma-edge-launcher/master.svg?style=flat-square)](https://travis-ci.org/nickmccurdy/karma-edge-launcher) [![Dependency Status](https://img.shields.io/david/nickmccurdy/karma-edge-launcher.svg?style=flat-square)](https://david-dm.org/nickmccurdy/karma-edge-launcher) [![devDependency Status](https://img.shields.io/david/dev/nickmccurdy/karma-edge-launcher.svg?style=flat-square)](https://david-dm.org/nickmccurdy/karma-edge-launcher#info=devDependencies)

> Launcher for Microsoft Edge.

This is a fork of the [launcher for Internet Explorer](https://github.com/karma-runner/karma-ie-launcher).

## Status
__This is in development.__ There are no published versions on npm yet. If you see a package of this name, it is likely a different project. The tool may be partially useful from the master branch at this point, but consider it unstable software.

## Installation

The easiest way is to keep `karma-edge-launcher` as a devDependency, by running

```bash
npm install karma-edge-launcher --save-dev
```

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

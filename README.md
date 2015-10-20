[![NPM version](https://badge.fury.io/js/neuronjs.svg)](http://badge.fury.io/js/neuronjs)
[![Build Status](https://travis-ci.org/kaelzhang/neuron.svg?branch=master)](https://travis-ci.org/kaelzhang/neuron)

# Neuron

> First of all, **neuron is not designed for human developers to use directly**. Most usually, it works together with [cortex](https://github.com/kaelzhang/cortex).

Neuron is a full feature [CommonJS](http://wiki.commonjs.org) module loader which makes your node-style modules run in browsers.

- Implements commonjs [Module/1.0](http://wiki.commonjs.org/wiki/Modules/1.0) standard.
- Fully supports [SemVer](http://semver.org) and [SemVer ranges](https://github.com/mojombo/semver/issues/113): `'^a.b.c'`, `'~a.b.c'`, `'>=a.b.c'`, etc.
- Implements [File Modules](http://nodejs.org/api/modules.html#modules_file_modules) of node.js (Maybe the only module loader which could do that.)
- Supports [cyclic dependencies](http://nodejs.org/api/modules.html#modules_cycles).
- Implements `require.resolve()` for browsers which is similar to node.js.
- Completely isolated sandboxes.
- Supports [scoped packages](https://docs.npmjs.com/misc/scope)

> Neurons are the core components of the nervous system. They processes and transmits chemical signals to others as well as javascript modules work with others by passing runtime objects.

With [Cortex](https://github.com/kaelzhang/cortex) and Neuron, we write web modules **exactly** the same as we work with [node.js](http://nodejs.org), with no [Module/Wrappings](http://wiki.commonjs.org/wiki/Modules/Wrappings), no [*MD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition), etc. 

You could remove all those annoying and noisy things out of your mind, and, just focus on the origin and code your web modules like node.js.

Neuron is designed to run in the background without your concern, **UNLIKE** [RequireJS](https://github.com/jrburke/requirejs) and many other loaders.

> We're trying to return to the origin of commonjs. There should be only ONE standard, that is, Module/1.0.

****

# Build dist

```sh
$ node node/build
```

With ecma5 compatibility

```sh
$ node node/build ecma5
```


# NPM module: `neuron.js`

A package to get the JavaScript file of neuron.

```js
var neuron = require('neuron.js');
neuron.version(); // 6.0.0
neuron.content(function(err, content){
  content; // The file content of neuron.js
});
```

### neuron.version();

Returns `String` the version of neuron for browsers, not the version of npm module `neuronjs`

### neuron.write(dest, callback)

- dest `path`
- callback `function(err)`

Writes the content of neuron.js to the `dest`

### neuron.content(callback)

- callback `function(err, content)`
- content `Buffer` the buffer of the content of neuron.js

Gets the content of neuron.js

****

# Neuron Loader for Browsers

## Getting Started

### Installation

```bash
npm install
grunt
```

### Usage

Frequent configurations, for more, just see `Configuration Hierarchies` section.

```html
<script src="/dist/neuron.js"></script>
<script>
neuron.config({
	path: 'http://localhost/mod'
});
</script>
```	

For the example above:

module `'abc@0.1.1'` will be located at `'http://localhost/mod/abc/0.1.1/abc.js'`

## Methods

### require(id)
 
- id `String` module identifier.

To require modules. See [CommonJS Module/1.0](http://wiki.commonjs.org/wiki/Modules/1.0)


### require.async(id, callback)

- id `String` module identifier.
- callback `function(exports)` callback must be passed, or `require.async` will do nothing.

Asynchronously loads a module by `id`, and then passes the module `exports` to `callback`.

You should always pass the `callback` parameter because neuron can not make sure the exact time when a module is loaded asynchronously.

It is **NOT** a good practice if the logic of your code relies on the result of the `require.async()`d module without a callback.


### require.resolve(path)

- path `String` the relative path to be resolved according to the current module.

Returns the resolved absolute path of the resource. 

Returns `undefined` if `path` is not a relative path.

Returns `undefined` if `path` is even outside the current package.
	
### facade()

```js
facade(identifier);

facade(identifier, data);
```
	
Method `facade` loads a module. If the `module.exports` has a method named `init`, `facade` method will run the `init` method.

We call this kind of modules as [facade modules](http://en.wikipedia.org/wiki/Facade_pattern)
	
#### identifier `String`

module name with version, seperated with `'@'`. For example: `'async@0.1.0'`

#### data `Object`

If `data` is defined, data will be passed as the parameter of the `init` method.

 
****
# Developer Guide

**Neuron CORE** supplies no high-level APIs, which means that neuron core only cares about module dependencies and module wrapping while will do nothing about things such as fetching modules from remote server and injecting them into the current document, and never cares about where a specific module should come from.

You could do all these things in your will (by write your own `lib/load.js` and adjust `Gruntfile.js`). Nevertheless, neuron have a basic configuration file which located at `lib/load.js`.

## Configuration

```js
neuron.config(settings);
```

#### settings.path `String`

CommonJS module path, like `NODE_PATH`, default to 'the root directory of neuronjs'.

Pay attension that `path` will not be resolved to absolute url. So if you don't want a relative `path`, don't forget `'http://'`.


#### settings.loaded `String|Array.<id>`

To tell neuron loader that those modules are already loaded, and prevent duplicate loading.

If `String`, we can separate different ids with `'|'` (comma).

```js
neuron.config({
	loaded: ['jquery@1.9.2', 'async@0.2.9']
});
```

#### settings.graph `Object`

The [directed graph](http://en.wikipedia.org/wiki/Directed_graph) of all dependencies, which could be parsed by [neuron-graph](https://www.npmjs.org/package/neuron-graph).

The arithmetics to generate the graph is complicated and hard to describe, see [https://github.com/kaelzhang/neuron/blob/master/doc/graph.md](https://github.com/kaelzhang/neuron/blob/master/doc/graph.md) for details (Too Long; Don't Read)


## define()
With [cortex](https://github.com/cortexjs/cortex), you might **NEVER** use this method.

**ALWAYS** use builders to generate this method.

```js
define(identifier, dependencies, factory, options);
```

### id (full module id)

Format: `<package-name>@<version>/<path-with-extension>`

Type: `string` 

The real pathname relative to the root directory of the package.

### dependencies

`Array.<id>`

### factory

`function(require, exports, module, __filename, __dirname){}`

### options

##### options.main 
Type `Boolean` 

whether the module is the main entry, i.e. the `package.main` field in package.json

##### options.map 

Type `Object` 

`<id>:<full-module-id>`.

```js
require('./a')
require('./lib')
// ->
// map: {
//   './a': 'my@1.0.0/a.js'
//   // require a directory
//   './lib': 'my@1.0.0/lib/index.js'
// }
```

## Events

Event        | Emitted
------------ | ------------
beforeready  | when the module is needed by others
beforeload   | before being downloaded
load         | when the module is downloaded
ready        | when the module is ready to be `require()`d

```js
neuron.on('ready', function(id){
  console.log('module "' + id + '" is ready to be `require()`d');
});
```

## Related Projects

- [cortex](https://github.com/kaelzhang/cortex)
- [neocortex-sync](https://github.com/kaelzhang/neocortex-sync)

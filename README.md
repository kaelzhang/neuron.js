[![Build Status](https://travis-ci.org/kaelzhang/neuron.svg?branch=master)](https://travis-ci.org/kaelzhang/neuron)

# Neuron

> First of all, **neuron is not designed for human developers to use directly**. Most usually, it works together with [neuron-cli](https://github.com/kaelzhang/neuron-cli).

Neuron is a full feature [CommonJS](http://wiki.commonjs.org) module loader which makes your node-style modules run in browsers.

- Implements commonjs [Module/1.0](http://wiki.commonjs.org/wiki/Modules/1.0) standard.
- Fully supports [SemVer](http://semver.org) and [SemVer ranges](https://github.com/mojombo/semver/issues/113): `'^a.b.c'`, `'~a.b.c'`, `'>=a.b.c'`, etc.
- Implements [File Modules](http://nodejs.org/api/modules.html#modules_file_modules) of node.js (Maybe the only module loader which could do that.)
- Supports [cyclic dependencies](http://nodejs.org/api/modules.html#modules_cycles).
- Implements `require.resolve()`, `__filename`, and `__dirname` for browsers which is similar to node.js.
- Completely isolated sandboxes.
- Supports [scoped packages](https://docs.npmjs.com/misc/scope)

With Neuron, we write web modules **exactly** the same as we work with [node.js](http://nodejs.org), with no [Module/Wrappings](http://wiki.commonjs.org/wiki/Modules/Wrappings), no [*MD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition), etc. 

Neuron is designed to run in the background without your concern, **UNLIKE** [RequireJS](https://github.com/jrburke/requirejs) and many other loaders.

****

# Neuron Loader for Browsers

Frequent configurations, for more, just see `Configuration` section.

```html
<script src="/dist/neuron.js"></script>
<script>
facade('hello', {
  name: 'John'
});
</script>
```

# Install and build dist

```sh
npm install
node node/build
```

With ecma5 compatibility

```sh
npm install
node node/build ecma5
```

### facade()

```js
facade(identifier);
facade(identifier, data);
```

- **identifier** `String` module name with version, seperated with `'@'`. For example: `'async@0.1.0'`

- **data** `Object` will be passed as the parameter of the `module.exports`.
  
Method `facade` loads a module. If the `module.exports` is a function, `facade` method will run the function with `data` as its only parameter.

We call this kind of modules as [facade modules](http://en.wikipedia.org/wiki/Facade_pattern) which is much like the `bin`s of nodejs.

### require(id)
 
- **id** `String` module identifier.

To require modules. See [CommonJS Module/1.0](http://wiki.commonjs.org/wiki/Modules/1.0)


### require.async(id, callback)

- **id** `String` module identifier.
- **callback** `function(exports)` callback must be passed, or `require.async` will do nothing.

Asynchronously loads a module by `id`, and then passes the module `exports` to `callback`.

You should always pass the `callback` parameter because neuron can not make sure the exact time when a module is loaded asynchronously.

It is **NOT** a good practice if the logic of your code relies on the result of the `require.async()`d module without a callback.


### require.resolve(path)

- **path** `String` the relative path to be resolved according to the current module.

Returns the resolved absolute path of the resource. 

Returns `undefined` if `path` is not a relative path.

Returns `undefined` if `path` is even outside the current package.

 
****
# Developer Guide

**Neuron CORE** supplies no high-level APIs, which means that neuron core only cares about module dependencies and module wrapping while will do nothing about things such as fetching modules from remote server and injecting them into the current document, and never cares about where a specific module should come from.

You could do all these things in your will (by write your own `lib/load.js` and adjust `Gruntfile.js`). Nevertheless, neuron have a basic configuration file which located at `lib/load.js`.

## Configuration

```js
neuron.config(settings);
```

#### settings.resolve `function(id)`

Method to resolve the module id into url paths.

By default, it works with `settings.path`, and resolves the module id into

```js
settings.path 
+ id
  // '@facebook/react@1.0.0/react.js' -> 'facebook/react@1.0.0/react.js'
  .replace(/^@/, '')
  // 'facebook/react@1.0.0/react.js'  
  // -> 'facebook/react/1.0.0/react.js'
  // -> '/mod/facebook/react@1.0.0/react.js'
  .replace('@', '/');
``` 

#### settings.path `String`

CommonJS module path, like `NODE_PATH`, default to `'/mod/'`.

Pay attension that `path` will not be resolved to absolute url. So if you don't want a relative `path`, don't forget `'http://'`.

Actually, `settings.path` only works with `settings.resolve` and provides a simple way to customize the base path of the package resources. If you defines your own `settings.resolve`, `settings.path` will be useless.


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
You should **NEVER** write this method by hands.

**ALWAYS** use builders(such as [neuron-builder](https://github.com/kaelzhang/neuron-builder)) to generate this method.

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

****

# NPM module: `neuron.js`

A package to get the JavaScript file of neuron.

```js
var neuron = require('neuron.js');
neuron.version(); // 10.1.0
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


## Related Projects

- [cortex](https://github.com/kaelzhang/cortex)
- [neocortex-sync](https://github.com/kaelzhang/neocortex-sync)

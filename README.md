# Neuron
> Neurons are the core components of the nervous system. They processes and transmits chemical signals to others as well as javascript modules work with others by passing runtime objects.

Neuron is a very simple [CommonJS](http://wiki.commonjs.org) module loader, and will be more powerful if working with [Cortex](https://github.com/kaelzhang/cortex).

With [Cortex](https://github.com/kaelzhang/cortex) and Neuron, we write web modules **exactly** the same as we work with [node.js](http://nodejs.org), with no [Module/Wrappings](http://wiki.commonjs.org/wiki/Modules/Wrappings), no [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition), etc. 

You could remove all those annoying and noisy things out of your mind, and, just focus on the origin and code your web modules like node.js.

Neuron is designed to run in the background without your concern, **UNLIKE** [RequireJS](https://github.com/jrburke/requirejs) and many other loaders.

> We're trying to return to the origin of commonjs. There should be only ONE proposal, that is, Module/1.0.

## Getting Started

### Install

```bash
npm install
grunt
```

### Usage

Frequent configurations, for more, just see `Configuration Hierarchies` section.

```html
<script src="/dist/neuron.js" id="neuron-js" data-path="http://localhost/mod"></script>
```	

#### path

CommonJS module path, like `NODE_PATH`, default to 'the root directory of neuronjs'.

Pay attension that `path` will not be resolved to absolute url. So if you don't want a relative `path`, don't forget `'http://'`.

### Example

For the example above:

module `'abc@0.1.1'` will be located at `'http://localhost/mod/abc/0.1.1/abc.js'`

## Methods

First of all, neuron is not designed for human developers to use directly. Most commonly, it works with [cortex](https://github.com/kaelzhang/cortex) together.

### define()
With [cortex](https://github.com/kaelzhang/cortex), you might never use this method.

```js
define(identifier, dependencies, factory);
```
	
### facade()

```js
facade(identifier);

facade({
	mod: identifier,
	data: data
});
```
	
Method `facade` loads a module. If the `module.exports` has a method named `init`, `facade` method will run the `init` method.

We call this kind of modules as [facade modules](http://en.wikipedia.org/wiki/Facade_pattern)
	
#### identifier `String`

module name with version, seperated with `'@'`. For example: `'async@0.1.0'`

#### data `Object`

If `data` is defined, data will be passed as the parameter of the `init` method.


## Configuration Hierarchies

We can configure our settings in three places: with `loader.config()` method, in cookie, or as attributes on script node, of which the priority is:

```js
loader.config() > cookie > attributes
```

### Settings

#### path `String`

As same as above.

#### ns `String|Array`

The namespace where neuron public methods will be mixed into, default to `window`. But you could use this configuration to change that.

`'NR'` -> Neuron will explode methods to `NR`.

We could divide several namespaces with `'|'`, or use string arrays.

`'NR|'` or `['NR', window]` -> will explode methods to `NR` and `window` simultaneously.

#### loaded `String|Array.<id>`

To tell neuron loader that those modules are already loaded, and prevent duplicate loading.

If `String`, we can separate different ids with `'|'` (comma).

```js
loader.config({
	loaded: ['jquery@1.9.2', 'async@0.2.9']
});
```

#### preload `String|Array.<url>`

By default, loader will only load module script file only if we positively provide it or the module is depent by other modules.

To prevent starecase-like waterfall of network, we could load specific modules ahead of time in parallel.

```js
loader.config({
	preload: [
		'http://mydomain.com/mod/jquery/0.9.2/jquery.min.js'
	]
});
```

### Settings in cookie

Key: `'neuron'`

Value syntax: `<setting-key>=<setting-value>,<setting-key>=<setting-value>`.

#### Example

```js
document.cookie = 'neuron=' +
	encodeURIComponent(
		'path=http://localhost,' +
		'loaded=jquery@1.9.2|async@0.2.9'
	);
```

### Settings as attributes

The node should have an id equal to `'neuron-js'`.

#### Example

```html
data-path="http://localhost" data-ns="NR|"
```

## Developer Guide

Neuron supplies no high-level APIs, which means that neuron core only cares about module dependencies and module wrapping while will do nothing about things such as fetching modules from remote server and injecting them into the current document, and never cares about where a specific module should come from.

You could do all these things in your will. Nevertheless, neuron have a basic configuration file which located at `lib/config.js`.

## Related Projects

- [cortex](https://github.com/kaelzhang/cortex)
- [neocortex](https://github.com/kaelzhang/neocortex)



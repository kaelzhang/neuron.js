# Neuron [![Build Status](https://travis-ci.org/kaelzhang/neuron.svg?branch=master)](https://travis-ci.org/kaelzhang/neuron)

First of all, **neuron is not designed for human developers to use directly**. Most usually, it works together with [cortex](https://github.com/kaelzhang/cortex).

Neuron is a very simple [CommonJS](http://wiki.commonjs.org) module loader which is used by [dianping.com](http://www.dianping.com), and will be more powerful if working with [Cortex](https://github.com/kaelzhang/cortex).

> Neurons are the core components of the nervous system. They processes and transmits chemical signals to others as well as javascript modules work with others by passing runtime objects.

With [Cortex](https://github.com/kaelzhang/cortex) and Neuron, we write web modules **exactly** the same as we work with [node.js](http://nodejs.org), with no [Module/Wrappings](http://wiki.commonjs.org/wiki/Modules/Wrappings), no [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition), etc. 

You could remove all those annoying and noisy things out of your mind, and, just focus on the origin and code your web modules like node.js.

Neuron is designed to run in the background without your concern, **UNLIKE** [RequireJS](https://github.com/jrburke/requirejs) and many other loaders.

> We're trying to return to the origin of commonjs. There should be only ONE standard, that is, Module/1.0.

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

### Example

For the example above:

module `'abc@0.1.1'` will be located at `'http://localhost/mod/abc/0.1.1/abc.js'`

## Methods

### define()
With [cortex](https://github.com/kaelzhang/cortex), you might never use this method.

```js
define(identifier, dependencies, factory, options);
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


## Events

### Event: use

- event `Object`
	- mod `Object` the module object.
	- defined `boolean` whether the module is already `define`()d.
 
Emitted when a module is provided or `require`() by another module.

```js
neuron.on('use', function(e){
	console.log('use', e.mod.id);
});
```

### Event: circular

- event `Object`
	- mod `Object` the module object.

Emitted when neuron find a circular dependency.

 
****
# Developer Guide

**Neuron CORE** supplies no high-level APIs, which means that neuron core only cares about module dependencies and module wrapping while will do nothing about things such as fetching modules from remote server and injecting them into the current document, and never cares about where a specific module should come from.

You could do all these things in your will (by write your own `lib/load.js` and adjust `Gruntfile.js`). Nevertheless, neuron have a basic configuration file which located at `lib/load.js`.

## Configuration Hierarchies

We can configure our settings in two places: with `neuron.config()` method, or in cookie, of which the priority is:

```js
cookie > neuron.config()
```

So, neuron has no mode for debugging which you could help yourself by setting the cookies.

### neuron.config(settings)

```js
neuron.config({
	path: 'http://localhost/mod'
});
```

#### path `String`

CommonJS module path, like `NODE_PATH`, default to 'the root directory of neuronjs'.

Pay attension that `path` will not be resolved to absolute url. So if you don't want a relative `path`, don't forget `'http://'`.


#### loaded `String|Array.<id>`

To tell neuron loader that those modules are already loaded, and prevent duplicate loading.

If `String`, we can separate different ids with `'|'` (comma).

```js
neuron.config({
	loaded: ['jquery@1.9.2', 'async@0.2.9']
});
```

#### ranges `Object`

Defines the map which describes the explicit verison to each range.

This config often generates by server-side services.

```js
neuron.config({
	ranges: {
		"async": {
			"latest": "0.2.9"
		},
		"jquery": {
			"~1.9.0": "1.9.10"
		}
	}
});
```

#### ext `String`

Defines the file extension of the module file, default to `'.js'`.

Sometimes you want to load compressed files, then you can set it to `'.min.js'` or something.


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


Notice that not all options could take effect using `neuron.config`. And also, `path` and `loaded` could not affect modules which are already loaded.


## Related Projects

- [cortex](https://github.com/kaelzhang/cortex)
- [neocortex-sync](https://github.com/kaelzhang/neocortex-sync)



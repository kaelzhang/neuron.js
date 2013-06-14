# Neuron
> Neurons are the core components of the nervous system. They processes and transmits chemical signals to others as well as javascript modules work with others by passing runtime objects.

Neuron is a very simple and rude [CommonJS](http://wiki.commonjs.org) module loader.

Neuron will be more powerful if working with [cortex](https://github.com/kaelzhang/cortex).

## Getting Started

### Install

	npm install
	grunt

### Usage

	<script src="/dist/neuron.js" id="neuron-js" data-path="mod" data-server="localhost"></script>
	

#### path

CommonJS module path, like `NODE_PATH`, default to `'mod'`

If `path` is a relative path (such as `'../'` or `'./'`), `server` option will be ignored, neuron will solve the absolute path relative to the current document.

#### server

Server root location.

If no protocol is specified for a server, neuron will use `http://` as the default protocol.

### Example

For the example above:

- module `'abc@0.1.1'` will be located at `'http://localhost/mod/abc/0.1.1/index.js'`
- module `'abc'` will be located at `'http://localhost/mod/abc/latest/index.js'`

## Methods

First of all, neuron is not designed for developers to use. Most commonly, it works with [cortex](https://github.com/kaelzhang/cortex) together.

### define()
With [cortex](https://github.com/kaelzhang/cortex), you might never use this method.

	define(identifier, dependencies, factory);
	
### facade()

	facade(identifier);
	
	facade({
		mod: identifier,
		data: data
	});
	
Method `facade` loads a module. If the `module.exports` has a method named `init`, `facade` method will run the `init` method.

We call this kind of modules as [facade modules](http://en.wikipedia.org/wiki/Facade_pattern)
	
#### identifier
type: `String` 

module name with version, seperated with `'@'`. For example: `'async@0.1.0'`

#### data
type: `Object`

If `data` is defined, data will be passed as the parameter of the `init` method.

## Developer Guide

Neuron supplies no high-level APIs, which means that neuron core only cares about module dependencies and module wrapping while will do nothing about things such as fetching modules from remote server and injecting them into the current document, and never cares about where a specific module should come from.

You could do all these things in your will. Nevertheless, neuron have a basic configuration file which located at `lib/config/config-active.js`.



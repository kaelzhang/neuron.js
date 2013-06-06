	 __   _   _____   _   _   _____    _____   __   _  
	|  \ | | | ____| | | | | |  _  \  /  _  \ |  \ | | 
	|   \| | | |__   | | | | | |_| |  | | | | |   \| | 
	| |\   | |  __|  | | | | |  _  /  | | | | | |\   | 
	| | \  | | |___  | |_| | | | \ \  | |_| | | | \  | 
	|_|  \_| |_____| \_____/ |_|  \_\ \_____/ |_|  \_|

A very simple and rude CommonJS module loader.

## Getting Started

### Install

	npm install
	grunt

### Usage

	<script src="/dist/neuron.js" id="neuron-js" data-path="mod" data-server="localhost"></script>
	

#### path

CommonJS module path, like `NODE_PATH`, default to `'mod'`

If `path` is a relative path (such as `'../'` or `'./'`), `server` option will be ignored. 

If 

#### server

Server root location.

If no protocol is specified for a server, neuron will use `http://` as the default protocol.

### Example

For the example above:

- module `'abc@0.1.1'` will be located at `'http://localhost/mod/abc/0.1.1/main.js'`
- module `'abc'` will be located at `'http://localhost/mod/abc/latest/main.js'`

## Methods

First of all, neuron is not designed for developers to use. Most commonly, it works with [cortex](https://github.com/kaelzhang/cortex) together.

### define()
With [cortex](https://github.com/kaelzhang/cortex) might never use this method.

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




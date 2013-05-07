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

	<script src="/dist/neuron-with-active-config.js" id="G_NR" data-path="mod" data-server="localhost"></script>
	

#### path

CommonJS module path, like `NODE_PATH`

#### server

Server root location, default to `location.origin` (protocol + host). 

If no protocol is specified for a server, neuron will use `http://` as the default protocol.

### Example

For the example above, module `'abc@0.1.1'` will be located at `http://localhost/mod/abc/0.1.1/main.js` 
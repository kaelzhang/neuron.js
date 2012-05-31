<?php

function inc($path, $package = false){

    if($package){
        ?><script src="http://neuron.lc/passive-mode/src/<?php	
	}else{
        ?><script src="http://neuron.lc/src/<?php
	}
	
		echo $path;
	
	?>"></script>
<?php
};

// use strict mode
?><script>'use strict';


(function(){

var host = window;

var REGEX_PATH_CLEANER_MIN = /\.min/i,
	REGEX_PATH_CLEANER_VERSION = /\.v(?:\d+\.)*\d+/i;

function CDNHasher(evidence){
	function hashToNumber(s){
		return (s || '').length % 3 + 1;
	};
	
	return 'http://i' + hashToNumber(evidence) + '.kael.lc';
	// return 'http://neuron.lc:80';
};


function santitizer(identifier){
	return identifier.replace(REGEX_PATH_CLEANER_MIN, '').replace(REGEX_PATH_CLEANER_VERSION, '');
};


/**
 * @param {Object=} conf {
	 	base: 				{string} root "path" of module library
	 	allowUndefinedMod: 	{boolean}
	 	enableCDN:			{boolean}
	 	CDNHasher: 			{function}
	 }
 */
var __loaderConfig = {
	// root path of module files
	// base: 		'/',
	
	// enableCDN:	true,
	
	// @return: the domain of either cdn server
	// CDNHasher:	CDNHasher,
	
	santitizer: santitizer,
	
	warning: host.console && console.warn ?
		function(msg){
			console.warn('KM Loader: ' + msg);
		}
		: NOOP,
	
	/**
	 * custom error type
	 * @constructor
	 */
	error: function loaderError(message){
		throw {
			message:	message,
			toString:	function(){
				return 'KM Loader: ' + message;
			}
		};
	}
};

// window.__loaderConfig = __loaderConfig;

})();



</script>
<!-- <script src="http://i1.static.dp:1337/trunk/lib/neuron.js"></script> -->

<?

inc("neuron/seed.js");

inc("neuron/lang/native.js");
inc("neuron/lang/enhance.js");
inc("neuron/lang/web.js");

inc("neuron/oop/class.js");
inc("neuron/oop/attrs.js");
inc("neuron/oop/events.js");
inc("neuron/oop/super.js");

inc("neuron/selector/finder.js");
inc("neuron/selector/parser.js");
inc("neuron/selector/adapter.js");

inc("neuron/ua/ua.js");

inc("neuron/dom/dom.js");
inc("neuron/dom/feature.js");
inc("neuron/dom/event.js");
inc("neuron/dom/css.js");
inc("neuron/dom/traverse.js");
inc("neuron/dom/manipulate.js");
inc("neuron/dom/create.js");
inc("neuron/dom/domready.js");

inc("neuron/loader/assets.js");


// inc("neuron/loader/active.js");
// inc("neuron/loader/config/alpha.js");

inc("neuron/loader/passive.js");


inc("neuron/biz/biz.js");

inc("neuron/cleaner.js");

?>
<script>

var DP = KM;

KM.__loader.init();


function log(msg){
	var div = document.createElement('div');
	
	div.innerHTML = Array.prototype.slice.call(arguments).map(function(i){
		if(i === undefined){
			i = 'undefined';
		}else if(i === null){
			i = 'null';
		}else if(!i){
			i = 'false';
		}
		
		return '' + i;
	}).join(' ');
		
	document.body.appendChild(div);
};

</script>
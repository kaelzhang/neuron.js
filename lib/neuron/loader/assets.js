/**
 * module  loader/assets
 */
;(function(K, NULL){


var 

DOC = K.__HOST.document;

if(!DOC){
    return;
}


var

HEAD = DOC.getElementsByTagName('head')[0],

REGEX_FILE_TYPE = /\.(\w+)$/i,

/**
 * method to load a resource file
 * @param {string} uri uri of resource
 * @param {function()} callback callback function
 * @param {string=} type the explicitily assigned type of the resource, 
 	can be 'js', 'css', or 'img'. default to 'img'. (optional) 
 */
loadSrc = function(uri, callback, type){
	var extension = type || uri.match(REGEX_FILE_TYPE)[1];
	
	return extension ?
		( loadSrc[ extension.toLowerCase() ] || asset.img )(uri, callback)
		: NULL;
};


/**
 * static resource loader
 * meta functions for assets
 * --------------------------------------------------------------------------------------------------- */
	
loadSrc.css = function(uri, callback){
	var node = DOC.createElement('link');
	
	node.href = uri;
	node.rel = 'stylesheet';
	
	callback && assetOnload.css(node, callback);
	
	// insert new CSS in the end of `<head>` to maintain priority
	HEAD.appendChild(node);
	
	return node;
};
	
loadSrc.js = function(uri, callback){
	var node = DOC.createElement('script');
	
	node.src = uri;
	node.async = true;
	
	callback && assetOnload.js(node, callback);
	
	loadSrc.__pending = uri;
	HEAD.insertBefore(node, HEAD.firstChild);
	loadSrc.__pending = NULL;
	
	return node;
};
	
loadSrc.img = function(uri, callback){
	var node = DOC.createElement('img'),
		delay = setTimeout;
		
	function complete(name){
		node.onload = node.onabort = node.onerror = complete = NULL;
		
		setTimeout(function(){
			callback.call(node, {type: name});
			node = NULL;
		}, 0);
	};

	callback && ['load', 'abort', 'error'].forEach(function(name){
		node['on' + name] = function(){
			complete(name);
		};
	});

	node.src = uri;
	
	callback && node.complete && complete('load');
	
	return node;
};


var

// @this {element}
assetOnload = {
	js: ( DOC.createElement('script').readyState ?
	
		/**
		 * @param {DOMElement} node
		 * @param {!function()} callback asset.js makes sure callback is not null
		 */
		function(node, callback){
	    	node.onreadystatechange = function(){
	        	var rs = node.readyState;
	        	if (rs === 'loaded' || rs === 'complete'){
	            	node.onreadystatechange = NULL;
	            	
	            	callback.call(this);
	        	}
	    	};
		} :
		
		function(node, callback){
			node.addEventListener('load', callback, false);
		}
	)
},

// assert.css from jQuery
cssOnload = ( DOC.createElement('css').attachEvent ?
	function(node, callback){
		node.attachEvent('onload', callback);
	} :
	
	function(node, callback){
		var is_loaded = false,
			sheet = node['sheet'];
			
		if(sheet){
			if(K.UA.webkit){
				is_loaded = true;
			
			}else{
				try {
					if(sheet.cssRules) {
						is_loaded = true;
					}
				} catch (ex) {
					if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
						is_loaded = true;
					}
				}
			}
		}
	
	    if (is_loaded) {
	    	setTimeout(function(){
	    		callback.call(node);
	    	}, 0);
	    }else {
			setTimeout(function(){
				cssOnload(node, callback);
			}, 10);
	    }
	}
); // end var

assetOnload.css = cssOnload;

/**
 * load a static source 
 * KM.load(src, cb);
 * KM.load.js(src, cb);
 * KM.load.css(src, cb);
 * KM.load.img(src, cb);
 */
K['load'] = loadSrc;

    
})(KM, null);
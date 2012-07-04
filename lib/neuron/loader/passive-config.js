;(function(K){


var host = K.__HOST,
    NOOP = function(){};

/**
 * @param {Object=} conf {
	 	base: 				{string} root "path" of module library
	 	allowUndefinedMod: 	{boolean}
	 	enableCDN:			{boolean}
	 	CDNHasher: 			{function}
	 }
 */
K.__loader.config(K.mix({
	// root path of module files
	libBase: 'lib/',
	appBase: 'lib/',
	
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
	
}, host.__loaderConfig));


})(KM);
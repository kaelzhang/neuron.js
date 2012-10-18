/*!
 * module  jsonp
 * author  Kael Zhang
 */


// JSONP Request
NR.define(function (K) {

/**
 * @private
 * clean/check the symbol of empersand('&') on the end/beginning of a query

 * @param query {query} the string to be tidied
 * @param hasFirst {Boolean}
 *      if true, will check whether there is a '&' at first. if there isn't, one '&' will be added
 *      if false, 
 */
function _tidyEmpersand(str, hasFirst, hasLast) {
    if (str) {
    	var e = '&',
		    len = str.length - 1,
		    f = str[0] === e,
		    l = str[len] === e;
    
        if (!hasFirst) {
            str = f ? str.substr(1) : str;
        } else {
            str = f ? str : e + str;
        }

        len = str.length - 1;

        if (!hasLast) {
            str = l ? str.substr(0, len) : err;
        } else {
            str = l ? str : str + e;
        }
    }

    return str || '';
};

/**
 * @private
 * generate a query url
 */
function _getQuestURL(options, query, index) {
    var url = options.url.split('?'),
    	tidy = _tidyEmpersand;

    return url[0] + '?' + tidy(url[1], false, true) + tidy(query, false, true) + options.callbackKey + '=' + NR_STR + '.' + JSONP_CALLBACK_PUBLIC_PREFIX + '._' + index;
};


var 

_counter = 0,

NR_STR = 'NR',

JSONP_CALLBACK_PUBLIC_PREFIX = '_JSONPRequest',

JSONP = K.Class({

    Implements: 'events attrs',

    initialize: function (options) {
        this.set({opt: options});
    },

    // @param options 
    //  {Object} jsonp request data
    //  {String} jsonp request query string

    // @note: no more support Element type
    send: function (options) {
        var self = this,
	        query,
	        src,
	        script,
	
	        // generate a unique, non-zero jsonp request id
	        uid = ++ _counter,
	        _K = K,
	        request = _K[JSONP_CALLBACK_PUBLIC_PREFIX];

        // formatting data ------------------------------------------------------- 
        
        // never override old options
        options || (options = {});
        
        if(_K.isString(options)){
        	query = options;
        	options = {};
        }
        
        _K.mix(options, self.get('opt'), false);
        
        if(!_K.isString(query)){
        	query = _K.toQueryString(options.data);
        }
        
        src = _getQuestURL(options, query, uid);

        if (src.length > 2083){
        	return self.fire('error', src);
        }

        // JSONP request start
        request['_' + uid] = function () {
            self.__success.apply(self, arguments);

            delete request['_' + uid];
        }
        
        self._clear();
        self.script = K.DOM( _K.load(src, false, 'js') );

        self.fire('request');

        if (options.timeout) {
            setTimeout(function(){
            	self.fire('timeout').fire('failure').cancel();
                
            }, options.timeout);
        }

        return uid;
    },

    // @private
    __success: function() {
        this.fire('success', arguments);
    },

    cancel: function() {
        return this._clear().fire('cancel');
    },

    _clear: function(){
    	var script = this.script;
        script && script.destroy();
        
        this.script = null;
        return this;
    }

}, {
	opt: {
		value: {
			// @type {string} JSONP request uri
			url: '',
			
			callbackKey: 'callback',
			
			data: '',
			
			timeout: 0
		},
		
		setter: function(v){
			return K.mix(this.get('opt'), v);
		}
	}
});


K[JSONP_CALLBACK_PUBLIC_PREFIX] = {};

return JSONP;

});


/**
 change log
 2011-11-01  Kael
 - migrate to Neuron
 */
/**
 * @module  jsonp
 * @author  Kael Zhang, modified and optimized from Mootools.Request.JSON
 */


// Kael.me JSONP Request
;(function(K){

// @private
// clean/check the symbol of empersand('&') on the end/beginning of a query
    
// @param query {query} the string to be tidied
// @param hasFirst {Boolean}
//      if true, will check whether is the has a '&' at first. if hasn't, one '&' will be added
//      if false, 
function _tidyEmpersand(str, hasFirst, hasLast){
    var e = '&',
        len = str.length - 1,
        f = str[0] === e,
        l = str[len] === e;
        
    if(str){
        if(!hasFirst){
            str = f ? str.substr(1) : str; 
        }else{
            str = f ? str : e + str; 
        }

        if(!hasLast){
            str = l ? str.substr(0, len) : err;
        }else{
            str = l ? str : str + e; 
        }
    }

    return str || '';
};

// @private
// generate a query url
function _getQuestURL(options, query, index){
    var url = options.url.split('?'),
        tidy = _tidyEmpersand;

    return url[0] + '?' + tidy(url[1], false, true) + tidy(query, false, true) + options.callbackKey + '=KM.JSONP._request._' + index;
};


var _counter = 0, JSONP;


JSONP = new Class({

	Implements: 'chain events options',

	options: {
//		onSuccess: function(data){},
//		onCancel: function(){},
//		onTimeout: function(){},
		onRequest: function(src){
            K.log('JSONP retrieving script with url:' + src);
		},
		onError: function(src){
            K.error('JSONP ' + src + ' will fail in IE, which enforces a 2083b uri length limit');
		},
        
        // @type {string} JSONP request uri
		url: '',

		callbackKey: 'callback',
//		inject: {Element} default to document.head,
		data: '',
		link: 'ignore',
		timeout: 0
	},

	initialize: function(options){
        this.setOptions(options);
	},

    // @param options 
    //  {Object} jsonp request data
    //  {String} jsonp request query string

    // @note: no more support Element type
	send: function(options){
        var self = this,
            type,
            query,
            src,
            script,

            // generate a unique, non-zero jsonp request id
            index = ++ _counter,
            k = K,
            request = JSON._request;

		if (!Request.prototype.check.call(self, options)) return self;
		self.running = true;

        // formatting data ------------------------------------------------------- *\
		type = k.type(options);
		
		// don't override new options
        options = k.mix(type === 'string' ? {data: options} : options || {}, self.options, false);
        
        query = k.toQueryString(options.data);
        src = _getQuestURL(options, query, index);

        if (src.length > 2083) self.fireEvent('error', src);

        // JSONP request start
        request['_' + index] = function(){
            if(self.running)

			self.__success.apply(self, arguments);
			
			delete request['_' + index];
		}

		script = self.script = _create_script(src).inject(options.inject || document.head);

		self.fireEvent('request', [options.url, script]);

		
		if (options.timeout){
			(function(){
				if (self.running){
					self.fireEvent('timeout', [script.get('src'), script])
						.fireEvent('failure')
						.cancel();
				}
			}).delay(options.timeout);
		}

		return this;
	},

    // @private
	__success: function(){
		// if (!this.running) return false;
		this.clear()
			.fireEvent('success', arguments)
			.callChain();
	},

	cancel: function(){
		return this.running ? this.clear().fireEvent('cancel') : this;
	},

	clear: function(){
        var self = this;

		self.script && self.script.destroy();
		self.running = false;
		return self;
	}

});


JSONP._request = {};

K.JSONP = JSONP;
 
})(KM);
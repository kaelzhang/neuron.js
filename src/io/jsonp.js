/*!
 * module  jsonp
 * author  Kael Zhang
 */


// JSONP Request
KM.define(function (K) {

// @private
// clean/check the symbol of empersand('&') on the end/beginning of a query

// @param query {query} the string to be tidied
// @param hasFirst {Boolean}
//      if true, will check whether there is a '&' at first. if there isn't, one '&' will be added
//      if false, 
function _tidyEmpersand(str, hasFirst, hasLast) {
    var e = '&',
	    len = str.length - 1,
	    f = str[0] === e,
	    l = str[len] === e;

    if (str) {
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

// @private
// generate a query url
function _getQuestURL(options, query, index) {
    var url = options.url.split('?'),
    	tidy = _tidyEmpersand;

    return url[0] + '?' + tidy(url[1], false, true) + tidy(query, false, true) + options.callbackKey + '=' + KM_STR + '.' + JSONP_CALLBACK_PUBLIC_PREFIX + '._' + index;
};


var _counter = 0, JSONP,
KM_STR = 'KM',
JSONP_CALLBACK_PUBLIC_PREFIX = '_JSONPRequest';


JSONP = new Class({

    Implements: [Events, Options],

    options: {
        //		onSuccess: function(data){},
        //		onCancel: function(){},
        //		onTimeout: function(){},
        onRequest: function (src) {
            K.log('JSONP retrieving script with url:' + src);
        },
        onError: function (src) {
            K.error('JSONP ' + src + ' will fail in IE, which enforces a 2083b uri length limit');
        },

        // @type {string} JSONP request uri
        url: '',

        callbackKey: 'callback',
        //		inject: {Element} default to document.head,
        data: '',
        timeout: 0
    },

    initialize: function (options) {
        this.setOptions(options);
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
	        index = ++ _counter,
	        k = K,
	        request = k[JSONP_CALLBACK_PUBLIC_PREFIX];
	        
        // self.running = true;

        // formatting data ------------------------------------------------------- *\

        // never override old options
        
        if(k.isString(options)){
        	options = {};
        	query = options;
        }else{
        	query = k.toQueryString(options.data);
        }
        
        k.mix(options, self.options, false);
        
        src = _getQuestURL(options, query, index);

        if (src.length > 2083) self.fireEvent('error', src);

        // JSONP request start
        request['_' + index] = function () {
            if (self.running)

                self.__success.apply(self, arguments);

            delete request['_' + index];
        }

        script = self.script = _create_script(src).inject(options.inject || document.head);

        self.fireEvent('request', [options.url, script]);


        if (options.timeout) {
            (function () {
                if (self.running) {
                    self.fireEvent('timeout', [script.get('src'), script])
					.fireEvent('failure')
					.cancel();
                }
            }).delay(options.timeout);
        }

        return this;
    },

    // @private
    __success: function () {
        // if (!this.running) return false;
        this.fireEvent('success', arguments);
    },

    cancel: function () {
        return this.running ? this.clear().fireEvent('cancel') : this;
    },

    clear: function () {
        var self = this;

        self.script && self.script.destroy();
        self.running = false;
        return self;
    }

});

K[JSONP_CALLBACK_PUBLIC_PREFIX] = {};

return JSONP;

});
/*!
 * module  jsonp
 * author  Kael Zhang
 */


// JSONP Request

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
function _getQuestURL(url, key, query, index) {
    url = url.split('?');

    return url[0] + '?' + _tidyEmpersand(url[1], false, true) + _tidyEmpersand(query, false, true) + key + '=' + NR_STR + '.' + JSONP_CALLBACK_PUBLIC_PREFIX + '._' + index;
};


var 

_counter = 0,

NR_STR = 'NR',

JSONP_CALLBACK_PUBLIC_PREFIX = '_JSONPRequest',

JSONP = NR.Class({

    Implements: 'events attrs',

    initialize: function (options) {
        this.set(options);
    },

    // @returns {string} query string
    _tidyRequest: function(data){
        data = (data === undefined ? this.get('data') : data) || '';
        
        if (NR.isObject(data)){
            data = NR.toQueryString(data);
        
        }

        if(!this.get('cache')){
            data += '&_nr_force' + (+ new Date);
        }
        
        return data;
    },

    // @param options 
    //  {Object} jsonp request data
    //  {String} jsonp request query string

    // @note: no more support Element type
    send: function (data) {
        var query = this._tidyRequest(data),
            src,
            script,
    
            // generate a unique, non-zero jsonp request id
            uid = ++ _counter,
            K = NR,
            request = K[JSONP_CALLBACK_PUBLIC_PREFIX],
            timeout = this.get('timeout');

        // formatting data -------------------------------------------------------
        
        src = _getQuestURL(this.get('url'), this.get('callbackKey'), query, uid);

        if (src.length > 2083){
            return this.fire('error', src);
        }

        var self = this;

        // JSONP request start
        request['_' + uid] = function () {
            self.__success.apply(self, arguments);

            delete request['_' + uid];
        }
        
        this._clear();
        this.script = $( K.load(src, false, 'js') );

        this.fire('request');

        if (timeout) {
            setTimeout(function(){
                self.fire('timeout').fire('error').cancel();
                
            }, timeout);
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
    // @type {string} JSONP request uri
    url: {
        value: ''
    },
    
    callbackKey: {
        value: 'callback'
    },
    
    data: {
    },
    
    timeout: {
        value: 0
    },

    cache: {
        value: false
    }
});


NR[JSONP_CALLBACK_PUBLIC_PREFIX] = {};

module.exports = JSONP;


/**
 change log
 2011-11-01  Kael
 - migrate to Neuron
 */
/*!
 * module  ajax
 * author  Kael Zhang
 */

/**
 * entrance of ajax method
 */    
function ajax(url, callback, options){
    var self = this, len = arguments.length;
    
    // NR.ajax('/hander/?a=avatar&email=i@kael.me', function(rt){...});
    if(self instanceof ajax && callback && len > 1){
        options = options || {};
        options.method = GET;
        options.url = url;
        
        return new _Ajax(options).on('success', callback).send();
    
    // ajax.send({a:1});
    // ajax.send({a:2});
    }else{
        return new _Ajax(url);
    }
};

function standardXMLHttpRequest(){
    return new XMLHttpRequest();
};

function isXHRSuccess(xhr){
    var pass = false, s;

    try{
        s = xhr.status;
        
        // IE sometimes incorrectly returns 1223 which should be 204
        // ref:
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
        pass = s >= 200 || s < 300 || s === 1223;
        
    }catch(e){}
    
    return pass;
};


function LAMBDA(data){
    return data;
};

function returnTrue(){
    return true;
};

function extendQueryString(query, extra){
    return query + (query.indexOf('?') > -1 ? '&' : '?' ) + extra;
};


var 

JSON = require('util/json'),

/**
  ref: http://www.w3.org/TR/XMLHttpRequest2/#the-xmlhttprequest-interface
    const unsigned short UNSENT = 0;
    const unsigned short OPENED = 1;
    const unsigned short HEADERS_RECEIVED = 2;
    const unsigned short LOADING = 3;
    const unsigned short DONE = 4;
    readonly attribute unsigned short readyState;
 */
DONE = 4,

WIN = window,

EMPTY = '', POST = 'POST', GET = 'GET', STR_JSON = 'json',
WITH_CREDENTIALS = 'withCredentials',

NOOP = function(){},
REGEX_TRIM_EMPERSAND = /^&+|&+$/,
REGEX_TRIM_HASH = /#.*$/,

Xhr = WIN.ActiveXObject ?

    // fallback
    function() {
        if (WIN.XMLHttpRequest) {
            try {
                return standardXMLHttpRequest();
            } catch(e) {}
        }

        try {
            return new WIN.ActiveXObject('Microsoft.XMLHTTP');
        } catch(e) {
        }
    }
:
    standardXMLHttpRequest
,


X_REQUESTED_WITH = {
    'X-Requested-With': 'XMLHttpRequest'
},
 
header_presets = {
    Accept: {
        xml     : 'aplication/xml, text/xml',
        html    : 'text/html',
        script  : 'text/javascript, application/javascript',
        json    : 'application/json, text/javascript',
        text    : 'text/plain',
        '*'     : '*/*'
    },
    
    'X-Request': {
        json    : 'JSON'
    }
},

response_filter = {
    xml    : 'responseXML',
    text   : 'responseText'
},

// XMLHttpRequest2
xhr_tester = Xhr(),

// progress support
is_progress_supported = 'onprogress' in xhr_tester,

// credentials support, for cross domain ajax request
is_credentials_supported = WITH_CREDENTIALS in xhr_tester,


// @private
_Ajax = NR.Class({
    Implements: 'attrs events',
    
    initialize: function(options){
        var bind = NR.bind;
            
        this.set(options);
        
        this.xhr = Xhr();
        
        bind('_stateChange', this);
        
        if(is_progress_supported){
            bind('_loadstart', this);
            bind('_progress', this);
        }
    },
    
    _stateChange: function(){
        var 
        
        xhr = this.xhr,
        response,
        callback_args;

        if (xhr.readyState === DONE && this.running){
            this.running = false;
            
            xhr.onreadystatechange = NOOP;

            clearTimeout(this.timer);
            
            response = this._parseResponse(xhr);
            callback_args = [ response, xhr ];
            
            this.fire(
                !self.parseError && this.get('isXHRSuccess')(xhr) && this.get('isSuccess')(response) ? 'success' : 'error', 
                callback_args
            );
        }
    },
    
    _parseResponse: function(xhr){
        var 
        
        santitizer  = this.get('santitizer'),
        parser      = this.get('parser'),
        type        = this.get('dataType'),
        
        rt,
        data_filter = response_filter;
            
        rt = santitizer(xhr[data_filter[type] || data_filter.text] || xhr[data_filter.text]);
        
        if(type.indexOf(STR_JSON) > -1){
            try{
                rt = JSON.parse(rt);
                self.parseError = false;
                
            }catch(e){
                rt = {};
                self.parseError = true;
            }
        }
        
        return parser(rt);
    },
    
    send: function(data){
        var method  = this.get('method'),
            url     = this.get('url'),
            timeout = this.get('timeout'),
            user    = this.get('user'),
            async   = this.get('async'),
            
            xhr = this.xhr;
        
        this.running = true;
        
        data = this._tidyRequest(data);

        if(method === GET){

            /**
             * if options.cache is false, force reloading 
             */
            if(!this.get('cache')){
                url = extendQueryString(url, '_nr_force=' + NR.guid());
            }

            if(data){
                url = extendQueryString(url, data);
                data = undefined;
            }
        }
        
        if (is_progress_supported){
            xhr.onloadstart = this._loadstart;
            xhr.onprogress  = this._progress;
        }
        
        // socket
        if(user){
            xhr.open(method, url, async, user, this.get('password'));
            
        // passing null username, generates a login popup on Opera
        }else{
            xhr.open(method, url, async);
        }
        
        /**
         * for firefox 3.5+ and other xmlhttprequest2 supported browsers
         * ref:
         * https://developer.mozilla.org/en/HTTP_access_control#Requests_with_credentials
         * http://www.w3.org/TR/XMLHttpRequest2/#dom-xmlhttprequest-withcredentials
         */
        if (user && WITH_CREDENTIALS in xhr){
            xhr[WITH_CREDENTIALS] = true;
        }
        
        xhr.onreadystatechange = this._stateChange;
        
        NR.each(this.get('headers'), function(header, key){
        
            // for cross domain requests, try/catch is needed
            try {
                xhr.setRequestHeader(key, header);
            } catch (e){}
        });

        this.fire('request');
        
        xhr.send(data);
        
        !async && this._stateChange();
        
        
        var self = this;
        
        if(timeout){
            this.timer = setTimeout(function(){
                self.cancel();
                
            }, timeout);
        }
        
        return this;
    },
    
    // @returns {string} query string
    _tidyRequest: function(data){
        data = (data === undefined ? this.get('data') : data) || EMPTY;
        
        if (NR.isObject(data)){
            data = NR.toQueryString(data);
        
        }
        
        return data;
    },
    
    _loadstart: function(event){
        this.fire('loadstart', [event, this.xhr]);
    },
    
    _progress: function(event){
        this.fire('progress', [event, this.xhr]);
    },

    cancel: function(){
        var xhr = this.xhr;
    
        if (this.running){
            this.running = false;
            
            
            xhr.abort();
            clearTimeout(this.timer);
            xhr.onreadystatechange = NOOP;
            
            if (is_progress_supported){
                xhr.onprogress = xhr.onloadstart = NOOP;
            }
            
            this.xhr = Xhr();
            this.fire('cancel');
        }
        
        return self;
    }

}, {
    url: {
        value: EMPTY,
        
        getter: function(v){
            return String(v).replace(REGEX_TRIM_HASH, EMPTY) || NR.getLocation().pathname;
        }
    },
    
    method: {
    
        // GET is recommended
        value: GET, 
        
        setter: function(v){
            v = ('' + v).toUpperCase();
        
            // make sure is uppercase 'GET' or 'POST'
            return v === GET || v === POST ? v : GET;
        }
    },
    
    
    // @type {string}
    // if dataType is 'json', an empty responseText will be treated as an Error by default;
    // you can config santitizer option to avoid this:
    //     santitizer -> function(rt){ return rt || {}; }
    dataType: {
        value: STR_JSON,
        setter: function(v){
            return v || '*';
        }
    },
    
    async: true,
    
    timeout: {
        value: 0
    },
    
    cache: {
        value: false
    },
    
    user: {
        value: EMPTY
    },
    
    password: {
        value: EMPTY
    },
    
    headers: {
        getter: function(headers){
            if(!NR.isObject(headers)){
                headers = {};
            }
        
            var
            
            data_type = this.get('dataType'),
            method = this.get('method'),
            presets = header_presets;
            
            NR.mix(headers, X_REQUESTED_WITH, false);
            
            NR.each(presets, function(preset, key){
                var header = preset[data_type]; 
            
                if(header){
                    headers[key] = header;
                }
                
                if(method === POST){
                    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                }
            });
            
            return headers;
        }
    },
    
    /**
     * parse the final data
     */
    parser: {
        value: LAMBDA
    },
    
    /** 
     * sanitize the data from the responseText before everything takes its part
     * it will be really useful if the responsed data is nonstandard
     */
    santitizer: {
        value: LAMBDA
    },
    
    isSuccess: {
        value: returnTrue
    },
       
    isXHRSuccess: {
        value: isXHRSuccess
    }
});


xhr_tester = null;

module.exports = ajax;


/**
 2013-02-04  Kael:
 - completely migrate to neuron with class attributes
 - fix issue#1

 2011-11-03  Kael:
 - fix a bug about request headers

 2011-10-24  Kael:
 - migrate to Neuron

 2011-08-27  Kael:
 - complete main functionalities
 - minimize the dependency on mootools
 - remove non-standard ecma5 methods
 - dealing with Header:Accepts according to expected data type
 - add some support to XMLHttpRequest2, such as progress, credentials(user, password)
 - add santitizer and parser configurations
 
 TODO:
 A. add support to xmlParser
 B. add queue supported
 C. add complete cross domain support
 D. check compatibility with XMLHttpRequest2
 E. test Content-type and Accepts
 
 
 */
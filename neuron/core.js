/**
 * kael.me.core.js - based on mootools(http://mootools.net) compact javascript framework.
 * author  Kael Zhang[i@kael.me]

 * copyright:
 * - All rights reserved.
 * - Copyright (c) 2009 - 2011 [Kael Zhang](http://kael.me).
 */
 
 
/**
 * corek
 * mt.js -> core.js -> lang.js -> web.js -> loader.js -> config.js
 *
 */

/**
 * module core
 */

/**
 * @param {undefined=} undef
 */ 
;(function(host, K, undef){

var seed = host && host[K] || {},
        
    // no operation
    NOOP = function(){}, EMPTY = '',

    /**
	 * copy all properties in the supplier to the receiver
	 * @param r {Object} receiver
	 * @param s {Object} supplier
	 * @param or {boolean=} whether override the existing property in the receiver
	 * @param cl {(Array.<string>)=} copy list, an array of selected properties
	 */
	mix = function (r, s, or, cl) {
		if (!s || !r) return r;
		var i = 0, c, len;
		or = or || or === undef;
	
		if (cl && (len = cl.length)) {
			for (; i < len; i++) {
				c = cl[i];
				if ( (c in s) && (or || !(c in r) ) ) {
					r[c] = s[c];
				}
			}
		} else {
			for (c in s) {
				if (or || !(c in r)) {
					r[c] = s[c];
				}
			}
		}
		return r;
	},
	
	_guid = 1;
		
// actually, K must be an object, or override it
K = host[K] = seed;
	
mix(K, {
	
	// @const
	__HOST: K.__HOST || host,
	
	/**
	 DOM Parser
	 
	 allowed methods: (for nowadays)
	 
	 __PARSER.parse
	 __PARSER.find
	 __PARSER.search
	 
	 within the Neuron Framework, using methods of KM.__PARSER besides the above three is forbidden
	 */
	// __PARSER: Slick,
	
	build: '%buildtime%',

	mix: mix,
	
	guid: function(){
		return _guid ++;
	},

    /**
     * deprecated mootools methods

     * deprecated
     * $chk:
     * $defined:     removed, please simply use "obj !== undefined" instead
     * $arguments:   uesless! removed
     * $empty:       useless, use "function(){}" instead, no querying for scope chain
     * $clear:       useless, use clearTimeout or clearInterval instead
     */

    // if debug mode is off, KM.log & KM.error will do nothing
	log: NOOP,
    error: NOOP,

    /**
     * Creates specified namespace if it doesn't exist 

     * <code>
     *    KM.namespace('widget.Logger'); // returns KM.widget.Logger
     *    KM.namespace('KM.widget.Logger'); // returns KM.widget.Logger
     * </code>

     * @return {Object} current app namespace
     */
    namespace: function(){
        var args = arguments, self = this, h = self.__HOST,
            root = null,

            i = 0, i_len = args.length,
            j, j_len,

            ns;
            
        for(; i < i_len; i ++ ){
            ns = (EMPTY + args[i]).split('.');
			root = self;
            j_len = ns.length;

            for(j = (h[ns[0]] === self ? 1 : 0); j < j_len; j ++){
                root[ns[j]] = root[ns[j]] || {};
                root = root[ns[j]];
            }
        }

        return root;
    },

    // load 'log' module to switch debug-mode on
    _debugOn: function(){
        // K.provide('log', function(K){ K.log('debug module attached') });
        K._Config.debug = true;
    }
    
});

})(this, 'KM');

KM.namespace('UA', '_Config');

/**
 2010-08-27  Kael:
 - add global configuration: KM.__PARSER as DOM selector and parser

 2010-08-16  Kael:
 TODO:
 √ GLOBAL: remove all native implements of non-ECMAScript5 standards


 * change log:
 * 2011-04-19  Kael: move KM.type to lang.js
 * 2011-04-01  Kael Zhang: add adapter for typeOf of mootools
 * 2010-12-13  Kael Zhang: fix the getter of KM.data
 * 2010-10-09  Kael Zhang: 创建文件
 */
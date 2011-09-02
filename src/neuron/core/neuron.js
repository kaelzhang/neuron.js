mix(K, {
	mix: mix,
	
	guid: function(){
		return _guid ++;
	},

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
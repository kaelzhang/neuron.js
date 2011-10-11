;(function(K){

// by default, KM.log will do nothing
K.log = function(){};

/**
 * Creates specified namespace if it doesn't exist 

 * <code>
 *    KM.namespace('widget.Logger'); // returns KM.widget.Logger
 *    KM.namespace('KM.widget.Logger'); // returns KM.widget.Logger
 * </code>

 * @return {Object} current app namespace
 */
K.namespace = function(){
    var args = arguments, self = K, h = self.__HOST,
        root = null,

        i = 0, i_len = args.length,
        j, j_len,

        ns;
        
    for(; i < i_len; i ++ ){
        ns = ('' + args[i]).split('.');
		root = self;
        j_len = ns.length;

        for(j = (h[ns[0]] === self ? 1 : 0); j < j_len; j ++){
            root[ns[j]] = root[ns[j]] || {};
            root = root[ns[j]];
        }
    }

    return root;
};

// load 'log' module to switch debug-mode on
K._debugOn = function(){
    // K.provide('log', function(K){ K.log('debug module attached') });
    K._env.debug = true;
};


})(KM);
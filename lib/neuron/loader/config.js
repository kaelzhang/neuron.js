(function(){

function NOOP(){};

NR._env.loader = {
    events: {
        define: NOOP,
        provide: NOOP,
        load: NOOP
    }
};

})();

// if there's __loaderConfig, loader will switch to 'active' mode
window.__loaderConfig && (function(NR){


function hasher(evidence){
    return evidence.length % 3 + 1;
};


function getParentModulePath(path){
    var m = path.match(REGEX_DIR_MATCHER);
    
    return m ? m[0] + '.js' : false;
};

function generateModuleURL(mod){
    /**
     
     __loaderConfig = {
        pkg: {
            mod: {
                'io/ajax': 'mixed'
            },
            
            pkg: {
                'mixed': 'http://i1.dpfile.com/combo/........'
            }
         }
     }
     
     'io/ajax' -> 'http://i1.dpfile.com/combo/........'
     
     */
    var pkg = pkg_map.mod[mod.id],
        url = pkg && pkg_map.pkg[pkg];
        
    if(!url){
        var id = mod.id,
            isApp = !!mod.ns,
            
            // 'io/ajax'        -> '/lib/1.0/io/ajax.js'
            // 'index::common'  -> '/s/j/app/index/common.js'
            path = '/' + (isApp ? config.appBase : config.libBase) + id + '.js';
            
        // '/lib/1.0/io/ajax.js' -> check whether '/lib/1.0/io.js' exists
        url = url_map[getParentModulePath(path)] || url_map[path];
    }
    
    if(!url){
        if(/dianping\.com$/.test(document.domain)){
            window.console && console.warn('The url of module "'+ id +'" is not explicitly defined');
        }
        
        url = 'http://' + (isApp ? config.appServer : config.libServer).replace('{n}', hasher(id)) + path;
    
    }
    
    return url;
};


function makeSure(obj, key, default_value){
    obj[key] || (obj[key] = default_value);
};


function loadURL(url){
    // prevent duplicate loading
    if(!script_map[url]){
        script_map[url] = 1;
        NR.load(url);
    }
};


var

REGEX_PATH_CLEANER_MIN      = /\.min/i,
REGEX_PATH_CLEANER_VERSION  = /\.v(?:\d+\.)*\d+/i,
REGEX_DIR_MATCHER = /.*(?=\/.*$)/,

NOOP = function(){},

loader = NR._env.loader,

url_map = {},
pkg_map = {},
script_map = {},
pending = [],
is_pending = true,
events = loader.events,
config;

events.provide = function(mod){
    if(is_pending){
        pending.push(mod);
    }else{
        loadURL(generateModuleURL(mod));
    }
};

NR.__loader = {
    init: function(){
        config = function(config){
            makeSure(config, 'libBase', 'lib/');
            makeSure(config, 'appBase', 'app/');
            
            // default to __loaderConfig.server
            makeSure(config, 'libServer', config.server);
            makeSure(config, 'appServer', config.server);
            
            return config;
            
        }(__loaderConfig || {});
    
        var
        
        REGEX_REMOVE_DECORATION = /\.min|\.v\d+/g;
        
        /**
         __loaderConfig.urls = [
            'http://i1.dpfile.com/lib/1.0/io/ajax.min.v123123.js'
         ]
         
         ->
         
         url_map = {
            '/lib/1.0/io/ajax.js': 'http://i1.dpfile.com/lib/1.0/io/ajax.min.v123123.js'
         }
         
         */
        (config.urls || []).forEach(function(url){
            var path = NR.getLocation(url).pathname.replace(REGEX_PATH_CLEANER_MIN, '').replace(REGEX_PATH_CLEANER_VERSION, '');
        
            url_map[path] = url;
        });
        
        pkg_map = config.pkg || {};
        
        makeSure(pkg_map, 'mod', {});
        makeSure(pkg_map, 'pkg', {});
        
        is_pending = false;
        
        pending.forEach(function(mod){
            loadURL(generateModuleURL(mod));
        });
    }  
};
    
})(NR);
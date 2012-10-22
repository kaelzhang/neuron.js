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


window.__loaderConfig && (function(NR){


function hasher(evidence){
    return evidence.length % 3 + 1;
};


function generateModuleURL(mod){
    var id = mod.id,
        isApp = mod.ns,
        path = '/' + (isApp ? config.appBase : config.libBase) + id + '.js',
        url = url_map[path];
        
    if(!url){
        if(/dianping\.com$/.test(document.domain)){
            window.console && console.warn('The url of module "'+ id +'" is not explicitly defined');
        }
        
        url = 'http://' + (isApp ? config.appServer : config.libServer).replace('{n}', evidence(id)) + path;
    }

    return url;
};


function makeSure(obj, key, default_value){
    obj[key] || (obj[key] = default_value);
};


function loadURL(url){
    if(!script_map[url]){
        script_map[url] = 1;
        NR.load(url);
    }
};


var

REGEX_PATH_CLEANER_MIN      = /\.min/i,
REGEX_PATH_CLEANER_VERSION  = /\.v(?:\d+\.)*\d+/i,
NOOP = function(){},

loader = NR._env.loader,

url_map = {},
pkg_map = {},
script_map = {},
pending = {},
is_pending = true,
events = loader.events,
config;


if(is_active_mode){
    events.provide = function(mod){
        if(is_pending){
            pending.push(mod);
        }else{
            var 
            pkg = pkg_map.mod[mod.id],
            url = pkg && pkg_map.pkg[pkg];
            
            loadURL(url || generateModuleURL(mod));
        }
    };
    
    NR.__loader = {
        init: function(){
            config = function(config){
                makeSure(config, 'libBase', 'lib/');
                makeSure(config, 'appBase', 'app/');
                makeSure(config, 'libServer', config.server);
                makeSure(config, 'appServer', config.server);
                
                return config;
                
            }(__loaderConfig || {});
        
            var
            
            REGEX_REMOVE_DECORATION = /\.min|\.v\d+/g;
            
            (config.urls || []).forEach(function(url){
                var path = url.replace(REGEX_REMOVE_DECORATION, '');
            
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
}
    
})(NR);
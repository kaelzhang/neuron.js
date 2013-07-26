// Explode public methods

/**
 * Attach a module for business facade, for configurations of inline scripts
 * if you want a certain biz module to be initialized automatically, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     // require biz modules with no config
     facade('app-main-citylist', 'app-main-header-bar');
 
     // require biz modules with configs
     facade('app-main-citylist', {
         mod: 'app-main-header-bar',
         data: {
             icon: 'http://kael.me/u/2012-03/icon.png'
         }
     });
 
 </code>
 */
function facade(){
    makeArray(arguments).forEach(function(module){
        if(typeof module === 'string'){
            module = {
                mod: module
            };
        }
        
        module && provide(module.mod, function(method){
            method.init && method.init(module.data);
        });
    });
};


NEURON_CONF.ns.forEach(function(host) {
    host.define = define;

    // avoid using this method in product environment
    // host.use = provide;

    host.facade = facade;

    host.loader = Loader;
});

NEURON_CONF.ns.length = 0;
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
function facade(item){
    Object(item) === item && provide(item.mod, function(method){
        method.init && method.init(item.data);
    });
}


NEURON_CONF.ns.forEach(function(host) {
    host.define = define;
    host.facade = facade;
    host.loader = loader;

    // private methods only for testing
    // avoid using this method in product environment
    host._use = provide;
    host._load = loadJS;
});


NEURON_CONF.ns.length = 0;


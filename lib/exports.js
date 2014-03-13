// Explode public methods

/**
 * Attach a module for business facade, for configurations of inline scripts
 * if you want a certain biz module to be initialized automatically, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     // require biz modules with configs
     facade({
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


ENV.define = define;
ENV.facade = facade;

ENV.loader =
ENV.neuron = neuron;

// private methods only for testing
// avoid using this method in product environment
ENV._use = provide;
ENV._load = loadJS;


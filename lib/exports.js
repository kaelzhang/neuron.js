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


// @expose
ENV.define = define;

// @expose
ENV.facade = facade;

// legacy
// ENV.loader =

// private methods only for testing
// avoid using this method in product environment
// @expose
ENV._use = provide;

// @expose
ENV._load = loadJS;


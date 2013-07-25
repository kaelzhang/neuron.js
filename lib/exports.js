// Explode public methods

var ns_name = NEURON_CONF.ns;  


// ''       -> [window]
// 'NR'     -> ['NR']       -> [window.NR]
// 'NR,'    -> ['NR', '']   -> [window.NR, window]
var hosts = ns_name ? 
    ns_name.split('|').map(function(name) {
        return name && makeSureObject(ENV, name) || ENV;

    }) : [ENV];


hosts.forEach(function(host) {
    host.define = define;

    // avoid using this method in product environment
    host.use = provide;

    host.facade = facade;

    host.loader = Loader;
});


/**
 * attach a module for business requirement, for configurations of inline scripts
 * if wanna a certain biz module to automatically initialized, the module's exports should contain a method named 'init'
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
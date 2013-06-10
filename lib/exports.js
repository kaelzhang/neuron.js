ENV.define = NR.define = define;

// avoid using this method in product environment
ENV.use = NR.use = provide;

/**
 * attach a module for business requirement, for configurations of inline scripts
 * if wanna a certain biz module to automatically initialized, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     
     // require biz modules with no config
     facade('Index::common', 'Index::food');
 
     // require biz modules with configs
     facade('Index::common', {
         mod: 'Index::food',
         data: {
             icon: 'http://kael.me/u/2012-03/icon.png'
         }
     });
 
 </code>
 */
ENV.facade = NR.facade = function(){
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
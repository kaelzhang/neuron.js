/**
 * module  biz
 * method for business requirement
 */

// --- method for NR.data ----------------------- *\
function NRSetData(data){
    data && NR.mix(nr_stored_data, data);
};

function NRCloneData(){
    return NR.clone(nr_stored_data);
};

function NRGetData(name){
    return nr_stored_data[name];
};
// --- /method for NR.data ----------------------- *\


    // @type {Object}
var nr_stored_data = {};


/**
 * module  data

 * setter
 * getter

 * usage:
 * 1. NR.data()                     returns the shadow copy of the current data stack
 * 2. NR.data('abc')                returns the data named 'abc'
 * 3. NR.data('abc', 123)           set the value of 'abc' as 123
 * 4. NR.data({abc: 123, edf:456})  batch setter
 *
 * @param {all=} value 
 */
NR.data = function(name, value){
    var type = NR._type(name),
        empty_obj = {},
        is_getter, ret;
    
    if(name === undef){
        ret = NRCloneData(); // get: return shadow copy
        is_getter = true;

    }else if(type === 'string'){
        if(value === undef){
            ret = NRGetData(name); // get: return the value of name
            is_getter = true;
        }else{
            empty_obj[name] = value;
            setData


NRSetData(empty_obj) // set
        }

    }else if(type === 'object'){
        setData


NRSetData(name); // set
    }

    return is_getter ? ret : K;
};


/**
 * attach a module for business requirement, for configurations of inline scripts
 * if wanna a certain biz module to automatically initialized, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     
     // require biz modules with no config
     NR.require('Index::common', 'Index::food');
 
     // require biz modules with configs
     NR.require('Index::common', {
         mod: 'Index::food',
         config: {
             icon: 'http://kael.me/u/2012-03/icon.png'
         }
     });
 
 </code>
 */
NR.require = function(){
    var isString = NR.isString;
    
    NR.makeArray(arguments).forEach(function(module){
        if(isString(module)){
            module = {
                mod: module
            };
        }
        
        NR.provide(module.mod, function(K, method){
            method.init && method.init(module.config);
        });
    });
};


/**
 change log:
 
 2012-02-08  Kael:
 - use NR.require instead of NR.bizRequire, and no longer initialize modules after DOMReady by default. 
     Modules loaded by NR.require should manage DOMReady by their own if necessary.
 
 2011-10-13  Kael:
 - move NR.data to biz.js
 - add NR.bizRequire method to automatically provide a batch of specified modules
 
 TODO:
 A. add a method to fake a global function to put its invocations into a queue until the real implementation attached
 
 */
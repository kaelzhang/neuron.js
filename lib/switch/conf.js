/**
 * plugin enum for plugin module names and the more of module names
 */

function setPrefix(prefix, items){
    NR.makeArray(items).forEach(function(name){
        alias[name] = prefix + '/' + name;
    });
};

var alias = {},
    PLUGIN_BASE = 'switch/';

setPrefix('more', []);

module.exports = {
    prefix: setPrefix,
    
    modName: function(name){
        name = name.toLowerCase();
    
        return PLUGIN_BASE + (alias[name] || name);
    }
};
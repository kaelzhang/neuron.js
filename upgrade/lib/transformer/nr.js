var

UglifyJS = require('uglify-js'),

get_local_nr = require('../neuron/nr-define'),


handler = {
    before: function(node){
        var nr_define,
            local_nr;
    
        // must be executed within handler.before
        if(!handler.local_nr){
            if(node.CTOR === UglifyJS.AST_Call){
                nr_define = get_local_nr(node);
                
                if(nr_define){
                    handler.nr_define = local_nr = nr_define.factory_args[0];
                    
                    if(local_nr){
                        
                        // .define(function(K, require, exports){})
                        // handler.local_nr = <K>
                        handler.env.local_nr = local_nr;
                        handler.env.local_body = nr_define.body;
                    }
                }
            }
        }
        
        if(node.CTOR === UglifyJS.AST_VarDef){
            if(node.name.name === 'NR' && node.name.thedef.scope !== handler.global_scope){
                return new UglifyJS.AST_VarDef({
                    name: new UglifyJS.AST_SymbolVar({
                        name: 'NR_local'
                    })
                });
            }
        }
    },

    after: function(node){
        var nr_define;

        if(node.cloned_from === handler.local_nr){
            return new UglifyJS.AST_SymbolFunarg({
                name: 'NR' 
            });
        }
    
        // if it's a reference of global variable
        if(node.CTOR === UglifyJS.AST_SymbolRef){
            if(node.name === 'DP'){
                if(node.thedef.scope === handler.global_scope){
                    
                    return new UglifyJS.AST_SymbolRef({
                        name: 'NR'
                    });
                    
                }
            }
            
            if(handler.local_nr && node.name === handler.local_nr.name && node.thedef === handler.local_nr.thedef){
                return new UglifyJS.AST_SymbolRef({
                    name: 'NR'
                });
            }
            
            if(node.name === 'NR' && node.thedef.scope !== handler.global_scope){
                return new UglifyJS.AST_SymbolRef({
                    name: 'NR_local'
                });
            }
        }
    },  
    
    setup: function(){
        handler.env.global_vars = handler.env.global_scope.enclosed;
    }
};


module.exports = handler;
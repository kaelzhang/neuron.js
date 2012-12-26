var

UglifyJS = require('uglify-js'),

handler = {
    before: function(node){
        // if(node instance of UglifyJS.AST_VarDef)
    },

    after: function(node){
        var name;
        
        // if it's a reference of global variable
        if(node instanceof UglifyJS.AST_SymbolRef){
            if(node.name === 'DP'){
                if(node.scope === handler.global_scope){
                    node.name = 'NR';
                    
                }else{
                    node.name = 'NR_local';
                }
            }
            
        }
        
        if(node instanceof UglifyJS.AST_SymbolVar){
            // if(node.name)
        }
    },
    
    setup: function(){
        handler.global_vars = handler.global_scope.enclosed;
    },
    
    _isNRGlobal: function(){
        var IS_NR_GLOBAL = 'is_nr_global';
    
        return IS_NR_GLOBAL in handler ? 
              handler[IS_NR_GLOBAL] 
            : handler[IS_NR_GLOBAL] = handler.global_vars.some(function(symbol_var){
                return symbol_var.name === 'NR';
            });
    }
};


module.exports = handler;
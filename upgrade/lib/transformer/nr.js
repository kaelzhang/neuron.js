//////////////////////////////////////////////////////////////////
// manage global NR definitions and references
//////////////////////////////////////////////////////////////////

var UglifyJS = require('uglify-js');
var get_local_nr = require('../neuron/nr-define');

var handler = {
    before: function(node, descend){
        var nr_define;
        var local_nr = handler.local_nr;
    
        // must be executed within handler.before
        if(!local_nr){
            nr_define = get_local_nr(node);
                
            if(nr_define){

                // .define(function(K, require, exports){})
                // handler.local_nr = <K>
                handler.local_nr = nr_define.factory_args[0];

                descend(node, this);

                // prevent descending again, important!
                return node;
            }
        }

        // define(function(K , ...){})
        // K -> NR
        if(local_nr && node === local_nr){
            return new UglifyJS.AST_SymbolFunarg({
                name: 'NR'
            });
        }

        if(node.CTOR === UglifyJS.AST_VarDef){

            
            if(node.name.name === 'DP'){
                return new UglifyJS.AST_VarDef({
                    name: new UglifyJS.AST_SymbolVar({

                        // global: var DP -> var DP_global
                        // local: var DP -> var DP_local
                        name: node.name.thedef.global ? 'DP_global' : 'DP_local'
                    })
                });
            }

            // var NR -> var NR_local
            if(node.name.name === 'NR'){
                return new UglifyJS.AST_VarDef({
                    name: new UglifyJS.AST_SymbolVar({
                        name: 'NR_local'
                    })
                });
            }
        }
    
        // if it's a reference of global variable
        if(node.CTOR === UglifyJS.AST_SymbolRef){

            if(node.name === 'DP'){
                return new UglifyJS.AST_SymbolRef({
                    name: node.undeclared() ? 

                            // undeclared: DP; -> NR;
                            'NR': 

                            // global: DP; -> DP_global;
                            // local: DP; -> DP_local;
                            node.thedef.global ? 'DP_global' : 'DP_local'
                });
            }
            
            // local
            // K; -> NR;
            if(local_nr && node.name === local_nr.name && node.thedef === local_nr.thedef){
                return new UglifyJS.AST_SymbolRef({
                    name: 'NR'
                });
            }
            
            // local: `NR`;
            // NR -> NR_local
            if(node.name === 'NR' && !node.undeclared() ){
                return new UglifyJS.AST_SymbolRef({
                    name: 'NR_local'
                });
            }
        }
    }
};


module.exports = handler;
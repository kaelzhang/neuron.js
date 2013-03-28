//////////////////////////////////////////////////////////////////
// replace `return` with `module.exports`
//////////////////////////////////////////////////////////////////

var UglifyJS = require('uglify-js');
var get_local_nr = require('../neuron/nr-define');

handler = {
    before: function(node, descend){
        var nr_define;

        // may have more than one `return`s
        var local_factory = handler.local_factory;
    
        // must be executed within handler.before
        if(!local_factory){
            if(node.CTOR === UglifyJS.AST_Call){
                nr_define = get_local_nr(node);
                
                if(nr_define){

                    handler.local_factory = nr_define.factory;
                }
            }
        }

        if(node === local_factory){
            descend(node, this);

            // prevent descending again
            return node;
        }

        // prevent descending inner function scope
        // AST_Lambda includes all function declarations, such as
        // - AST_Defun
        // - AST_Accessor
        // - AST_Function
        if(node instanceof UglifyJS.AST_Lambda){
            return node;
        }

        // there might be more than one `return`s
        // @see simple.js
        if(node.CTOR === UglifyJS.AST_Return){
            return new UglifyJS.AST_Assign({
                left: new UglifyJS.AST_Dot({
                    expression: new UglifyJS.AST_SymbolRef({
                        name: 'module'
                    }),

                    property: 'exports'
                }),

                operator: '=',

                right: node.value
            });
        }
    }
};


module.exports = handler;
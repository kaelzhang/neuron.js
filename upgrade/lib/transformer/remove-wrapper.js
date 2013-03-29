
var UglifyJS = require('uglify-js');
var get_local_nr = require('../neuron/nr-define');

var handler = {
    before: function(node) {

        var nr_define;
        var splice_arguments;
        var new_body;

        // AST_Scope:
        // - AST_Toplevel
        // - AST_lambda
        //      - AST_Function
        //      - AST_Accessor
        //      - AST_Defun
        if( node instanceof UglifyJS.AST_Scope ){

            if( node.body.some(function(statement, index) {

                var statement_body;

                // `NR.define` is always inside a AST_SimpleStatement node
                if( statement.CTOR === UglifyJS.AST_SimpleStatement ){
                    statement_body = statement.body;

                    nr_define = get_local_nr(statement_body);

                    if ( nr_define ) {
                        nr_define.index = index;

                        return true;
                    }
                }

            }) ){

                if ( node.CTOR !== UglifyJS.AST_Toplevel ) {
                    console.log('Fatal Error: NR.define in non-toplevel is seriously forbidden');
                    console.log('Please manually upgrade your code');

                    process.exit(1);
                }

                // .splice(index, how_many, node1, node2, ...)
                splice_arguments = [ nr_define.index, 1 ].concat( nr_define.body );

                // clone AST_Toplevel
                new_body = node.body.map(function(statement){
                    return statement;
                });

                Array.prototype.splice.apply(new_body, splice_arguments);

                return new UglifyJS.AST_Toplevel({
                    body: new_body
                });
            }
        }
        
    },


};

module.exports = handler;
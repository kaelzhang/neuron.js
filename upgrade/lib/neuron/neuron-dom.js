var UglifyJS = require('uglify-js');
// var neuron = require('../../lib/neuron');

var _cache = [];


function is(node, ast) {
    var call_expression;
    var dot_expression;

    if(node.CTOR === UglifyJS.AST_Call){
        if( in_cache(node) ){
            return true;
        }

        // ? x.find
        // = $().find
        // = $
        call_expression = node.expression;
        
        if( call_expression.CTOR === UglifyJS.AST_Dot ){

            // x
            // $()
            dot_expression = call_expression.expression;

            // $()
            if( is(dot_expression) ){
                return true;
            
            // x:
            //      var x = $();        // VarDef
            //      var x; x = $();     // Assign
            //      multi-assign: hard
            }else{




            }
        
        // $
        }else if( expression.CTOR === UglifyJS.AST_SymbolRef ){

            // after `transformer:nr` and `transformer:$`, there will only be `$('')`
            if( expression.name === '$' ){
                _cache.push(node);

                return true;
            
            }
        }
        
    }
};


function in_cache(node){
    return _cache.indexOf(node) !== -1;
}

function clear_cache(){
    _cache.length = 0;
};


module.exports = {
    _cache      : _cache,
    is          : is,
    clear_cache  : clear_cache
};


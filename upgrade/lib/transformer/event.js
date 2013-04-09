//////////////////////////////////////////////////////////////////
// manage global $ definitions and references
//////////////////////////////////////////////////////////////////


var

UglifyJS = require('uglify-js'),

_event ={
    prevent : 'preventDefault',
    stopBubble :  'stopPropagation',
    stop : 'preventDefault-stopPropagation'
}

handler = {
    
    before: function(node,descend){
         if(node.CTOR === UglifyJS.AST_Call){
            var _expression;
            var dotAST = node.expression || "";
            var _property = dotAST.property || "";

            if(_event[_property]){
                var val = _event[_property].split("-");
                var _expression = new UglifyJS.AST_Call({
                    args: node.args,
                    expression: new UglifyJS.AST_Dot({
                        expression:dotAST.expression,
                        property:val[0]
                    })
                });
                if(val[1]){
                    return new UglifyJS.AST_Call({
                        args: [],
                        expression: new UglifyJS.AST_Dot({
                            expression:_expression,
                            property:val[1]
                        })
                    });
                    
                }else{
                   return _expression
                }
            }
        }
    },

    after: function(node){
       
    }
};


module.exports = handler;
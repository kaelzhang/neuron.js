//////////////////////////////////////////////////////////////////
// manage global $ definitions and references
//////////////////////////////////////////////////////////////////


var

UglifyJS = require('uglify-js'),

handler = {
    
    before: function(node,descend){
         if(node.CTOR === UglifyJS.AST_New && node.expression.CTOR === UglifyJS.AST_SymbolRef && node.expression.name === "Class"){
            return new UglifyJS.AST_Call({
                expression: new UglifyJS.AST_Dot({
                    expression : new UglifyJS.AST_SymbolRef({
                        name : "NR"
                    }),
                    property: "Class"
                }),
                args:node.args
            });
      }
    },

    after: function(node){
       
    }
};


module.exports = handler;
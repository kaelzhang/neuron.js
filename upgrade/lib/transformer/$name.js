var

UglifyJS = require('uglify-js'),

get_local_nr = require('../neuron/nr-define'),



handler = {
    
    // _globe :function(str,node){
    //     var _stack = {};

    //      _stack[str] = node.global() ? true : false;

    //     handler._globe =  function(str,node){
           
    //         if(_stack[str])
    //             return _stack[str];
          
    //         else{

    //             _stack[str] = node.global() ? true : false;
               
    //             handler._globe = function(str){
                  
    //                 return _stack[str];
         
    //             }
    //         }
    //     }
        
    // },

    before: function(node){

        if(node.CTOR === UglifyJS.AST_VarDef &&  node.name.name === "$"){ 
            if(node.value && node.value.CTOR === UglifyJS.AST_Dot && node.value.expression
                 && node.value.expression.CTOR === UglifyJS.AST_SymbolRef && node.value.expression.name === "NR"
                 && node.value.property === "DOM"
               ){
                return new UglifyJS.AST_Null();
            }else{
                return new UglifyJS.AST_VarDef({
                    name :new UglifyJS.AST_SymbolVar({
                            name: "$_local"
                    }),
                    value :  node.value
                }) 
            }
        }


        // if(node.CTOR === UglifyJS.AST_Assign && node.left.undeclared() && node.left.name === "$" && node.right.CTOR ===UglifyJS.AST_Dot
        //     && node.right.expression.CTOR === UglifyJS.AST_SymbolRef && node.right.expression.name === "NR"
        //     && node.right.property === "DOM"
        //     ){
            

        //     return new UglifyJS.AST_Null();
        // }


        if(node.CTOR === UglifyJS.AST_SymbolRef && node.name === "$"){
              return new UglifyJS.AST_SymbolRef({
                name : node.undeclared() ? "$" : "$_local"
             })
        }

        

        if(node.CTOR === UglifyJS.AST_Dot && node.expression && 
            node.expression.name === "NR" && node.expression.property === "DOM"
            ){
            return new UglifyJS.AST_SymbolRef({
                name : "$"
            })
        }


        

    },

    after: function(node){
       // console.log(handler.global_scope+"截断\n")

       //console.log(handler._stack.length)
      // console.log(node.thedef.orig[0].CTOR === handler._stack[0].CTOR+"\n");
    }
};


module.exports = handler;
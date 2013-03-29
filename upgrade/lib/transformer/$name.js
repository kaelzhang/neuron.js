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

        if(node.CTOR === UglifyJS.AST_SymbolRef && node.name === "$"){
              return new UglifyJS.AST_SymbolRef({
                name : node.undeclared() ? "$" : "$_local"
             })
        }

        if(node.CTOR === UglifyJS.AST_VarDef){

            if(node.name.name === '$'){
                 
                return 
                     
            }
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
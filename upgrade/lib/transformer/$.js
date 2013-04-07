//////////////////////////////////////////////////////////////////
// manage global $ definitions and references
//////////////////////////////////////////////////////////////////


var

UglifyJS = require('uglify-js'),


is_NR_DOM =  require('../neuron/nr-dom'),



$_keys = ['true'],

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

    before: function(node,descend){

        var index = $_keys.length-1;
        // var $ =  NR.DOM => null
        // var $ != NR.DOM => $_local = xxx 
        if(node instanceof UglifyJS.AST_Lambda){
            $_keys.push($_keys[index])
        }

        if(node.CTOR === UglifyJS.AST_VarDef &&  node.name.name === "$"){ 
            if(node.value  && is_NR_DOM(node.value)
               ){
                $_keys[index] = "true";

                return new UglifyJS.AST_Null()
            }else{
                $_keys[index] = "false";
                return new UglifyJS.AST_VarDef({
                    name :new UglifyJS.AST_SymbolVar({
                            name: "$_local"
                    }),
                    value :  node.value
                }) 
            }
        }
     //   console.log($_key.length)
        // $ = NR.DOM => null

        if(node.CTOR === UglifyJS.AST_Assign && node.left.name === "$" && node.operator === "="
            && is_NR_DOM(node.right)
            ){
            return new UglifyJS.AST_Null();
        }

        // if(node.CTOR === UglifyJS.AST_Assign && node.left.undeclared() && node.left.name === "$" && node.right.CTOR ===UglifyJS.AST_Dot
        //     && node.right.expression.CTOR === UglifyJS.AST_SymbolRef && node.right.expression.name === "NR"
        //     && node.right.property === "DOM"
        //     ){


        //     return new UglifyJS.AST_Null();
        // }
        
        if(node.CTOR === UglifyJS.AST_SymbolRef && node.name === "$"){
            
              //if node is undecalred  , node = > globe   infer  $ = >$  
                // if(node.undeclared()){
                //     return  new UglifyJS.AST_SymbolRef({
                //                 name : "$"
                //              })
                // }else{
                    var index = $_keys.length - 1;
                   //如果之前作用域 定义了 var $ = NR.DOM 后面scope 中的 $ = > $ 
                    if($_keys[index] === "true"){
                        return  new UglifyJS.AST_SymbolRef({
                                name : "$"
                             })
                    }
                    //反之
                    else if($_keys[index] === "false"){
                    
                        return new UglifyJS.AST_SymbolRef({
                                name : "$_local"
                             })
                    }
                //}
              
        }
       // console.log(node.name&&node.name.name)
        //if(node.CTOR ===UglifyJS.AST_Object)
        // NR.DOM => $
        if(node.CTOR === UglifyJS.AST_Dot && node.expression && 
            node.expression.name === "NR" && node.property === "DOM"
            ){
                return new UglifyJS.AST_SymbolRef({
                 name : "$"
            })
        }
       // console.log(node.CTOR.toString()+"\nbefor")
 //console.log(node.CTOR.toString()+"\n")
        

    },

    after: function(node){
       // console.log($_keys,"after");
      //  console.log($_keys.length);
   //   console.log($_keys,"after");

        if(node instanceof UglifyJS.AST_Lambda){
            $_keys.pop();
        }

         
    }
};


module.exports = handler;
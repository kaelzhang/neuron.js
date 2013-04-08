//////////////////////////////////////////////////////////////////
// NR.DOM = > jquery--$
//////////////////////////////////////////////////////////////////


var

UglifyJS = require('uglify-js'),

log =  require('../neuron/log'),
neuronDom =  require('../neuron/neuron-dom'),

map_1 = {
  get : "eq",
  match : "is",
  el : "get",
  all : "find",
  count : "length",
  one : "find",
  forEach : "forEach"
},

map_2 = {
  prev:'prev',
  prevAll:'prevAll',
  next:'next',
  nextAll:'nextAll',
  children:'children',
  parent:'parent',
  parents:'parents'
},



handler = {
    before: function(node){

        //判断为.()类型的
        if(node.CTOR === UglifyJS.AST_Call){
            
            var dotAST = node.expression || "";
            var _property = dotAST.property || "";
            
            //判断为$("")类型的
            if(dotAST && (map_1[_property] || map_2[_property])){
                 if(!neuronDom.is(dotAST)){
                      log(dotAST);
                  }
                // $.forEach = > 不变
                if(_property === "forEach"){
                    return node;
                }else{
                    var _expression;
                    //$.count() = >$.length
                    if(_property === "count"){

                        return new UglifyJS.AST_Dot({
                                      expression : dotAST.expression,
                                      property : "length"
                                });
                    }
                    
                    if(map_2[_property] || _property === "one" || _property === "all"){
                         _expression = new UglifyJS.AST_Call({

                            expression: new UglifyJS.AST_Dot({
                                            expression : dotAST.expression,
                                            property : "eq"
                            }),

                            args : [
                                    new UglifyJS.AST_Number({
                                          value : 0                                
                                    })
                            ]                                                                                                      
                          });
                    }else{
                        _expression = dotAST.expression;
                    }


                    if(map_1[_property]){ 
                        _expression = new UglifyJS.AST_Call({

                                              expression : new UglifyJS.AST_Dot({
                                                  expression : _expression,
                                                  property : map_1[_property]

                                               }),
                                              args : node.args
                                      })
                    }

                    if(_property === "one"){
                        _expression = new UglifyJS.AST_Call({

                            expression: new UglifyJS.AST_Dot({
                                            expression : _expression,
                                            property : "eq"
                                         }),

                            args : [
                                    new UglifyJS.AST_Number({
                                          value : 0                                
                                    })
                            ]                                                                                                      
                          });
                    }

                    return _expression;
                                             
                }


            }
        }
    },
            //var expression = node.expression;



            //处理$("") = > $("").eq(0)
            

            // if(expression && expression.CTOR === UglifyJS.AST_SymbolRef && expression.name === "$"){

                // return  new UglifyJS.AST_Call({

            //                 expression: new UglifyJS.AST_Dot({
            //                                  expression : node,
            //                                  property : "eq"
            //                              }),

            //                 args : [
            //                         new UglifyJS.AST_Number({
            //                               value : 0                                
            //                         })
            //                 ]                                                                                                      
            //             });
           //}

        
  

    after: function(node){
       
    },

    setup: function(){

    },

    tearDown: function(){
        neuronDom.clear_cache();
    }
};


module.exports = handler;
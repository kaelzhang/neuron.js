var

UglifyJS = require('uglify-js'),
map = {
  get : "eq",
  match : "is",
  el : "get",
  one : "find",
  all : "find"
};

handler = {
    before: function(node){

        //判断为.()类型的
        if(node.CTOR === UglifyJS.AST_Call){
            
            var dotAST = node.expression || "";
                
                //判断为$("")类型的
                if(dotAST && dotAST.CTOR === UglifyJS.AST_Dot && dotAST.expression && dotAST.expression.CTOR === UglifyJS.AST_Call
                   &&  dotAST.expression.expression && dotAST.expression.expression.CTOR ===  UglifyJS.AST_SymbolRef && dotAST.expression.expression.name === "$"){
                   
                    var  _property = dotAST.property || "";
                   
                      switch(_property){
                          case "forEach":
                              return node;



                          default:
                              var _expression;

                              if(_property === "count"){

                                  return new UglifyJS.AST_Dot({
                                                      expression : dotAST.expression,
                                                      property : "length"
                                          });
                              }


                              if(_property === "one" || _property === "all" || !map[_property]){
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


                              if(map[_property]){ 
                                  _expression = new UglifyJS.AST_Call({

                                                        expression : new UglifyJS.AST_Dot({
                                                            expression : _expression,
                                                            property : map[_property]

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

            //var expression = node.expression;



            //处理$("") = > $("").eq(0)
       			

        		// if(expression && expression.CTOR === UglifyJS.AST_SymbolRef && expression.name === "$"){

        				// return  new UglifyJS.AST_Call({

            //                 expression: new UglifyJS.AST_Dot({
            //                              		expression : node,
            //                              		property : "eq"
            //                              }),

            //                 args : [
            //                         new UglifyJS.AST_Number({
            //                               value : 0                                
            //                         })
            //                 ]                                                                                                      
            //             });
        	 //}

        
    },

    after: function(node){
       
    }
};


module.exports = handler;
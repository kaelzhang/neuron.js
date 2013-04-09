//////////////////////////////////////////////////////////////////
// NR.DOM = > jquery--$
//////////////////////////////////////////////////////////////////


var

UglifyJS = require('uglify-js'),

log =  require('../neuron/log'),
neuronDom =  require('../neuron/neuron-dom'),

//流水线处理





//$().方法 => $().eq(0).方法
map_1 = {
  prev:true,
  prevAll:true,
  next:true,
  nextAll:true,
  children:true,
  parent:true,
  parents:true,
  one:true,
  all:true
},

//$().方法=>方法名要变
map_2 = {
  get : "eq",
  match : "is",
  el : "get",
  all : "find",
  one : "find",
  child : "children"
},

//$().方法 => $().方法.eq(0)
map_3 = {
  one :true,
  child:true
},
//特殊处理
map_4 = {
    forEach:true,
    count : "length"
},


handler = {
    before: function(node,descend){

        //判断为.()类型的
        if(node.CTOR === UglifyJS.AST_Call){
            var _expression;
            var dotAST = node.expression || "";
            var _property = dotAST.property || "";
            
            //判断为.方法()类型的，入口
            if(dotAST && (map_1[_property] || map_2[_property] || map_4[_property] || map_4[_property])){

                //处理$.all() =>$()
                 if(dotAST.expression.CTOR === UglifyJS.AST_SymbolRef && _property ==="all"){
                      
                      _expression = new UglifyJS.AST_Call({
                            expression : new UglifyJS.AST_SymbolRef({
                                name:"$"
                             }),
                            args : node.args
                        });

                      descend(_expression,this);

                      return _expression;
                 } 
                 //处理.el(0) =>[0]
                 if(_property === "el" && node.args.length ===1 && node.args[0].CTOR === UglifyJS.AST_Number && node.args[0].value ===0){
                      descend(node,this);
                      return new UglifyJS.AST_Sub({
                          expression:dotAST.expression,
                          property:new UglifyJS.AST_Number({
                              value : 0
                          })
                      })
                 }

                 //打点
                 if(!neuronDom.is(dotAST)){
                     // log(dotAST);
                  }

                // $.forEach = > 不变
                if(_property === "forEach"){
                   // _expression = dotAST.expression;
                    descend(node,this);
                    return node;
                }else{
                    
                    //$.count() = >$.length
                    if(_property === "count"){
                               
                           _expression = new UglifyJS.AST_Dot({
                                         expression : dotAST.expression,
                                         property : "length"
                          });

                           descend(_expression,this);

                           return _expression;
                    }
                    


                    //流水线处理




                    if(map_1[_property]){

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


                    
                    _expression = new UglifyJS.AST_Call({

                                      expression : new UglifyJS.AST_Dot({
                                          expression : _expression,
                                          property : map_2[_property] || _property
                                       }),
                                      args : node.args 
                                  })
                    

                    if(map_3[_property]){
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

                    
                    descend(_expression,this);
                    
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
        _expression = "";
    }
};


module.exports = handler;
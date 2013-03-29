/**
 * get the local namespace of neuron
 
 // neuron 1.0
 .define([deps, ], function(K, ...){
     
 });
 
 -> K
 
 */
 
var UglifyJS = require('uglify-js');

function returnTrue(){
    return true;
}

 
// @param {UglifyJS.AST_Call} node
module.exports = function(node, checker){

    if(node.CTOR !== UglifyJS.AST_Call){
        return;
    }


    var expression = node.expression;
    var property;
    var args;
    var factory;
    
    checker = checker || returnTrue;

    // xx.xx()
    if(expression.CTOR === UglifyJS.AST_Dot && checker(node)){
        property = expression.property;
        
        // xx.define()
        if(property === 'define'){
        
            // deps, factory
            args = node.args;
            
            // xx.define(xxx, function(){})
            if(args.some(function(sub_node){
                if(sub_node instanceof UglifyJS.AST_Function){
                    factory = sub_node;
                    
                    return true;
                }
                
            })){
                return {
                    factory_args: factory.argnames,
                    body: factory.body,
                    factory: factory,
                    node: node
                };
            }
        }
    }
};
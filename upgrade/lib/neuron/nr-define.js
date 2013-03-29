/**
 * get the local namespace of neuron
 
 // neuron 1.0
 .define([deps, ], function(K, ...){
     
 });
 
 -> K
 
 */
 
var

UglifyJS = require('uglify-js');
 
// @param {UglifyJS.AST_Call} node
module.exports = function(node){
    var expression = node.expression,
        property,
        args,
        factory;
    
    // xx.xx()
    if(expression.CTOR === UglifyJS.AST_Dot){
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
                    factory: factory
                };
            }
        }
    }
};
/**
 * check node is NR.DOM
 
 // neuron 1.0
NR.DOM
 
 */
 
var

UglifyJS = require('uglify-js');
 
// @param {UglifyJS.AST_Call} node
module.exports = function(node){

    return (node.CTOR === UglifyJS.AST_Dot) && (node.expression.name === "NR") &&
            (node.property === "DOM")?true : false;
   
};
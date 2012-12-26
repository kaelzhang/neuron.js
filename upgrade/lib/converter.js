'use strict';

// require('../../tools/colorize');

var

lang = require('./util/lang'),
fs = require('fs'),
path = require('path'),
neuron = require('../../lib/neuron'),

UglifyJS = require('uglify-js'),

TRANSFORMER_ROOT = './transformer/',

PRESET_TRANSFORMERS = ['nr'];



var

converter = {

    // parse a piece of code into AST
    parse: function(content){
        return UglifyJS.parse(content);
    },

    convert: function(ast, transformers){
        transformers = transformers || PRESET_TRANSFORMERS;
        
        converter._prepareToplevelAst(ast);
        
        ast = converter._applyTransformers(ast, transformers);
        
        converter._removeGlobalVarDef(ast);
        
        return ast;
    },

    printCode: function(ast){
        var stream = UglifyJS.OutputStream({
                beautify: true
            });
        
        ast.print(stream);
        
        return stream.toString();
    },
    
    _prepareToplevelAst: function(ast){
        
        if(ast instanceof UglifyJS.AST_Toplevel){
        
            converter._addGlobalVarDef(ast);
            
            // figure out scope so that we will never do harmfull replacement
            ast.figure_out_scope();
            
            converter._globalScope();
        }
    },
    
    _addGlobalVarDef: function(ast){
        var global_varname = ['DP', '$'];
    
        // add the definition of global variables of neuron 1.0 to global scope
        //      global DP;
        //      global $;
        // so Toplevel::figure_out_scope() method will get the right determination of global variables
        ast.body.unshift(
            new UglifyJS.AST_Var({
                definitions: global_varname.map(function(key){
                    var symbol_var = new UglifyJS.AST_SymbolVar({ name: key });
                    
                    if(!converter.global_var){
                        converter.global_var = symbol_var;
                    }
                
                    return new UglifyJS.AST_VarDef({
                        name: symbol_var
                    });
                })
            })
        );
        
        return ast;
    },
    
    // generate the global scope of current ast
    _globalScope: function(){
        converter.global_scope = converter.global_var.scope;
    },
    
    _removeGlobalVarDef: function(ast){
        ast.body.shift();
    
        return ast;
    },
    
    /**
     * @param {Array.<string|UglifyJS.TreeTransformer>} array
     */
    _applyTransformers: function(ast, array){

        // tree transformers
        array.forEach(function(handler){
            var tt;
        
            if(neuron.isString(handler)){
                handler = require(TRANSFORMER_ROOT + handler);
            }
            
            if(neuron.isObject(handler)){
                handler.global_scope = converter.global_scope;
                
                handler.setup && handler.setup();
            
                tt = new UglifyJS.TreeTransformer(handler.before || null, handler.after || null);
                ast = ast.transform(tt);
            }
        });
        
        return ast;
    }
};

module.exports = converter;


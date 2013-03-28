var

neuron = require('../../../lib/neuron'),

UglifyJS = require('uglify-js'),

RELATED_PROP = {
    'AST_Function'      : ['name', 'argnames', 'body'],
    'AST_SymbolFunarg'  : ['name'],
    'AST_Dot'           : ['expression', 'property'],
    'AST_Call'          : ['args', 'expression', 'body'],
    'AST_Defun'         : ['argnames', 'name', 'body'],
    'AST_Var'           : ['definitions'],
    'AST_VarDef'        : ['name', 'value'], //,
    // 'AST_SymbolVar'     : ['name']
};


var

fn_arg_def,
ref_def;


function write(msg, stack){
    // process.stdout.write(msg);
    stack.push(msg);
};


function walk(ast, stack, space, extra, is_final){
    space = space || '';
    
    write(space, stack);
    write(extra ? extra + ': ' : '', stack);
    
    if(neuron.isString(ast)){
        write('string ' + ast + '\r\n', stack);
        
        return;
    }
    
    var constructor = ast.CTOR,
        type = constructor.name;
    
    write(type + ' ', stack);
    
    write('\r\n', stack);
    
    var props = RELATED_PROP[type] || ['body', 'name'];
    
    props.forEach(function(prop){
        var sub = ast[prop];
        
        if(neuron.isArray(sub) && sub.length === 0){
            write(space + '  ', stack);
            write(prop + ': ' + type + ' []', stack);
            
            write('\r\n', stack);
             
        }else{
            neuron.makeArray(ast[prop]).forEach(function(node){
                walk(node, stack, space + '  ', prop);
            });
        }        
        
    });
};


module.exports = function(ast){
    var stack = [];
    
    walk(ast, stack);
    
    return stack.join('');
};


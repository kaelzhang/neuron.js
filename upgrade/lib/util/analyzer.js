var

neuron = require('../../../lib/neuron'),

UglifyJS = require('uglify-js'),

RELATED_PROP = {
    'AST_Call':     ['args', 'expression', 'body'],
    'AST_Defun':    ['argnames', 'name', 'body'],
    'AST_Var':      ['definitions'],
    'AST_VarDef':   ['name', 'value'] //,
    // 'AST_SymbolVar':['scope']
}

function getFuntionName(fn){
    return String(fn).match(/^function ([^\(]+)/)[1];
};


function walk(ast, space, extra, is_final){
    space = space || '';
    
    var constructor = ast.CTOR,
        type = getFuntionName(constructor);
    
    process.stdout.write(space);
    process.stdout.write((extra ? extra + ': ' : '') + type + ' ' );
    
    if(neuron.isString(ast.name)){
        // console.log('astname', ast.name)
        process.stdout.write(ast.name);
    }
    
    if(type === 'AST_SymbolFunarg'){
        console.log(ast.thedef.CTOR);
    }
    
    process.stdout.write('\r\n');
    
    var props = RELATED_PROP[type] || ['body'];
    
    props.forEach(function(prop){
        var sub = ast[prop];
        
        if(neuron.isArray(sub) && sub.length === 0){
            process.stdout.write(space + '  ');
            process.stdout.write(prop+ ': ' + type + ' []' );
            
            process.stdout.write('\r\n');
             
        }else{
            neuron.makeArray(ast[prop]).forEach(function(node){
                walk(node, space + '  ', prop);
            });
        }        
        
    });
    
};


module.exports = walk;


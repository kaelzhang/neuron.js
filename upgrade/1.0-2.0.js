var

FILE = '1.0-2.0-res.js',
OUTPUT = '1.0-2.0-ouput.js';

require('./util/colorize');

var

walker = require('./util/walker'),
lang = require('./util/lang'),
fs = require('fs'),

uglifyjs = require('uglify-js'),
parser = uglifyjs.parser,
uglify = uglifyjs.uglify;

var 

ast = parser.parse(fs.readFileSync(FILE).toString());


// all changes below will affect the origin `ast`

/**
 * 'DP' -> 'NR'
 * 'KM' -> 'NR'
 * ['name', 'DP']
 * first of all, we must change namespace which will affect all invocations 
 */ 
/*
walker.walk(ast, 'name', function(stat){
    if(stat[1] === 'DP'){
        stat[1] = 'NR';
    }
});
*/



var 

// @type {string} the local name of NR within module wrappings
// DP.define(function(K){})  -> 'K'
local_nr_name,

nr_dot_define = [
    "dot",
    [
        "name",
        "NR"
    ],
    "define"
],

nr_define_count = 0,
count = 0;

/**
 * 
 */
walker.walk(ast, 'call', function(stat){

    console.log('call <<<<<<<<<<<<<<<<<<<<<')
    
    var fn_name = stat[1],
        args_ast;
    
    // whether is NR.define
    if(lang.isEqual(fn_name, nr_dot_define)){
        args_ast = stat[2];
        
        nr_define_count ++;
        
        console.log('begin log fn >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        debugger;
        walker.get_fn_content(args_ast, function(stat){ console.log(++ count)
            console.log('fn: args_ast', args_ast);
            console.log('fn: stat', stat);
        });
        
        console.log('end get fn >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    }
    
    console.log('end walker.walk >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
});

console.log('end >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

/*
if(nr_define_count !== 1){
    console.log('Error: NR.define must be used once and only once within a single module'.red);
    // throw 'error occurs';
}
*/


/**
 * var DP; -> var NR
 * [ 'var', [ [ 'DP' ] ] ]
 */
/*
walker.walk(ast, 'var', function(stat){
    var name_arr = stat[1][0];
    
    if(name_arr[0] === 'DP'){
        name_arr[0] = 'NR';
    }
});

*/







var 

output = fs.openSync(OUTPUT, 'w+');

fs.writeSync(output, uglify.gen_code(ast, {
    beautify: true
}));
fs.closeSync(output);
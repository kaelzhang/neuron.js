'use strict';

require('../tools/colorize');

var

walker = require('./util/walker'),
lang = require('./util/lang'),
fs = require('fs'),

uglifyjs = require('uglify-js'),
parser = uglifyjs.parser,
uglify = uglifyjs.uglify;


function convert(ast){


////////////////////////////////////////////////////////////////////////////////////////////
// all changes below will affect the origin `ast`
////////////////////////////////////////////////////////////////////////////////////////////


var 

STR_NR = 'NR';

/**
 * dealing with NR namespace ------------------------------------------------->
 */


/**
 * 'DP' -> STR_NR
 * 'KM' -> STR_NR
 * ['name', 'DP']
 * first of all, we must change namespace which will affect all invocations 
 */ 

walker.walk(ast, 'name', function(sub_ast){
    if(sub_ast[1] === 'DP'){
        sub_ast[1] = STR_NR;
    }
});


var 

// @type {string} the local name of NR within module wrappings
// NR.define(function(K){})  -> 'K'
local_nr_name,
nr_define_closure,

nr_dot_define = [
    "dot",
    [
        "name",
        "NR"
    ],
    "define"
],

nr_define_count = 0;


/**
 * NR.define(function(K){})  -> NR.define(function(NR){})
 */
walker.walk(ast, 'call', function(stat){
    
    var fn_name = stat[1],
        args_ast,
        first = true,
        fn_method = fn_name[2];
    
    // whether is NR.define
    if(lang.isEqual(fn_name, nr_dot_define)){
        args_ast = stat[2];
        
        nr_define_count ++;
        
        walker.fn_content(args_ast, function(stat){
            if(first){
                first = false;
                // NR.define(function(K){})  -> 'K'
                local_nr_name = stat.args[0];
                stat.args[0] = STR_NR;
                
                nr_define_closure = stat.content;
            }
        });
    
    // .prevent() -> .preventDefault()
    }else if(fn_method === 'prevent'){
        fn_name[2] = 'preventDefault';
    
    // .stopBubble() -> .stopPropagation()
    }else if(fn_method === 'stopBubble'){
        fn_name[2] = 'stopPropagation';
    
    }
});


if(nr_define_count !== 1){
    console.log('Error: NR.define must be used once and only once within a single module'.red);
    throw 'error occurs';
}


// ['name', local_nr_name] -> ['name', NR]
walker.walk(ast, 'name', function(sub_ast){
    if(sub_ast[1] === local_nr_name){
        sub_ast[1] = STR_NR;
    }
});



var

// those asts which declare a local NR object
nr_var_asts_removing = [],

// @type {Array.<>}
var_names_assigned_to_dollar = [],

AST_NAME_NR = ['name', STR_NR],
AST_NAME_DOLLAR = ['name', '$'];


walker.walk(ast, {

    /**
     var DP;
     [
        "var",
        [
            [
                "DP"
            ]
        ]
     ]
     
     var DP = NR;
     [
        "var",
        [
            [
                "DP",
                [
                    "name",
                    "NR"
                ]
            ]
        ]
     ]
     
     */
    'var': function(sub_ast){
        var 
        
        var_asts = sub_ast[1],
        length = var_asts.length,
        removing = [];
        
        var_asts.forEach(function(name_arr, i){
            var 
            
            var_name = name_arr[0],
            assigned_to = name_arr[1];
            
            // var DP = XXX;
            // var K = XXX;
            // var NR = XXX;
            // var $ = XXX;
            if(var_name === 'DP' || var_name === local_nr_name || var_name === 'NR' || var_name === '$'){
                removing.push(name_arr);
                length --;
        
        /**
                var assigned = name_arr[1];
            
                if(!assigned){
                
                    // var DP; -> var NR;
                    name_arr[0] = STR_NR;
                    
                }else if(lang.isEqual(assigned, AST_NAME_NR)){
                    nr_var_asts_removing.push(sub_ast);
                }
        */
            
            }
            
            // var _$ = $;
            if(lang.isEqual(assigned_to, AST_NAME_DOLLAR)){
                removing.push(name_arr);
                var_names_assigned_to_dollar.push(var_name);
                length --;
            }
            
            // TODO:
            // remove var NR
            // remove var k = NR (formerly, var k = K)
        });
        
        if(length > 0){
            nr_var_asts_removing = nr_var_asts_removing.concat(removing);
            
        }else{
        
            // remove all var
            nr_var_asts_removing.push(sub_ast);
        }
    },
    
    /**
     [
        "assign",
        true,
        [
            "name",
            "$"
        ],
        [
            "name",
            "DP"
        ]
     ]
     */
    'assign': function(sub_ast){
        var be_assigned = sub_ast[2],
            assigned_to = sub_ast[3];
        
        if(lang.isEqual(be_assigned, AST_NAME_DOLLAR)){
            nr_var_asts_removing.push(sub_ast);
        }
        
        if(lang.isEqual(assigned_to, AST_NAME_DOLLAR)){
            nr_var_asts_removing.push(sub_ast);
            var_names_assigned_to_dollar.push(be_assigned[1]);
        }
    }
    
});


// removing all unnecessary declaration
nr_var_asts_removing.forEach(function(sub_ast){
    walker.remove_sub_ast(sub_ast, ast);
});



/**
 * dealing with $ ------------------------------------------------->
 */

// NR.DOM -> $              
walker.replace_sub_ast([
        "dot",
        [
            "name",
            "NR"
        ],
        "DOM"

    ], [
        "name",
        "$"
        
    ], nr_define_closure, {
        strict: false
    }
);

walker.insert_code('var $ = NR.DOM', nr_define_closure, 0);

walker.walk(ast, 'name', function(sub_ast){    
    var name = sub_ast[1];
    
    if(var_names_assigned_to_dollar.indexOf(name) !== -1){
        sub_ast[1] = '$';
    }
});



function get_all_fn_call(ast){
    var sub_asts = [];
    
    walker.walk_ast(ast, function(sub_item, env){
        if(sub_item === 'call'){
            sub_asts.push(env.ast);
            
            // prevent traversing even deeper, so that we only get the whole calling chain without duplication
            env.skip();
        }
    });
    
    return sub_asts;
};


var

// 'fn' and 'method' are different, 
// a fn is a individual function
// a method is a object method

// after $
INSERT_EQ_AFTER_FN = ['$'],

// before .prev()
INSERT_EQ_BEFORE_METHOD = ['child', 'prev', 'prevAll', 'next', 'nextAll', 'children', 'parent', 'parents'],
INSERT_EQ_BEFORE_METHOD_ASTS = [],


METHOD_TO_CHANGE = [
    {
        name: 'get',
        to: 'eq',
        condition: function(stat){
            var arg = stat.arg,
                first_arg = arg[0];
            
            // nr_element.get()
            // nr_element.get(0)
            return arg.length === 0 || arg.length === 1 && first_arg[0] === 'num';
        }
        
    }, {
        name: 'all',
        to: 'find',
        condition: function(stat){
            return !lang.isEqual(stat.former_result, ["name", "$"]);   
        }
        
    }, {
        name: 'el',
        to: 'get'
    }
],

METHOD_NAME_TO_CHANGE = METHOD_TO_CHANGE.map(function(config){
    return config.name;
}),

COUNT_ASTS = [],

METHOD_TO_CHANGE_INSERT_EQ_AFTER = [
    {
        name: 'one',
        to: 'find'
    }, {
        name: 'child',
        to: 'children'
    }
],

METHOD_NAME_TO_CHANGE_INSERT_EQ_AFTER = METHOD_TO_CHANGE_INSERT_EQ_AFTER.map(function(config){
    return config.name;
})

;


get_all_fn_call(nr_define_closure).forEach(function(ast, i){
    walker.walk(ast, 'call', function(sub_ast){
    
        var fn_name_ast = sub_ast[1],
            
            fn_name_operator = fn_name_ast[0],
            former_result = fn_name_ast[1],
            fn_name = fn_name_ast[2];
        
        /**
         a.b();
         
         [
            "call",
            [
                "dot",
                [
                    "name",
                    "a"
                ],
                "b"
            ],
            [
            ]
         ]
        
         */ 
        if(fn_name_operator === 'dot'){
            var index = METHOD_NAME_TO_CHANGE.indexOf(fn_name);
        
            if(index !== -1){
                var 
                
                stat = {
                    arg: sub_ast[2],
                    former_result: former_result
                },
                
                config = METHOD_TO_CHANGE[index];
                
                if(!config.condition || config.condition(stat)){
                    fn_name_ast[2] = config.to;
                }
                
            }
            
            if(INSERT_EQ_BEFORE_METHOD.indexOf(fn_name) !== -1){
                
                var 
                
                // []
                prev_sub_ast = fn_name_ast[1];
                INSERT_EQ_BEFORE_METHOD_ASTS.push(prev_sub_ast);
                
            }
            
            if(fn_name === 'count'){
                
                COUNT_ASTS.push({
                    ast: sub_ast,
                    former_result: former_result
                });
            
            }
            
            if((index = METHOD_NAME_TO_CHANGE_INSERT_EQ_AFTER.indexOf(fn_name)) !== -1){
                
                fn_name_ast[2] = METHOD_TO_CHANGE_INSERT_EQ_AFTER[index].to;
                
                walker.replace_sub_ast(sub_ast, [
                    "call",
                    [
                        "dot",
                        sub_ast,
                        "eq"
                    ],
                    [
                        [
                            "num",
                            0
                        ]
                    ]
                    
                ], nr_define_closure, {
                   all: false
                });
            }
        }
        
        /**
         [
                "call",
            [
                "name",
                "$"
            ],
            [
                [
                    "string",
                    "ab"
                ]
            ]
         ]
         
         $(selector) -> $(selector).eq(0)
        */
        if(lang.isEqual(fn_name_ast, ["name", "$"])){
            walker.replace_sub_ast(sub_ast, [
                "call",
                [
                    "dot",
                    sub_ast,
                    "eq"
                ],
                [
                    [
                        "num",
                        0
                    ]
                ]
                
            ], nr_define_closure, {
               all: false
            });
        
        
        }
        
        // $.all(selector) -> $(selector) 
        if(lang.isEqual(fn_name_ast, [
            "dot",
            [
                "name",
                "$"
            ],
            "all"
        ])){
            sub_ast[1] = ["name", "$"];
        
        
        // $.one(selector) -> $(selector).eq(0)
        }else if(lang.isEqual(fn_name_ast, [
            "dot",
            [
                "name",
                "$"
            ],
            "one"
        ])){
            sub_ast[1] = ["name", "$"];
            
            walker.replace_sub_ast(sub_ast, [
                "call",
                [
                    "dot",
                    sub_ast,
                    "eq"
                ],
                [
                    [
                        "num",
                        0
                    ]
                ]
                
            ], nr_define_closure, {
               all: false
            });
        }
        
        
    });
});


INSERT_EQ_BEFORE_METHOD_ASTS.forEach(function(sub_ast){

    // .x(y) -> .eq(0).x(y)
    walker.replace_sub_ast(sub_ast, [
        "call",
        [
            "dot",
            sub_ast,
            "eq"
        ],
        [
            [
                "num",
                0
            ]
        ]
        
    ], nr_define_closure, {
        all: false
    });
});


COUNT_ASTS.forEach(function(obj){

    // .count() -> .length
    walker.replace_sub_ast(obj.ast, [
        "dot",
        obj.former_result,
        "length"
        
    ], nr_define_closure, {
        all: false
    });
});


/*
var 

output = fs.openSync(OUTPUT, 'w+');

fs.writeSync(output, uglify.gen_code(ast, {
    beautify: true
}));
fs.closeSync(output);
*/

return ast;

};

exports.parse = function(content){
    return parser.parse(content);
};

exports.convert = convert;

exports.gen_code = function(ast){
    return uglify.gen_code(ast, {
        beautify: true
    });
};

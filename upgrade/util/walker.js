var

NR = require('../../lib/neuron/seed'),

lang = require('./lang'),

uglify = require('uglify-js'),
parser = uglify.parser,
pro = uglify.uglify,
fs = require('fs'),

ast_walker = pro.ast_walker(),

REGEX_MATCH_DOT = /\.(?!$)/;

console.log('abc', NR);


/**
 * @param {Object} obj
 * @param {Object} condition
 */
function isConditionMatched(obj, condition){
    var pass = true;
    
    Object.keys(condition).forEach(function(rule, key, condition){
        pass = pass && NR.isFunction(rule) ? 
              rule(obj[key])
            : lang.isEqual(obj[key], condition[key]);
            
    });
    
    return pass;
};


/**
 * @param {Array} ast uglifyjs ast
 * @param {string} type statement type
 * @param {function()} interator callback
 */
exports.walk = function(ast, type, interator){
    var walkers,
        ret;
    
    if(NR.isString(type)){
        walkers = {};
    
        walkers[type] = function(){
            interator(this);
        };
        
    }else if(NR.isObject(type)){
        walkers = type;
        
    }else{
        return;
    }
    
    return ast_walker.with_walkers(walkers, function(){
        return ast_walker.walk(ast);
    }); 
};


/**
 * @param {string} file file path
 */
exports.walk_file = function(file, type, interator){
    var content = fs.readFileSync(file);
    
    return exports.walk(parser.parse(content.toString()), type, interator);
};


/**
 * @param {Object} condition {
        fnName: {string},
        args: {Array.<string>}
    }
 * @returns {Array}
 */
exports.get_fn_content = function(ast, condition, callback){
    var

    fn_walkers = {
    
        /**
         function foo(){};
         
         ast:
         [ 'defun', 'foo', ['x'], []]
         
         */
        'defun': function(){
            var stat = this;
            
            // before calling callback, make sure the current sub-ast is a syntax tree of function
            filter({
                args: stat[2],
                content: stat[3]
            });
        },

        /**
        foo = function(x){};
        
        ast:
        [
            "assign",
            true,
            [
                "name",
                "a"
            ],
            [
                "function",
                null,
                [
                    "x"
                ],
                [
                ]
            ]
        ]
        */
        'assign': function(){
            var stat = this,
                to = stat[3],
                data;
                
            if(to[0] === 'function'){
                filter({
                    fnName: stat[2][1],
                    args: to[2]  
                });
            }
        },
        
        
        /**
         var foo = function(x){};
         
         ast:
         [
            "var",
            [
                [
                    "foo",
                    [
                        "function",
                        null,
                        [
                            "x"
                        ],
                        [
                        ]
                    ]
                ]
            ]
        ]
         
         */
        'var': function(){
            var stat = this,
                content = stat[1][0];
            
            if(content){
                var value = content[1];
                
                if(value && value[0] === 'function'){
                    filter({
                        fnName: content[0],
                        args: value[2]
                    })
                }
            }
            
        },
        
        
    };
    
    
    var fnName = condition.fnName;
    
    if(fnName){
        if(REGEX_MATCH_DOT.test(fnName)){
            condition.fnName = parser.parse(fnName)[1][0][1];
        }   
    }
    
    var filter = function(stat){
        isConditionMatched(stat, condition) && callback(stat)
    };
    
    
    exports.walk(ast, fn_walkers, filter);
    
};


exports.insert = function(code, to, position){
    
};



exports.remove_sub_ast = function(sub_ast, from, all){
    
};


exports.get_parent_ast = function(sub_ast, full_ast){
    
};


exports.walk_ast = function(ast, traverser, env){
    env || (env = {});
    
    var 
    
    i = 0,
    len = ast.length,
    sub_ast;
    
    for(; i < len; i ++){
        sub_ast =
        if()
    }
};




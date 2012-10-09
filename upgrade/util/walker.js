/**
 * enhanced ast walker based on uglifyjs
 */

var

NR = require('../../lib/neuron/seed'),

lang = require('./lang'),

uglify = require('uglify-js'),
parser = uglify.parser,
pro = uglify.uglify,
fs = require('fs'),

ast_walker = pro.ast_walker(),

Walker = exports,

REGEX_MATCH_DOT = /\.(?!$)/;


/**
 * @param {Object} obj
 * @param {Object} condition
 */
function isConditionMatched(obj, condition){
    var pass = true;
    
    Object.keys(condition).forEach(function(key, index){
        var rule = this[key],
            value = obj[key];
    
        pass = pass && (
            NR.isFunction(rule) ? 
              rule(value)
            : lang.isEqual(value, rule)
        );
            
    }, condition);
    
    return pass;
};


/**
 * walk an ast with build-in `with_walkers` of uglifyjs
 * @param {Array} ast uglifyjs ast
 * @param {string|Object} type statement type, or walker object
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
 * read a file, parse it to ast, then use `Walker.walk`
 * @param {string} file file path
 */
exports.walk_file = function(file, type, interator){
    var content = fs.readFileSync(file);
    
    return Walker.walk(parser.parse(content.toString()), type, interator);
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
            
            // before calling `callback`, make sure the current sub-ast is a syntax tree of function
            filter({
                fnName: stat[1],
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
                "foo"
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
                    args: to[2],
                    content: to[3]
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
                        args: value[2],
                        content: content[1][3]
                    })
                }
            }
            
        }  
    };
    
    
    var fnName = condition.fnName;
    
    if(fnName){
        if(REGEX_MATCH_DOT.test(fnName)){
            condition.fnName = parser.parse(fnName)[1][0][1];
        }   
    }
    
    var filter = function(stat){
        isConditionMatched(stat, condition) && callback(stat);
    };
    
    
    Walker.walk(ast, fn_walkers, filter);  
};


/**
 * insert a sub-ast to an existed ast
 * @param {Array} sub_ast
 * @param {Array} to destination ast
 * @param {number} position the index to be inserted to
 */
exports.insert_ast = function(sub_ast, to, position){
    if(NR.isArray(sub_ast) && NR.isArray(to)){
        var U;
    
        if(position === U){
            position = to.length;
            
        }else if(position < 0){
            position += to.length;
        }
        
        to.splice(position, 0, sub_ast);
    }
};


exports.insert_code = function(code, to, position){
    /**
     var a = 1;
     
     ast:
     [
        "toplevel",
        [
            [
                "var",
                [
                    [
                        "a",
                        [
                            "num",
                            1
                        ]
                    ]
                ]
            ]
        ]
     ]
     */
    var sub_ast = parser.parse(code)[1][0];
    
    Walker.insert_ast(sub_ast, to, position);
};


/**
 * remove a sub-ast. notice that this method will change the origin ast
 * @param {Object} options {
    all: {boolean} remove all, default to all
    strict: {boolean} use strict equal(===) or deep equal(lang.isEqual), default to deep equal
 }
 */
exports.remove_sub_ast = function(sub_ast, from, options){
    options = NR.mix({
        all: true,
        strict: true
        
    }, options);

    Walker.walk_ast(from, function(current, env){
        if(options.strict ? current === sub_ast : lang.isEqual(sub_ast, current)){
            var index = env.ast.indexOf(sub_ast);
            
            env.ast.splice(index, 1);
            
            if(!options.all){
                return false;
            }
        } 
    });
};


/**
 * get parent ast
 */
exports.get_parent_ast = function(sub_ast, full_ast){
    var parent;
    
    if(NR.isArray(sub_ast) && NR.isArray(full_ast)){
    
        Walker.walk_ast(full_ast, function(current, env){
            if(current === sub_ast){
                parent = env.ast;
                return false;
            }
        });
        
        return parent;
    
    }else{
    
        return null;
    }
};


/**
 * walk an ast with manual traverser
 * @param {Array} ast uglifyjs ast
 * @param {function()}
 */
exports.walk_ast = function(ast, traverser){

    // during 
    if(!NR.isArray(ast)){
        return;
    }
    
    var
    
    // internal use
    env = arguments[2],
    
    i = 0,
    len = ast.length,
    sub_ast;
    
    env || (env = {});
    
    // so that we can use the current ast with env.ast inside `traverser`
    env.ast = ast;
    
    for(; i < len; i ++){
        sub_ast = ast[i];
        
        // 
        if(env.stopped){
            break;
        }
        
        if(traverser(sub_ast, env) === false){
            env.stopped = true;
            break;
        }
        
        if(NR.isArray(sub_ast)){
            var sub_env = {
                parent: env
            };
        
            Walker.walk_ast(sub_ast, traverser, {
                parent: env
            });
        }
    }
};




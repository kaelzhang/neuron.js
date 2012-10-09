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


function adaptWalkers(walkers, current_item, current_sub_ast){
    var stat;
    
    for(stat in walkers){
        if(current_item === stat){
            walkers[stat](current_sub_ast);
        }
    }
};


/**
 * walk an ast with build-in `with_walkers` of uglifyjs
 * @param {Array} ast uglifyjs ast
 * @param {string|Object} type statement type, or walker object
 * @param {function()} interator callback
 
 * @usage
 
    // walk(ast, type, walker) ->
    Walkers.walk(ast, 'var', function(sub_ast){
        // ...
    });
    
    // walk(ast, walkers) ->
    Walkers.walk(ast, {
        'var': function(sub_ast){
            // ..
        },
        
        'function': function(sub_ast){
            // ..
        }
    });
    
 */
exports.walk = function(ast, type, interator){

    // walk(ast, type, walker)
    if(NR.isString(type)){
        walkers = {};
    
        walkers[type] = function(sub_ast){
            interator(sub_ast);
        };
        
    // walk(ast, walkers)
    }else if(NR.isObject(type)){
        walkers = type;
        
    }else{
        return;
    }

    Walker.walk_ast(ast, function(sub_item, env){
        adaptWalkers(walkers, sub_item, env.ast);
    });
};
 
/*
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
*/

/**
 * read a file, parse it to ast, then use `Walker.walk`
 * @param {string} file file path
 */
exports.walk_file = function(file, type, interator){
    var content = fs.readFileSync(file);
    
    return Walker.walk(parser.parse(content.toString()), type, interator);
};


/**
 * @param {Object=} condition {
        fnName: {string},
        args: {Array.<string>}
    }
 * @returns {Array}
 */
exports.get_fn_content = function(ast, callback, condition){
    condition || (condition = {});
    
    var fnName = condition.fnName;
    
    if(fnName){
        if(REGEX_MATCH_DOT.test(fnName)){
            condition.fnName = parser.parse(fnName)[1][0][1];
        }
    }

    var

    filter = function(stat){
        isConditionMatched(stat, condition) && callback(stat);
    },

    fn_walkers = {
    
        /**
         function foo(){};
         
         ast:
         [ 'defun', 'foo', ['x'], []]
         
         */
        'defun': function(sub_ast){
            
            // before calling `callback`, make sure the current sub-ast is a syntax tree of function
            filter({
                fnName: sub_ast[1],
                args: sub_ast[2],
                content: sub_ast[3],
                ast: sub_ast,
                type: 'defun'
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
        'assign': function(sub_ast){
            var to = sub_ast[3],
                data;
                
            if(to[0] === 'function'){
                filter({
                    fnName: sub_ast[2][1],
                    args: to[2],
                    content: to[3],
                    ast: sub_ast,
                    type: 'assign'
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
        
        ast(declare without assignment):
        var foo;
        [
            "var",
            [
                [
                    "foo"
                ]
            ]
        ]
         
         */
        'var': function(sub_ast){
            var content = sub_ast[1][0];
            
            if(content){
                var value = content[1];
                
                if(value && value[0] === 'function'){
                    filter({
                        fnName: content[0],
                        args: value[2],
                        content: content[1][3],
                        ast: sub_ast,
                        type: 'var'
                    })
                }
            }
        },
        
        /**
         function as arguments
         
         async(function foo(a){})
         
         [
            "function",
            'foo',
            [
                "a"
            ],
            [
            ]
         ]
         
         */
        'function': function(sub_ast){
            filter({
                fnName: sub_ast[1],
                args: sub_ast[2],
                content: sub_ast[3],
                ast: sub_ast,
                type: 'function'
            });
        }
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
                env.stop();
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
                env.stop();
            }
        });
        
        return parent;
    
    }else{
    
        return null;
    }
};


var ENV_PROPS = {
    
    // marker to determine whether the current traversion should be stopped
    _stopped: {
        value: false,
        writable: true
    },
    
    // marker to determine whether the current depth of the traversion should be skipped
    // if true, traverser will pop the current stack and continue traverse the next sub ast
    _skipped: {
        value: false,
        writable: true
    },
    
    stop: {
        value: function(){
            this._stopped = true;
        }
    },
    
    skip: {
        value: function(){
            this._skipped = true;
        }  
    },
    
    resume: {
        value: function(){
            this._stopped = false;
            this._skipped = false;
        }
    },
    
    isStopped: {
        value: function(){
            return this._stopped;
        }
    },
    
    isSkipped: {
        value: function(){
            return this._skipped;
        }
    },
    
    isTopLevel: {
        value: function(){
            return !!this.parent;
        }
    }
};


function createEnv(parent){
    var env = Object.create(null, ENV_PROPS);
    
    Object.defineProperty(env, 'parent', {
        value: parent || null,
        emumerable: true
    });
    
    return env;
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
    sub_item;
    
    if(!env){
        env = createEnv();
    }
    
    // so that we can use the current ast with env.ast inside `traverser`
    env.ast = ast;
    
    for(; i < len; i ++){
        sub_item = ast[i]; // console.log('sub_item', sub_item)
         
        if(env.isStopped()){ console.log('stopped!!!!!!!!!!!!!!!')
            break;
        }
        
        if(env.isSkipped()){ console.log('skipped!!!!!!!!!!!!!!!')
            env.resume();
            break;
        }
        
        traverser(sub_item, env);
        
        // if sub_item may be an ast
        if(NR.isArray(sub_item)){
            Walker.walk_ast(sub_item, traverser, createEnv(env));
        }
    }
};




/**
 * module  javascript template engine
 */
 
/**
 
 # syntax
 
 ## variable
 @{abc}
 
 ## code snippet
 <?js //mycode ?> 
 
 */

/**
 * @return {function()} returns a compiled template function
 */
function compile(template){    
    var 

    // @type {string} set initial value of o as "", so o won't be `undefined`
    // 'o' -> 'output'
    compiled = 'var o="";',
        
    // @type {Object} reader object of the compiler
    reader,
    
    matched_code, 
    matched_tpl,
    pos = 0,
    last = 'begin',
    
    compilers = COMPILERS,
    regex_scope = exports.REGEX_JSTL_SCOPE;
    
    /**
     * @type {Object} reader {
             '0': '<?js mycode ?>',
             '1': ' mycode ',
             index: {number},
             input: {string}
       }
     */
    while((reader = regex_scope.exec(template)) !== null){
        matched_tpl = reader[0];
        matched_code = reader[1] || reader[2];
        
        // normal string
        if(reader.index > pos && reader.index > 0){
            compiled += compilers[last].addString
                     
                     // normal codes
                     + template.substring(pos, reader.index).replace(/"/g, '\\"').replace(/[\r\n]+/g, '');
            
            last = 'string';
        }
        
        // matched code slice
        if(matched_tpl.indexOf(exports.CODE_PRE) === 0){
            compiled += compilers[last].addCode + matched_code;
            if(/\)$/.test(matched_tpl)){
                compiled += ';';
            }
            last = 'code';
        
        // matched code parameter
        }else if(matched_tpl.indexOf(exports.PARAM_PRE) === 0){
            compiled += compilers[last].addParam + matched_code;
            last = 'param';
        }
        
        pos = reader.index + matched_tpl.length;
    }
    
    if(pos < template.length){
        compiled += compilers[last].addString + template.substring(pos).replace(/"/g, '\\"').replace(/[\r\n]+/g, '');
        last = 'string';
    }

    compiled += compilers[last].end + 'return o;';
 
 
     /**
      * `it` is the entrance parameter of the template function
      * all JavaScript template should contains the `it` parameter,
      * if you expect your template function to be able to accept values
      */
    return new Function('it', compiled);
};


var 

EMPTY = '',

// REGEX_REMOVE_SINGLE_LINE_COMMENTS = /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g,

/**
 * Carriage Return
 */
// REGEX_CRLF = /[\t]/g,

COMPILERS = {
    begin: {
        // the end of the matched code slice
        addString   : 'o+="',
        addCode     : EMPTY, 
        addParam    : 'o+=',
        end         : EMPTY
    },
    
    // string between code snippets and variables
    string: {
        addString   : EMPTY, 
        addCode     : '";', 
        addParam    : '"+',
        end         : '";'
    },
    
    // JavaScript code between `<?js` and its corresponding `?>`
    code: {
        addString   : 'o+="', 
        addCode     : EMPTY,
        addParam    : 'o+=',
        end         : EMPTY
    },
    
    // JavaScript variable between `@{` and `}`
    param: {
        addString   : '+"',
        addCode     : ';', 
        addParam    : '+',
        end         : ';'
    }
};


// explode syntax settings

/*
 * JavaScript Template scope
 * match criteria like `<?js //code... ?>`
 * or,
 * `@{variable}`
 */
exports.REGEX_JSTL_SCOPE = /<\?js((?:.|\r|\n)+?)\?>|@\{(.+?)\}/g, // lazy match
exports.CODE_PRE = '<?js';
exports.PARAM_PRE = '@{';

/**
 * for most cases you should cache the template function by using tpl.parse
 * @param {string} template JavaScript template
 * @param {Object} data module
 
 * @return {string} rendered string
 */
exports.render = function(template, data){
    return parse(template)(data);
};

 
/**
 * method to compile a template into a function
 * @return {function()} the compiled template function
 */
exports.compile = function(template){
    return compile(template);
};


// legacy
// @deprecated
exports.parse = exports.compile;


/**
 change log:

 2013-03-03  Kael:
 - explode syntax settings into the exports
 - maintain comments and CRLF, fixes #3
 
 2012-08-21  Kael:
 - fix parser of `begin` so that template compiler will not throw error if template is an empty string
 
 2011-10-23  Kael:
 - complete main functions tpl.render and tpl.parse of JavaScript Template engine
 
 
 */

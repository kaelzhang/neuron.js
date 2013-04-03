var uglify_js = require('uglify-js');
var mod_url = require('url');
var globalNameSpace = "NR";
var REGEX_EXECUTOR_REQUIRE = /[^.]\brequire\((["'])([a-zA-Z0-9-\/.~:]+)\1\)/g;



// function standardize(origin){
//     var ast = jsp.parse(origin.toString());
//     return pro.gen_code(ast);
// };

function parseRequires(code){
    var m,
        deps = [];
    
    while(m = REGEX_EXECUTOR_REQUIRE.exec(code)){
        if(deps.indexOf(m[2]) == -1){
            deps.push(m[2]);
        }
    }
    return deps;

};    


// libbase -> lib
// appbase -> app
// 
// 
module.exports = function(origin,id){
    var code = origin;
    var reqs = parseRequires(origin).map(function(req){return "\"" + req + "\"";});

    

    if(reqs.length >0){
        return "NR.define(\"" + id + "\", ["+reqs.join(",")+"], function(require, exports, module){var $ = NR.DOM;\n"+origin+"\n});";
    }else{
        return "NR.define(\"" + id + "\", [], function(require, exports, module){var $ = NR.DOM;\n"+origin+"\n});";
    }
}
var 

// apps = require("../../config/apps"),
uglify_js = require('uglify-js'),
globalNameSpace = "NR";

var REGEX_EXECUTOR_REQUIRE = /[^.]\brequire\((["'])([a-zA-Z0-9-\/.~:]+)\1\)/g;


function standardize(origin){
    var ast = jsp.parse(origin.toString());
    return pro.gen_code(ast);
};

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
module.exports = function(origin,uri,req){
    var code = origin,
        reqs = parseRequires(origin).map(function(req){return "\"" + req + "\"";});
      //  console.log(reqs);


    if(reqs.length >0){
        return "NR.define(["+reqs.join(",")+"],function(require,exports,module){var $ = NR.DOM;\n"+origin+"})";
    }else{
        return "NR.define([],function(require,exports,module){var $ = NR.DOM;\n"+origin+"})";
    }
}
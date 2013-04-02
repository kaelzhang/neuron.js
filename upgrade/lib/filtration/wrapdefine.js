var uglify_js = require('uglify-js');
var mod_url = require('url');
var globalNameSpace = "NR";
var REGEX_EXECUTOR_REQUIRE = /[^.]\brequire\((["'])([a-zA-Z0-9-\/.~:]+)\1\)/g;

var APP_BASE = 's/j/app/';
var LIB_BASE = 'lib/1.0/';


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
module.exports = function(origin, url){
    var code = origin;
    var reqs = parseRequires(origin).map(function(req){return "\"" + req + "\"";});
    var query_url = mod_url.parse(url, true).query.url;

    if(!query_url){
        console.log('query url not defined');
        process.exit(1);
    }

    var url_object = mod_url.parse(query_url);

    var index;
    var id;

    if( (index = url_object.pathname.indexOf(LIB_BASE)) !== -1 ){
        id = url_object.pathname.slice( index + LIB_BASE.length ).replace(/\.js$/, '');
    
    }else if( (index = url_object.pathname.indexOf(APP_BASE)) !== -1){
        id = url_object.pathname.slice( index + APP_BASE.length ).replace(/\.js$/, '').replace('/', '::');
    }

    if(reqs.length >0){
        return "NR.define(\"" + id + "\", ["+reqs.join(",")+"], function(require, exports, module){var $ = NR.DOM;\n"+origin+"\n});";
    }else{
        return "NR.define(\"" + id + "\", [], function(require, exports, module){var $ = NR.DOM;\n"+origin+"\n});";
    }
}
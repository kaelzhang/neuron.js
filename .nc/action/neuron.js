var fs = require('fs');
var url = require('url');
var fs_more = require('fs-more');
var mod_path = require('path');
var util = require('../inc/util');

var REGEX_IS_JS = /\.js$/;


filterData = function (req,data){   
    var filter_arr = req.config.filters || [],
        url = req.originurl;

    filter_arr.forEach(function(filter){
        if(filters[filter]){
            data = filters[filter](data,url,req);
        }
    });
    
    return data;

}


function neuron_static(req,res){
    var config = req.config,
        pathname = req.pathname, // /a/b/c.js
        position = req.position, // /home/spud/a/b/c.js
        libbase = config.libbase, // support multi libbase later
        dirpath = mod_path.dirname(position), // /home/spud/a/b
        coverage_libbase = config.jscoverage_libbase,
        extname  = mod_path.extname(position); // .js

    if(coverage_libbase && new RegExp(coverage_libbase).test(pathname)){
        libbase = coverage_libbase;
    }
    
    function try_from_build(){
        var build_file_path = mod_path.join(dirpath,"build.json"),
            basename = mod_path.basename(position);

        if(!fs.existsSync(build_file_path)){
            return false;
        }

        try{
            var concats = JSON.parse(fs.readFileSync(build_file_path)).concat;
            
        }catch(e){
            return false;
        }


        var concat = concats.filter(function(data){
            return data.output === basename;
        })[0];


        if(!concat){
            return false;
        }

        var toconcat = concat.path.map(function(subpath){
            return mod_path.join(config.origin,libbase,concat.folder,subpath);
        });

        filedata = fs_more.concatFilesSync(toconcat);
        filedata = util.filterData(req, filedata);

        util.write200(req,res,filedata);
        return true;
    }

    function try_from_dir(){
        var toconcat,
            filedata,

            basename  = mod_path.basename(position,extname), // c
            path_with_same_name = mod_path.join(dirpath,basename); // /home/spud/a/b/c
        
        if(!fs_more.isDirectory(path_with_same_name)){
            return false;
        }

        if(!pathname.match(libbase)){
            return false;
        }

        toconcat = fs.readdirSync(path_with_same_name).filter(function(e){
            return mod_path.extname(e) === extname;
        }).map(function(e){
            return mod_path.join(dirpath,basename,e);
        });


        filedata = "NR.define.on();\n";
        filedata += fs_more.concatFilesSync(toconcat,function(file, p){
            var moduleBase = p.split(config.libbase)[0], // /Users/spud/Neuron/branch/neuron/
                moduleName = p.split(moduleBase)[1]; // /lib/1.0/switch/core.js
                
            return file.replace(/(KM|NR)\.define\(/,"NR.define('" + moduleName + "',") + "\n";
        });

        filedata += "NR.define.off();";

        util.write200(req,res,filedata);
        return true;
    }

    function try_from_static(){

        if(!fs_more.isFile(position)){
            util.write404(req,res);
            return;
        }

        var filedata = fs.readFileSync(position,'binary');

        if(fs_more.isFile(position) && REGEX_IS_JS.test(position)){
            filedata = util.filterData(req,filedata);
        }
        
        util.write200(req,res,filedata);
    }

    if(try_from_build())return;

    if(try_from_dir())return;

    try_from_static();
}

module.exports = neuron_static;
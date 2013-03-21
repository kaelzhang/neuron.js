var util = require('../inc/util'),
	linkTree = require('../inc/linktree'),
	mod_path = require('path'),
	fs = require('fs'),
	fsutil = require('../inc/fs'),
	util = require('../inc/util'),
	url = require('url');
	
function utcases(req,res){
	var config = req.config;
	var dir = mod_path.join(config.origin,"test","unit");


	var linktree,flatterned,type;
	if(!fsutil.isDir(dir)){
		util.write404(req,res);
		return false;
	}

	linktree = linkTree(dir,".html",[".js",".html"],['ajax']);
	type = url.parse(req.url,true).query.type || "concats";


	function concats(tree,ignore){
		var ret = [],
			ignore = ignore || [];
		
		tree.children.forEach(function(child){
			if(ignore.indexOf(child.name)===-1){
				ret.push({
					name:child.name,
					link:"http://" + req.headers.host  + child.link
				});
			}
		});		
		return ret;	
	}	
	
	
	function all(tree,ignore,flattened){
		var ret = flattened ||　[],
			ignore = ignore || [];
		
		if(ignore.indexOf(tree.name)===-1){
			if(!tree.children){
				ret.push({
					name:tree.name,
					link:"http://" + req.headers.host  + tree.link
				});
			}
		}
		
		if(tree.children){
			tree.children.forEach(function(child){
				all(child,ignore,ret);
			});
		}
		
		return ret;	
	}
	
	
	if(type == "all"){
		flatterned = all(linktree);
	}else if(type == "concats"){
		flatterned = concats(linktree,["SAMPLE"]);
	}
	
	content = JSON.stringify(flatterned);
	util.write200(req,res,content);
}


module.exports = utcases;

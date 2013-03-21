var view = require('../inc/view'),
	
	fs = require('fs'),
	dirTree = require('../inc/dirtree'),

	mod_path = require('path'),
	mod_url = require('url'),
	fsutil = require('../inc/fs'),	


	util = require('../inc/util');



function wrap_code(data){
	return '<script type="text/javascript">'+data+'</script>';
}

function filelist(obj,arr){
	arr = arr || [];
	var path = obj.path;

	if(path.indexOf('.js') > 0 || path.indexOf(".html")>0){
		arr.push(path);
	}
	
	if(obj.children){
		obj.children.forEach(function(child){
			filelist(child,arr);	
		});
	}
	return arr;
}

function ut(req,res){
	var htmlpos = req.position,
		jscoverage = false,
		jspos = mod_path.join(req.filepath+".js"),
		need_coverage = ["jscoverage.html","jstest.dianpingoa.com"],
		dirpos = req.filepath,
		
		filesToConcat,

		content;

		function needCoverage(){
			return req.headers.referer && need_coverage.some(function(str){
				return req.headers.referer.indexOf(str) >= 0;
			});
		}

		if(needCoverage()){
			jscoverage = true;
		}


		if(fsutil.isFile(htmlpos)){
			content = fs.readFileSync(htmlpos);
			view.render(req,res,req.route_name,{content:content,jscoverage:jscoverage});
			return;
		}

		if(fsutil.isFile(jspos)){
			content = wrap_code(fs.readFileSync(jspos));
			view.render(req,res,req.route_name,{content:content,jscoverage:jscoverage});
			return;
		}

		if(fsutil.isDir(dirpos)){

			filesToConcat = filelist(dirTree(dirpos));

			content = util.concatFiles(filesToConcat,function(data,path){
				return fsutil.isJs(path) ? wrap_code(data) : data;
			},'utf8');

			view.render(req,res,req.route_name,{content:content,jscoverage:jscoverage});
			return;
		}
		
		util.write404(req,res);
}


module.exports = ut;


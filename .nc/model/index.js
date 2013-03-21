var view = require('../inc/view'),
	fsutil = require('../inc/fs'),
	mod_path = require('path'),
	fs = require('fs'),
	md = require('node-markdown').Markdown;

function index(req,res){
	var pos = mod_path.join(req.position,"README.md"),
		content = "";

	if(fsutil.isFile(pos)){
		content = md(fs.readFileSync(pos,'utf8'));
	}

	view.render(req,res,req.route_name,{content:content});
}


module.exports = index;

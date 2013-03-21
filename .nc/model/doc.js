var fsutil = require('../inc/fs'),
	util = require('../inc/util'),
	view = require('../inc/view'),
	mod_path = require('path'),
	fs = require('fs'),
	md = require('node-markdown').Markdown;

module.exports = function(req, res){
	var data = req.dataGetter();

	if(fsutil.isFile(data.doc)){
		view.render(req, res, req.router_name, {
			content:md( fs.readFileSync(data.doc, 'utf8') )
		});
	}else{
		util.write404(req,res);
	}
}
var 
  http = require("http"),
  fs = require('fs'),
  url = require('url'),
  querystring = require('querystring');

var 
	UglifyJS = require('uglify-js'),
	upgrade = require('../converter'),
	analyzer = require('../util/analyzer'),
	wrapdefine = require('./wrapdefine');

var server = http.createServer(function(req,response){
		 var queryObject = querystring.parse(url.parse(req.url).query),
		 // 	file_content = require(file['url'] || "");
				 urlReg = /((?:http|https):\/\/[^\/]+)(.+)/ig,

				 file =  queryObject.url || "",

				 urlA;

				if(!file){
					console.log("请求文件地址不存在")
					return ;
				}

				urlA = urlReg.exec(file);

	
				var content = "";

				http.get(urlA[1]+urlA[2], function(res) {

						res.setEncoding('utf8');
						
						res.on('data',function(chunk){
									 
									 content+=chunk;

						});



						res.on('end',function(){
	   			
							     ast = upgrade.parse(content);

						  		 ast = upgrade.convert(ast);

						  	   analyzer(ast);

						  		 code = upgrade.printCode(ast);

						  		 response.writeHead(200);
						  		 
						  		 response.write(wrapdefine(code, req.url));

						  		 response.end();

						});

						res.on('error',function(chunk){

								console.log("文件加载失败");

						})


				}).end();


 }).listen(2000);

console.log('Server was started!');

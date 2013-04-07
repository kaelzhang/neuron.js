	//加载模块
	
	var http = require("http"),
		fs = require('fs'),
		mod_url = require('url'),
		querystring = require('querystring');
	
	//加载文件 
	
	var UglifyJS = require('uglify-js'),
		upgrade = require('../converter'),
		analyzer = require('../util/analyzer'),
		wrapdefine = require('./wrapdefine');
			
	//全局常量
	
	var APP_BASE = 's/j/app/';
	var LIB_BASE = 'lib/1.0/';
	

	//服务器监听
	var server = http.createServer(function(req,response){
		//url path对象
		var queryObject = querystring.parse(mod_url.parse(req.url).query);
				// 	file_content = require(file['url'] || "");
		// 文件url
		var file =  queryObject.url || "";
		
		

		//url相关参数对象		
		var url_object = mod_url.parse(file);
		//文件类型匹配判断
		var index;
		  // lib 目录
		var libDir;
		  //文件相对地址
		var fileId;
		//返回js内容
		var content = "";

	    if(!file){
	        console.log("请求文件地址不存在")
		    return ;
	    }

  
			//lib文件处理
      	if((index = url_object.pathname.indexOf(LIB_BASE)) !== -1 ){
       
        	fileId = url_object.pathname.slice( index + LIB_BASE.length ).replace(/\.js$/, '');
   			
        	http.get("http://localhost:1337/lib/"+fileId+".js", function(res) {

				res.setEncoding('utf8');
				
				res.on('data',function(chunk){
							 
					content+=chunk;

				});

				res.on('end',function(){										
			  		 
			  		response.write(content);

			  		response.end();

				});

				res.on('error',function(chunk){

					console.log("文件地址有误");

				});

			}).end();
      	//app文件处理	    
	    }else if( (index = url_object.pathname.indexOf(APP_BASE)) !== -1){
	        
	        fileId = url_object.pathname.slice( index + APP_BASE.length ).replace(/\.js$/, '').replace('/', '::');
	    					
			http.get(file, function(res) {

				res.setEncoding('utf8');
				
				res.on('data',function(chunk){
							 
					content+=chunk;

				});



				res.on('end',function(data){
								
					var _code;

				    ast = upgrade.parse(content);

			  		ast = upgrade.convert(ast);

			  	    analyzer(ast);

			  		_code = upgrade.printCode(ast);

			  		response.writeHead(200);
			  		 
			  		response.write(wrapdefine(_code,fileId));

			  		response.end();

				});

				res.on('error',function(chunk){

					console.log("文件地址有误");

				});


			}).end();
		}
	}).listen(2000);

	console.log('Server was started!');

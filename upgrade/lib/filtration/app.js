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
	
	//  全局常量
	
	var APP_BASE = 's/j/app/';
	var LIB_BASE = 'lib/1.0/';
	
	//  全局变量

	var server = http.createServer(function(req,response){
	//url path对象
	var queryObject = querystring.parse(mod_url.parse(req.url).query),
			// 	file_content = require(file['url'] || "");
	// 文件url
			file =  queryObject.url || "";
	
	

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

  

	    if( (index = url_object.pathname.indexOf(LIB_BASE)) !== -1 ){
	       
	        fileId = url_object.pathname.slice( index + LIB_BASE.length ).replace(/\.js$/, '');
	   			libDir ="../../../lib/"+fileId;
	        if(fs.existsSync(libDir)){
	        	
	        	var files =  fs.readdirSync(libDir),

	        			index = files.length-1;

	        			for(;index+1;index--){
	        				var _file = files[index];
	        				if(_file.indexOf(".js")!== -1){
	        					content += fs.readFileSync(libDir+"/"+_file).toString();
	        				}
	        			}
	        			
	        			ast = upgrade.parse(content);

				  		  ast = upgrade.convert(ast);

				  	    analyzer(ast);

				  		  code = upgrade.printCode(ast);

				  		 response.writeHead(200);
				  		 
				  		 response.write(wrapdefine(code,fileId));

				  		 response.end();
				  		 
	        }else{
	        	console.log("组件不存在");
	        }


	    
	    }else if( (index = url_object.pathname.indexOf(APP_BASE)) !== -1){
	        
	        fileId = url_object.pathname.slice( index + APP_BASE.length ).replace(/\.js$/, '').replace('/', '::');
	    		
					

					http.get(file, function(res) {

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
						  		 
						  		 response.write(wrapdefine(code,fileId));

						  		 response.end();

						});

						res.on('error',function(chunk){

								console.log("文件加载失败");

						});


					}).end();


	    }else{


	    }

 }).listen(2000);

console.log('Server was started!');

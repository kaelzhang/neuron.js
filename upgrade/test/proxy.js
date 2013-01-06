'use strict';

var

http = require('http'),
upgrade = require('../1.0-2.0');

http.createServer(function(req, res){

var

url = req.url,
is_js = /\.js$/.test(url);

if(is_js){
    url = url.replace(/\.min\.v\d+/, '') + '?' + (+ new Date);
}

url = 'http://i1.dpfile.com' + url;

console.log('connect', url);

http.get(url, function(sub_res){
    var content = '';

    sub_res.on('data', function (chunk) {
        content += chunk;
    });
    
    sub_res.on('end', function () {
        
        if(!is_js){
            res.write(content);
            
        }else{
        
            try{
                var ast = upgrade.parse(content);
                
                upgrade.convert(ast);
            
                res.write( upgrade.gen_code(ast) );
                
            }catch(e){
                // console.log(JSON.stringify(e));
                // res.write(url, 'console.log(' + JSON.stringify(e) + ')');
                res.write(content);
            }
        }
        
        res.end();
    });
    
    sub_res.on('close', function(e){
        console.log('connection closed:', e);
        events.close(e);
    });
    
}).on('error', function(e){

    console.log(e);
    
});


  
}).listen(8900);
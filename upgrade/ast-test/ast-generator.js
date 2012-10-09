var 

// READ = '1.0-2.0.js',
READ = 'simple.js',

// OUTPUT = 'result.js',
OUTPUT = 'simple-result.js',

uglify = require('uglify-js'),

fs = require('fs')



pro = uglify.uglify,
parser = uglify.parser;


var 

fd = fs.openSync(OUTPUT, 'w+'),

content = fs.readFileSync(READ).toString();


var 


builder = [],
ast = parser.parse(content),

ast_walker = pro.ast_walker();

/*
ast_walker.with_walkers({
    'var': function(){
        
    
        console.log(this);
    
        serialize(builder, this, 0);
        
        console.log(builder.join(''))

        fs.writeSync(fd, 'new start >>>>>>\n');

        fs.writeSync(fd, builder.join(''));
        
        fs.writeSync(fd, '\n\n\n')
        
        
    }
    
}, function(){
    return ast_walker.walk(ast);
     
});
*/

serialize(builder, ast, 0);
fs.writeSync(fd, builder.join(''));



fs.closeSync(fd);


function appendIndent(builder, indent) {
    for (var i = 0; i < indent; i++){
        builder.push("    ");
    }
};


function serialize(builder, list, indent) {

    if (!list || !list.push) {
        appendIndent(builder, indent);

        builder.push(JSON.stringify(list));

        return;
    }

    appendIndent(builder, indent);
    builder.push("[\n");

    for (var i = 0; i < list.length; i++) {

        serialize(builder, list[i], indent + 1);
        if (i != list.length - 1) builder.push(",");
        builder.push("\n");
    }

    appendIndent(builder, indent);
    builder.push("]");
}

/*
function parse() {
    var code = document.getElementById("code").value;
    var result;
    
    try {
        var list = UglifyJS.parse(code);
        
        var builder = [];
        serialize(builder, list, 0);
        
        result = builder.join("");
    } catch (ex) {
        result = "error";
    }
    
    document.getElementById("r").innerHTML = "<pre style='font-family:consolas,monaco;'>" + result + "</pre>";
}
*/
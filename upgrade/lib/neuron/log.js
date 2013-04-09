var upgrade = require("../converter");
var fs = require("fs");

var FILE = "../neuron/warn-log";

module.exports = function(node){
	var date = new Date();
	var text = fs.readFileSync(FILE).toString() || "";
	console.log(date+"出现了无法确定替换的因素在第"+node.start.line+"行");
	var text = fs.readFileSync(FILE).toString();
	var output = fs.openSync(FILE, "w+");
	text = text +"\r\n**************\r\n出现了无法确定替换的因素在第"+node.start.line+"行"+ "\r\n代码段---\r\n"+upgrade.printCode(node)+"\r\n**************\r\n\r";
	
	fs.writeSync(output,text);
}
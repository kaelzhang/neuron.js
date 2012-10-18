/**
 * module  xml
 */


var 

NODE_PARSER = NR.S,
HOST = NR.__HOST;


/**
 * parse a xml string into XML Object(DOM Document)
 * from jQuery
 
 * @param {string} data xml string
 */
function parseXML(data){
	var xml, docElement;

	// Standard
	if(HOST.DOMParser){
		xml = (new DOMParser).parseFromString( data , "text/xml" );
	
	// IE
	}else{
		xml = new ActiveXObject( "Microsoft.XMLDOM" );
		xml.async = "false";
		
		xml.loadXML( data );
	}

	docElement = xml.documentElement;

	if (!docElement || !docElement.nodeName || docElement.nodeName === "parsererror" ) {
		NR.error( "Invalid XML: " + data );
	}

	return xml;
};


/**
 * 
 */
function makeXML(xml){
	return NR.isString(xml) ? parseXML(xml) : xml;
};

// parse a xml string
exports.parse = parseXML;
	
// find the first element matches the expression
exports.find = function(selector, context, first){
	return NODE_PARSER.find(selector, makeXML(context), first);
};


/**
 change log:
 
 2012-10-18  Kael:
 - NOT migrated to neuron 2.0 yet!
 
 */
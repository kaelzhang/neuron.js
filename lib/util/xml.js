/**
 * module  xml
 */
NR.define(function(K){

var NODE_PARSER = K.S,
	HOST = K.__HOST;


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
		K.error( "Invalid XML: " + data );
	}

	return xml;
};


/**
 * 
 */
function makeXML(xml){
	return K.isString(xml) ? parseXML(xml) : xml;
};


return {
	// parse a xml string
	parse: parseXML,
	
	// find the first element matches the expression
	find: function(selector, context, first){
		return NODE_PARSER.find(selector, makeXML(context), first);
	}
};


});
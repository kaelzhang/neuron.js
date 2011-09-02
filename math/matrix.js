
KM.define([], function(){

// create a zero matrix
function createZeroArray(m, n){
	n = n || 1;

	var matrix = [], ZERO = 0, length = m * n;
	
	matrix['height'] = n;
	
	while(length --){
		matrix.push(ZERO);
	}
	
	return matrix;
};


// create an identity matrix
function identityMatrix(m){
	var matrix = createZeroArray(m, m),
		pointer = 0, 
		ONE = 1, 
		length = m * m - ONE;
		
	++ m;
	
	do{
		matrix[pointer] = ONE;
		pointer += m;
	}while(m < length);
	
	return matrix;
};



return {
	identity	: identityMatrix,
	zero		: createZeroArray
};


});
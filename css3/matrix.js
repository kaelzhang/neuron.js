KM.define(['math/matrix'], function(K, require){

function GET_3D_2D_ANOTHER(type){
	return type === TYPE_3D ? TYPE_2D : TYPE_3D;
};



var MM = require('math/matrix'),

TYPE_3D = '3D',
	
TYPE_2D = '2D',
	
Matrix,

/**
  0   1   2   3       0   1
  4   5   6   7  =>   4   5
  8   9  10  11      
 12  13  14  15      12  13
 */
MATRIX_SWAP_POSITION = [
	0,  1, 
	4,  5, 
	12, 13
],
	
matrix_transform_to = {
	'3D': function(matrix){
		var ret = MM.zero(4, 4);
		
		ret[15] = 1;
		
		matrix.forEach(function(element, index){
			ret[MATRIX_SWAP_POSITION[index]] = element;
		});
		
		return ret;
	},
	
	'2D': function(matrix){
		var ret = [];
		
		MATRIX_SWAP_POSITION.forEach(function(element){
			ret.push(matrix[element]);
		});
		
		ret['height'] = 3;
		
		return ret;
	}
};

Matrix = new Class({
	initialize: function(matrix){
		matrix = K.makeArray(matrix);
		
		var di, self = this, saved;
		
		if(matrix.length === 6){
			di = TYPE_2D;
		}else if(matrix.length === 16){
			di = TYPE_3D;
		}else{
			throw new Error('the matrix must be 2x3 or 4x4');
		}
		
		saved = {};
		saved[di] = matrix;
		self._matrix = saved;
		self._di = di;
	},
	
	to3D: function(){
		return this._to(TYPE_3D);
	},
	
	to2D: function(){
		return this._to(TYPE_2D);
	},
	
	_to: function(type){
		var self = this,
			matrix = self._matrix[type],
			another;
		
		return matrix ? matrix : (
			another = GET_3D_2D_ANOTHER(type), 
			self._matrix[type] = matrix_transform_to[type](self._matrix[another]) 
		);
	},
	
	translate: function(){
	},
	
	rotate: function(){
	},
	
	skew: function(){
	},
	
	scale: function(){
	}
});

return Matrix;

});
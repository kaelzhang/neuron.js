KM.define(['dom/dimension'], function(K, require){


var dimension = require('dom/dimension');

TOP = 'top', LEFT = 'left',

/**
 * 
 */
PRESETS_POSITION_EXTRA_OFFSETS = {
	't': {
		as		: TOP,
		getter  : function(){ return 0; }
	},
	
	'r': {
		as		: LEFT,
		getter	: function(node, coor_direction){
			return + dimension.size(node).width;
		}
	},
	
	'b': {
		as		: TOP,
		getter	: function(node, coor_direction){
			return + dimension.size(node).height;
		} 
	},
	
	'l': {
		as 		: LEFT,
		getter  : function(){ return 0; }
	},
	
	'c': {
		getter	: function(node, coor_direction){
			return dimension.size(node)[ OFFSET_MAP_2_SIZE[ coor_direction ] ];
		}
	}
},

// @enum
OFFSET_MAP_2_SIZE = {
	left	: 'width',
	top 	: 'height'
};


/**
 * parse the position string to an object which contains getter methods for left and top directions
 * @return {Object}
 */
function parsePositions(pos){
	var p1 = PRESETS_POSITION_EXTRA_OFFSETS[ pos.substr(0, 1) ],
		p2 = PRESETS_POSITION_EXTRA_OFFSETS[ pos.substr(1, 1) ],
		left, right, undef;
		
	function top_left(){
		top = p1;
		left = p2;
	};
	
	function left_top(){
		left = p1;
		top = p2;
	};
		 
	if( // undefined preset
		!p1 || !p2 || 
		
		// duplicate coordinates of presets: 
		p1.as && p1.as === p2.as
	){
		throw {
			toString: function(){
				return 'invalid position';
			}
		};
	}
	
	if(p1.as === TOP){
		top_left();
	}else if(p1.as === LEFT || !p1.as && !p2.as){
		left_top();
	}
		
	return {
		top		: top.getter,
		left	: left.getter
	}
};


/**
 * calculate the real position
 */
function calculatePositions(node, target, node_pos, target_pos){
	var di = dimension,
		base_offset 	= di.offset(target),
		node_extra 		= parsePositions(node_pos),
		target_extra 	= parsePositions(target_pos);

	return {
		top	: base_offset + target_extra.top(target, TOP)  - node_extra.top(node, TOP),
		left: base_offset + target_extra.left(target, LEFT) - node_extra.left(node, LEFT)
	};
};


function setPosition(node, offsets){
	var di = dimension,
		parent = di.offsetParent(node),
		parent_offsets = di.offset(parent);
		
	node.setStyle({
		top: offsets.top - parent_offsets.top,
		left: offsets.left - parent_offsets.left
	});
};


function Position(node){
	this._node = node;
};


// static presets
K.mix(Position, {
	'TL': 'tl',
	'TC': 'tc',
	'TR': 'tr',
	'RC': 'rc',
	'BR': 'br',
	'BC': 'bc',
	'BL': 'bl',
	'LC': 'lc',
	'CC': 'cc'
});


Position.prototype = {
	// .align(target, ['bl', 'tl'])
	align: function(target, alignPos, isFix){
		var node = this._node,
			node_pos = parsePosition(alignPos[0]),
			target_pos = parsePosition(alignPos[1]);
		
		setPosition(node, calculatePositions(node, target, node_pos, target_pos) );	
	},
	
	fix: function(x, y, z){
		var node = this._node;
	
		setPosition(node, {
			left: x,
			top: y
		});
		
		if(z){
			node.setStyle('zIndex', z);
		}
	}
	
	to: function(x, y, z){
	}
};


return Position;

});
KM.define( ['dom/dimension'], function(K, require){


var dimension = require('dom/dimension');

TOP = 'top', LEFT = 'left', NOOP = function(){},

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
			return dimension.size(node).width;
		}
	},
	
	'b': {
		as		: TOP,
		getter	: function(node, coor_direction){
			return dimension.size(node).height;
		} 
	},
	
	'l': {
		as 		: LEFT,
		getter  : function(){ return 0; }
	},
	
	'c': {
		getter	: function(node, coor_direction){
			return dimension.size(node)[ OFFSET_MAP_2_SIZE[ coor_direction ] ] / 2;
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
		left, top, undef;
		
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
		top	: base_offset.top + target_extra.top(target, TOP)  - node_extra.top(node, TOP),
		left: base_offset.left + target_extra.left(target, LEFT) - node_extra.left(node, LEFT)
	};
};


/**
 * @param {Element} node
 * @param {Object} offsets
 * @param {Object} adjust
 */
function setPosition(node, offsets, adjust){
	adjust = adjust || {};
	var di = dimension,
		parent = di.offsetParent(node),
		parent_offsets = di.offset(parent);
		
	node.setStyles({
		top: offsets.top - parent_offsets.top + (adjust.top || 0),
		left: offsets.left - parent_offsets.left + (adjust.left || 0)
	});
};

/*
function isDocument(node){
	var tagName = node.tagName || '';
	
	return node === document || /^(?:html|body)$/.test(tagName.toLowerCase());
};
*/

// @public
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
	
	/**
	 * @param {Element} target target element to be aligned to
	 * @param {Array.<string>} alignPos [element_alignPos, target_alignPos]
	 * @param {Object=} adjust {
	 		top: {number} adjust of y coordinate
	 		left: {number} adjust of x coordinate
	 	}
	 * @param {boolean=} isFix TODO
	 
	 * usage:
	 <code>
	 	// esp for old popuppanel-alike Overlay instances
	 	// the top-left corner of the element will be aligned to the bottom-left corner of container
	 	instance.align(container, ['BL', 'TL'], {top: -1, left: 10});
	 
	 </code>
	 */
	align: function(target, pos, adjust, isFix){
		var self = this,
			node = self._node;
		
		self._target = target;
		self._pos = pos;
		
		if(K.isBoolean(adjust)){	// align(target, ['cc', 'cc'], true)
			isFix = adjust;
			adjust = {};
		}
		
		self._adjust = K.isPlainObject(adjust) ? adjust : {};
		self._isFix = !!isFix;
		
		self._align();
		self._bindFix();
	},
	
	_bindFix: function(){
		var self = this;
	
		if(self._isFix // && isDocument(self._target)
		){
			if(!self._alignFix){
				window.addEvent('resize', function(){
					self._alignFix();
				});
			}
		
			self._alignFix = self._align;
					
		}else if(self._alignFix){
			self._alignFix = NOOP;
		}
	},
	
	_align: function(){
		var self = this;
		
		setPosition(self._node, calculatePositions(self._node, self._target, self._pos[0], self._pos[1]), self._adjust, self._fixed);
	},
	
	// TODO
	fix: function(x, y, isFix){
		
	},
	
	// TODO
	to: function(x, y, z, isFix){
		/*
var node = this._node;
	
		setPosition(node, {
			left: x,
			top: y
		});
		
		if(z){
			node.setStyle('zIndex', z);
		}
*/
	}
};


return Position;

});
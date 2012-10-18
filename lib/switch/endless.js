/**
 * Switch Plugin: endless
 */

function returnFalse(){
	return false;
};


/**
 * generate a circlewize result of numbers by the range(length) and passed value(value)
 * offset relative to initial pos -> index relative to items
 * circlewizeInt is much more usefull than operator '%' when dealing negative numbers
 
 * suppose:
 * 		length: 3
 
 * cases:
 * 		values:		-4	-3	-2	-1	0	1	2	3	4	5
 * 		returns:	 2	 0	 1	 2	0	1	2	0	1	2
 
 * @param {number} (int)value
 * @param {number} (int)length
 */
function circlewizeInt(value, length){
	return value - Math.floor(value / length) * length;
};


function realInit(self, EVENTS){

	var move = self.get('move'),
		stage = self.get('stage'),
		direction = self.get('direction'),
		offset_direction = self.offsetDirection;
	
	/**
	 * deal with the situation data
	 
	/////////////////////////////////////////////////////////////////////////////
	
	 		  |    curOffset     |               
	                 | leftItems | stage |    rightItems     |
	 
	 stage:                      ---------
	 train:          -----------------------------------------
	 initial: |
	 
	 /////////////////////////////////////////////////////////////////////////////
	 
	 after the initialization, the order of the items might be changed
	
	 */
	 
	// @type {number} this.leftItems items aside on the left of the 'stage'
	self.leftItems = 
	
	// @type {number} this.curOffset real offset relative to the initial position of the 'container'
	self.curOffset = self.activeIndex;
	
	// @type {number} this.leftItems items aside on the right of the stage
	self.rightItems = self.length - stage - self.leftItems;
	
	// override methods
	NR.mix(self, METHODS_OVERRIDEN);
	
	self.on(EVENTS.NEXT, function(){
		var self = this,
			move_needed = move - self.rightItems;
		
		move_needed > 0 && self._moveItems(move_needed);
		self._dealOffset(move);
	});
	
	self.on(EVENTS.PREV, function(){
		var self = this,
			move_needed = move - self.leftItems;
		
		move_needed > 0 && self._moveItems(- move_needed);
		self._dealOffset(- move);
	});
};


var

METHODS_OVERRIDEN = {

	noprev: false,
	nonext: false,
	
	/**
	 * @override
	 * limit the range of this.activeIndex
	 */
	_limit: function(index){
		return circlewizeInt(index, this.length);
	},

	/**
	 * @override
	 * if plugin::endless attached,
	 * there will be no left end or right end
	 */
	_isNoprev: returnFalse,
	_isNonext: returnFalse,
	
	/**
	 * method to move items
	 * @private
	 * @param {number} amount
	 		if amount > 0, move <amount> items from the left to the right
	 		if amount < 0, move <amount> items from the right to the left
	 */
	_moveItems: function(amount){
		var self = this,
			where,
			stage = self.get('stage'),
			direction = self.get('direction'),
			space = self.get('itemSpace'),
			length = self.length,
			offset = self.curOffset,
			lastOffset = offset + stage + self.rightItems - 1,
			start,
			step,
			check,
			
			// relative offset for the value of start
			relative;
		
		if(amount > 0){
			start = 1;
			step = 1;
			check = function(){
				return start <= amount;
			};
			relative = lastOffset;
		}else{
			start = 0;
			step = -1;
			check = function(){
				return start > amount;
			};
			relative = offset - self.leftItems - 1;
		}
		
		for(; check(); start += step){
		
			// when moving items,
			// we don't change any data relevant to position
			self._getItem( circlewizeInt(lastOffset + start, length), true).css(direction, (relative + start) * space);
		}
		
		// change position data at the end
		self.leftItems -= amount;
		self.rightItems += amount;
	},
	
	/**
	 * @param {number} move
	 */
	_dealOffset: function(move){
		var self = this;
		self.curOffset += move;
		self.rightItems -= move;
		self.leftItems += move;
		
		return self;
	},
	
	/**
	 * @override
	 * method to get the real offset relative to the container
	 * after plugin::endless attached, the index of items and the offset to the initial pos might be different
	 * 
	 * @param {number} index
	 */
	_getOffset: function(index){
		var self = this,
			stage = self.get('stage'),
			
			// the changing of this.curOffset is always ahead of this.activeIndex
			// so we use this.expectIndex to be compared with
			expect = self.expectIndex,
			delta = index - expect,
			max_right,
			max_left; 
			
		if(delta !== 0){
			max_right = stage + self.rightItems - 1;
			max_left = - self.leftItems;
			
			if(delta > 0 && delta > max_right){
				delta += max_left - max_right;
				
			}else if(delta < 0 && delta < max_left){
				delta += max_right - max_left;
			}
			
		}
		
		return self.curOffset + delta;
	}
};


module.exports = {
	name: 'endless',
	
	ATTRS: {
		itemSpace: null
	},
	
	init: function(self){
		var EVENTS = self.get('EVENTS');
		
		self.on(EVENTS.AFTER_INIT, function(){
			var t = self;
			
			/**
			 if it doesn't meet the condition, there would be blanks 
			 	when moving the items during switching. Thus, 
			 	plugin::endless will dothing, and the Switcher
			 	will fallback to normal carousel
			 */
			if(t.length >= t.get('stage') + t.get('move')){
				realInit(t, EVENTS);
			}
		});
	}	
};


/**
 change log:
 
 2012-04-18  Kael:
 TODO:
 A. new _moveItems method to deal with nonlinear switching.
 
 2011-11-02  Kael:
 - add ._getOffset method to get the real offset relative to the container
 - refractor, so it could work well with plugin::step
 
 2011-10-30  Kael:
 [issue]: blanks may occur during switching
 


 */
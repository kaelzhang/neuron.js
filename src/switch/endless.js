/**
 * Switch Plugin: endless
 */
KM.define(function(K, require){


function returnFalse(){
	return false;
};


/**
 * generate a circlewize result of numbers by the range(length) and passed value(value)
 * suppose:
  
 * length: 3
 * values:	-4	-3	-2	-1	0	1	2	3	4
 * returns:	2	0	1	2	0	1	2	0	1	2
 
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
	
	// get pixel spaces between items
	self.itemSpace = self.get('itemSpace') || self._getItem(1).el(0)[offset_direction] - self._getItem(0).el(0)[offset_direction];
	
	// deal with the situation activePage is not zero
	self.leftItems = self.curOffset = self.activeIndex = self.activePage * move;
	self.rightItems = self.length - stage - self.leftItems;

	// if it's an endless carousel, there must be no 'triggers'
	// self.triggers.forEach(function(trigger){
	//		trigger.destroy();
	// });
	
	K.mix(self, METHODS_OVERRIDEN);
	
	self.on(EVENTS.NEXT, function(){
		var self = this;
		
		if(self.leftItems >= move){
			self._moveItems(move);
		}
		self._dealOffset(move);
	});
	
	self.on(EVENTS.PREV, function(){
		var self = this;
		
		if(self.rightItems >= move){
			self._moveItems(- move);
		}
		self._dealOffset(- move);
	});
};


var

METHODS_OVERRIDEN = {

	noprev: false,
	nonext: false,
	
	/**
	 * limit the range of this.activePage
	 */
	_limit: function(index){
		return circlewizeInt(index, this.pages);
	},

	/**
	 * if plugin:endless attached,
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
			length = self.length,
			offset = self.curOffset,
			lastOffset = offset + stage + self.rightItems - 1,
			start,
			step,
			check,
			
			// relative offset of 
			relative,
			space = self.itemSpace;
		
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
			relative = offset - self.leftItems;
		}
		
		for(; check(); start += step){
			self._getItem(circlewizeInt(lastOffset + start, length)).css(direction, (relative + start) * space);
		}
		
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
	}
};


return {
	name: 'endless',
	
	options: {
		itemSpace: null
	},
	
	init: function(self){
		var EVENTS = self.get('EVENTS');
		
		self.on(EVENTS.AFTER_INIT, function(){
			var t = self;
			
			/**
			 if it doesn't meet the condition, there would be blanks 
			 	when moving the items during switching. Thus, the Switcher
			 	will fallback to normal carousel
			 */
			if(t.items.length >= t.get('stage') + t.get('move')){
				realInit(t, EVENTS);
			}
		});
	}	
};
	
});

/**
 change log:
 
 2011-10-30  Kael:
 [issue]: blanks may occur during switching
 


 */
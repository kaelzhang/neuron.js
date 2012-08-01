/**
 * temporarily remove unnecessary items away from the container 
 */

NR.define([], function(K, require, exports){
	
	
var

METHODS_OVERRIDDEN = {
	_cleanItems: function(){
		var self = this,
			activeIndex       = self.activeIndex,
			rightIndexOfStage = activeIndex + self.get('stage') - 1,
			
			testDistance      = Cleaner.TEST_DISTANCE * self.get('move'),
			
/**
 Abbr:
    t: testDistance, 
    a: activeIndex, b: rightIndexOfStage
    l: leftTestIndex, L: cleanLeft, r: rightTestIndex, R: cleanRight,
    rl: removeLeft, rr: removeRight
 Suppose:
    plugin: 'endless'
    length: 100
    
 ////////////////////////////////////////////////////////////////////////////////////////
 
                              |   t   | stage |   t   |
                                      _________
                                      a       b 
                 |     rl     |                       |   rr   |
                 _______________________________________________
                 L            l                       r        R
                          |
 calculate       -9       0   4
 this._limit     91       0   4  // so before we calculate removeLeft, never use this._limit,
                                 // preventing logic error during calculating circlewize index
 
 ////////////////////////////////////////////////////////////////////////////////////////
 
 */
			rightTestIndex    = rightIndexOfStage + testDistance,
			leftTestIndex     = activeIndex - testDistance,
			
			removeLeft        = leftTestIndex - self.cleanLeft,
			removeRight       = self.cleanRight - rightTestIndex;
			
        if(removeLeft > 0){
            self._removeItems(self.cleanLeft - 1, removeLeft);
        }

        if(removeRight > 0){
            self._removeItems(rightTestIndex, removeRight);
        }
        
        self.cleanLeft = self._limit(leftTestIndex);
        self.cleanRight = self._limit(rightTestIndex);
	},
	
	
	/**
	 * @param {number} start
	 * @param {number} amount always positive
	 * @param {boolean} toAdd
	 */
	_removeItems: function(start, amount){
	   var self = this, item, index;
	   
		while(amount){
		    // use 
            index = self._limit(start + amount);
            item = self._getItem(index, true);
            
            if(item){
                item.dispose();
            }
            
            -- amount;
		}
	}
},


Cleaner = {
	name: 'cleaner',
	
	TEST_DISTANCE: 1,

	ATTRS: {
		// times of move
		// - auto manage removing infomation
		
		// potentialMove: 1		
	},
	
	init: function(self){
		var EVENTS = self.get('EVENTS');
		
		self.on(EVENTS.AFTER_INIT, function(){
            var self = this,
                activeIndex = self.activeIndex;
		
			K.mix(self, METHODS_OVERRIDDEN);
			
			self.cleanLeft = activeIndex;
			self.cleanRight = activeIndex + self.get('stage') - 1;
		});
		
		// self.on(EVENTS.COMPLETE_SWITCH, self._cleanItems);
		self.on(EVENTS.COMPLETE_SWITCH, function(){
		    self._cleanItems();
		});
	}
};


return Cleaner;


});




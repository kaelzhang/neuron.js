/**
 * Switch Plugin: Carousel Effect
 * author  Kael Zhang
 */

NR.define(['fx/tween', 'fx/easing'], function(K, require){
    
    
// check the stage, and remove the extra triggers
// @method checkStage
// @param t {Object} DP.Switch instance
function checkStage(self){
	if(self.triggers){
	    var triggerlength = self.triggers.length,                        
	        i,
	        ghostItem = K.DOM.create('div').inject(self.container);
	                        
	    // if triggers are more than pages，removing redundant ones
	    for(i = self.pages; i < triggerlength; ++ i){
	        self.triggers[i].destroy();
	    }
	    
	    // in order to calculate positions and offsets precisely, set container as offsetParent of the switching items
	    // never use this._getItem() method before real switching
	    if(ghostItem.get(0).offsetParent !== self.container.get(0)){
	        self.container.css('position', 'relative');
	    }
	    
	    ghostItem.destroy();
    }                        
};


function capitalize(str){
	return str.replace(/^[a-z]/i, function(match){
		return match.toUpperCase();
	});
};


var Tween = require('fx/tween'),
	Easing = require('fx/easing');


return {
    name: 'carousel',
    
    ATTRS: {
        fx: {
            value: {
            	link: 'cancel',
	            transition: Easing.Cubic.easeOut,
	            duration: 300
	        },
	        
	        setter: function(v){
                return K.mix(this.get('fx'), v);
	        }
        },

        // only support 'left' || 'top'
        direction: {
        	value: 'left'
        }
    },

    init: function(self){
        var EVENTS = self.get('EVENTS'),
        	direction,
        	offset_direction;

        self.on(EVENTS.AFTER_INIT, function(){
            checkStage(this);

            var t = this,
                active = t.activeIndex,
                fx = t.get('fx'),
                container = t.container;
                
            direction = t.get('direction');
            
            self.offsetDirection = offset_direction = 'offset' + capitalize(direction);
                
            if(!fx.property){
	            fx.property = direction;
	        };
	        
            t.effect = new Tween(container, fx).on('complete', function(){
	            t.fire(EVENTS.COMPLETE_SWITCH);
	        });

            // there's a bug about MooTools Fx: the container's position must be specified before you use Fx,
            // or the first Fx will have no animation
            
            // if container's position is not explicitly assigned, set it to 0
            !parseInt(container.css(direction)) && container.css(direction, 0);
            t._dealNavs();
        });

        self.on(EVENTS.BEFORE_SWITCH, function(){
            this._dealTriggerCls(true);
        });

        self.on(EVENTS.ON_SWITCH, function(){
            var t = this,
                active = t.activeIndex = t.expectIndex,
                activeItem = t._getItem(active);

            t._dealNavs();
			
			// start animation
            activeItem && t.effect.start( - activeItem.get(0)[offset_direction] );

            t._dealTriggerCls(false, active);
        });

    }
};

});

/**
 change log
 ==========
 
 2012-04-25  Kael:
 - fix the callback of AFTER_INIT event and checkStage method which might cause the premature construction of items. 
    NEVER use this._getItem method before the first switch 
 
 
 */
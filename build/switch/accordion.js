/**
 * Switch Plugin: Accordion Effect
 * author  Kael Zhang
 */
 
KM.define(['fx/tween', 'fx/easing'], function(K, require){

var Tween = require('fx/tween'),
	Easing = require('fx/easing'),
	
    EVENT_ON_ITEM_ACTIVE = 'itemActive',
    EVENT_ON_ITEM_DEACTIVE = 'itemDeactive',
    
    NULL = null;

return {
	name: 'accordion',
	
	ATTRS: {
        fx: {
        	value: {
	            link: 'cancel',
	            transition: Easing.Cubic.easeOut,
	            duration:200
	        }
        },
        
        property: {
        	value: 'height'
        },
        
        activeValue: NULL,
        normalValue: NULL
    },
    
    init: function(self){
    
    	// get the fx of the items, 
    	// create new fx if not exists
    	function getFx(element, offset){
    		var effect = element.data(EFFECT_KEY);
    		
    		if(!effect){
    			effect = new Tween(element, fx).on('complete', function(){
    				var cb = on_complete[offset];
    				cb && cb();
    			});
    			
    			element.data(EFFECT_KEY, effect);
    		}
    		
    		return effect;
    	};
    	
    	function setFxCallback(active, expect){
    		delete on_complete[active];
    		delete on_complete[expect];
    		
    		var t = self;
    	
    		on_complete[active] = function(){
    			t._getItem(active).removeClass(active_cls);
    			t.fire(EVENT_ON_ITEM_DEACTIVE, [active]);
    		};
    		
    		on_complete[expect] = function(){
    			t._getItem(expect).addClass(active_cls);
    			t.fire(EVENT_ON_ITEM_ACTIVE, [expect]);
    			t.fire(EVENTS.COMPLETE_SWITCH);
    		};
    	};
    	
    	function chk(o){
    		return o || o === 0;
    	};
    	
    	var EFFECT_KEY = '_s_accordion',
    		EVENTS = self.get('EVENTS'),
    		on_complete = [],
    		fx,
    		active_cls,
    		active_value,
    		normal_value;
    		

        self.on(EVENTS.AFTER_INIT, function(){
            var t = self,
                active = t.activeIndex,
                property,
                _active_value = t.get('activeValue'),
                _normal_value = t.get('normalValue');

            fx = t.get('fx');
            active_cls = t.get('itemOnCls');
                                
            if(!fx.property){
	            fx.property = t.get('property');
	        };
	        
	        property = fx.property;
	        
	       	// if active_value and normal_value is not specified
	       	// fetch them by the computed styles of the origin items
	        active_value = chk(_active_value) ? _active_value : t._getItem(active).css(property);
	        normal_value = chk(_normal_value) ? _normal_value : t._getItem( t._limit(active + 1) ).css(property);
        });
        
        self.on(EVENTS.BEFORE_SWITCH, function(){
            this._dealTriggerCls(true);
        });

        self.on(EVENTS.ON_SWITCH, function(){
            var t = this,
                active = t.activeIndex,
                expect = t.expectIndex;
                
            setFxCallback(active, expect);
            getFx(t._getItem(active), active).start(normal_value);
            getFx(t._getItem(expect), expect).start(active_value);
            
            
/**
 a: active,  e: expect,  n: normal, normalSize: 0, activeValue: 3;  'e' will be activated
 ////////////////////////////////////////////////////////////////////////////////////////////
 
       | 2. but, at this point                       |
       | [n] interrupt in, everything changes ===>   |
 a: \                                                |    a: \
      \    | 1. if nothing happens,                  |         \    | [a] isn't affected
        \  | it would be ended here                  |           \  |
          \                                          |             \
                                                     |
          /                                          |          | before [n] taking effect
        /                                            |          | [e] should have been the new [active]
      /                                              |         / \   
 e: /                                                |    e: /     \
                                                     |
                                                     |                 /
                                                     |               /
                                                     |             /
 n: ________                                         |    n: ____/

 ////////////////////////////////////////////////////////////////////////////////////////////
 */
 			// so, as it explained above, set expectIndex as activeIndex immediately after fx started
            t.activeIndex = expect;
            t._dealNavs();
            
            t._dealTriggerCls(false, expect);
        });
    }
}

});

/**
 2011-10-26  Kael:
 - migrate to Neuron

 TODO:
 A. html santitizer for horizontal accordion, making the content of each item stable and no deformation during switching
 
 */
 
 
 
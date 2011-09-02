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
	
	options: {
        fx: {
            link: 'cancel',
            transition: Easing.Cubic.easeOut,
            duration:200
        },
        
        property: 'height',
        
        activeValue: NULL,
        normalValue: NULL
    },
    
    init: function(self){
    	var EFFECT_KEY = '_s_accordion',
    		EVENTS = self.get('EVENTS'),
    		o = self.options,
    		fx = o.fx,
    		on_complete = [],
    		active_cls = o.itemOnCls;
    	
    	delete o.fx;
    
    	// get the fx of the items, 
    	// create new fx if not exists
    	function getFx(element, offset){
    		var effect = element.retrieve(EFFECT_KEY);
    		
    		if(!effect){
    			effect = new Tween(
    				element, 
    				K.mix({
    					onComplete: function(){
    						var cb = on_complete[offset];
    						cb && cb();
    					}
    				}, fx)
    			);
    			element.store(EFFECT_KEY, effect);
    		}	
    		
    		return effect;
    	};
    	
    	function setFxCallback(active, expect){
    		delete on_complete[active];
    		delete on_complete[expect];
    	
    		on_complete[active] = function(){
    			self.items[active].removeClass(active_cls);
    			self.fireEvent(EVENT_ON_ITEM_DEACTIVE, [active]);
    		}
    		
    		on_complete[expect] = function(){
    			self.items[expect].addClass(active_cls);
    			self.fireEvent(EVENT_ON_ITEM_ACTIVE, [expect]);
    			self.fireEvent(EVENTS.COMPLETE_SWITCH);
    		}
    	};
    	
    	function chk(a){
    		return a || a === 0;
    	};
    	
    	if(!fx.property){
            fx.property = o.property;
        };

        self.addEvent(EVENTS.AFTER_INIT, function(){
            var t = self,
                active = t.activePage;
                
          	if(!chk(o.activeValue)){
          		o.activeValue = t.items[active].getStyle(fx.property);
          	}
          	
          	if(!chk(o.normalValue)){
          		o.normalValue = t.items[(active + 1) % t.items.length].getStyle(fx.property);
          	}
        });

        self.addEvent(EVENTS.ON_SWITCH, function(){
            var t = self,
                active = t.activePage,
                expect = t.expectPage;
                
            setFxCallback(active, expect);    
            getFx(t.items[active], active).start(o.normalValue);
            getFx(t.items[expect], expect).start(o.activeValue);
            
            
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
 			// so, as it explained above, set expectPage as activePage immediately after fx started
            t.activePage = expect;
        });
    }
}

});

/**
 TODO:
 A. html santitizer for horizontal accordion, making the content of each item stable and no deformation during switching
 
 */
 
 
 
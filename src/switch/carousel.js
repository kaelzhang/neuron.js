/**
 * Switch Plugin: Carousel Effect
 * author  Kael Zhang
 */

KM.define(['fx/tween', 'fx/easing'], function(K, require){
    
    
// check the stage, and remove the extra triggers
// @method checkStage
// @param t {Object} DP.Switch instance
function checkStage(_t){
	if(_t.triggers){
	    var triggerlength = _t.triggers.length,                        
	        i;
	                        
	    // 若trigger数比翻页数更多，则移除多余的trigger，这是为了避免后端输出错误，对js造成影响
	    for(i = _t.pages; i < triggerlength; ++ i){
	        _t.triggers[i].destroy();
	    }
	
	    // 设置container为offsetParent，从而正确的定位和获得偏移量
	    if(_t._getItem(0).el(0).offsetParent !== _t.container.el(0)){
	        _t.container.css('position', 'relative');
	    }   
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
            checkStage(self);

            var t = self,
                active = t.activePage,
                fx = t.get('fx');
                
            direction = t.get('direction');
            
            self.offsetDirection = offset_direction = 'offset' + capitalize(direction);
                
            if(!fx.property){
	            fx.property = direction;
	        };
	        
            t.effect = new Tween(t.container, fx).on('complete', function(){
	            t.fire(EVENTS.COMPLETE_SWITCH);
	        });

            // there's a bug about moo tools Fx: the container's position must be specified before you use Fx,
            // or the first Fx will have no animation
            t.container.css(direction, - t._getItem(active * t.get('move')).el(0)[offset_direction] );
            t._dealNavs();
        });

        self.on(EVENTS.BEFORE_SWITCH, function(){
            this._dealTriggerCls(true);
        });

        self.on(EVENTS.ON_SWITCH, function(){
            var t = this,
                active = t.activePage = t.expectPage;

            t._dealNavs();
			
			// start animation
            t.effect.start( - ( t._getItem(active * t.get('move')) ).el(0)[offset_direction] );

            t._dealTriggerCls(false, active);
        });

    }
};

});
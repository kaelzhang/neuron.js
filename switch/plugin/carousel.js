/**
 * Switch Plugin: Carousel Effect
 * author  Kael Zhang
 */

KM.define(['fx/tween', 'fx/easing'], function(K, require){

var Tween = require('fx/tween'),
	Easing = require('fx/easing');
    
    
// 检查舞台，删除多余的trigger
// @method checkStage
// @param t {Object} DP.Switch instance
function checkStage(_t){
    var triggerlength = _t.triggers.length,                            
        i;
                        
    // 若trigger数比翻页数更多，则移除多余的trigger，这是为了避免后端输出错误，对js造成影响
    for(i = _t.pages; i < triggerlength; ++ i){
        _t.triggers[i].dispose();
    }

    // 设置container为offsetParent，从而正确的定位和获得偏移量
    if(_t.items[0].offsetParent !== _t.container){
        _t.container.setStyle('position', 'relative');
    }                           
};

return {
    name: 'carousel',
    options: {
        fx: {
            link: 'cancel',
            transition: Easing.Cubic.easeOut,
            duration:300
        },

        // only support 'left' || 'top'
        direction: 'left'
    },

    init: function(self){
        var o = self.options,
            fx = o.fx,
            _offset_direction = 'offset' + o.direction.capitalize(),
            EVENTS = self.get('EVENTS');

        function currentTriggerClass(remove, index){
            var t = self,
                currentTrigger = t.triggers[index || t.activePage];
                
            currentTrigger && (remove ? 
            	currentTrigger.removeClass(t.options.triggerOnCls) : 
            	currentTrigger.addClass(t.options.triggerOnCls)
            );
        };  

        if(!fx.property){
            fx.property = o.direction;
        };

        fx.onComplete = function(){
            self.fireEvent(EVENTS.COMPLETE_SWITCH);
        };

        self.addEvent(EVENTS.BEFORE_INIT, function(){
            self.effect = new Tween(self.container, fx);
            delete self.options.fx;
        });

        self.addEvent(EVENTS.AFTER_INIT, function(){
            checkStage(self);

            var t = self,
                active = t.activePage;

            // there's a bug about moo tools Fx: the container's position must be specified before you use Fx,
            // or the first Fx will have no animation
            t.container.setStyle(o.direction, - t.items[active * t.options.move][_offset_direction] );
            t._dealNavs();
        });

        self.addEvent(EVENTS.BEFORE_SWITCH, function(){
            currentTriggerClass(true);
        });

        self.addEvent(EVENTS.ON_SWITCH, function(){
            var t = self,
                active = t.activePage = t.expectPage;

            t._dealNavs();

            t.effect.start( - ( t.items[active * t.options.move] )[_offset_direction] );

            currentTriggerClass(false, active);
        });

    }
};

});
/**
 * switch plugin: carousel
 */

KM.define(function(){
	return {
        name: 'carousel',
        options: {
            fx: {
                link: 'cancel',
                transition: Fx.Transitions.Cubic.easeOut,
                duration:300
            },

            // only support 'left' || 'top'
            direction: 'left'
        },

        init: function(_this){
            var o = _this.options,
                fx = o.fx,
                _offset_direction = 'offset' + o.direction.capitalize();

            function currentTriggerClass(remove, index){
                var _t = _this,
                    currentTrigger = _t.triggers[index || _t.activeIndex];
                currentTrigger && (remove ? currentTrigger.removeClass(_t.options.triggerOnClass) : currentTrigger.addClass(_t.options.triggerOnClass) );
            };  

            if(!fx.property){
                fx.property = o.direction;
            };

            fx.onComplete = function(){
                _this.fireEvent(EVENT_FX_COMPLETE);
            };

            _this.addEvent(EVENT_BEFORE_INIT, function(){
                _this.effect = new Fx.Tween(_this.container, fx);
                delete _this.options.fx;
            });

            _this.addEvent(EVENT_AFTER_INIT, function(){
                checkStage(_this);

                var _t = _this,
                    active = _t.activeIndex;

                // there's a bug about moo tools Fx: the container's position must be specified before you use Fx,
                // or the first Fx will have no animation
                _t.container.setStyle(o.direction, - _t.items[active * _t.options.move][_offset_direction] );
                _t._dealBtn();
            });

            _this.addEvent(EVENT_BEFORE_SWITCH, function(){
                currentTriggerClass(true);
            });

            _this.addEvent(EVENT_ON_SWITCH, function(){
                var _t = _this,
                    active = _t.activeIndex;

                _t._dealBtn();

                _t.effect.start( - ( _t.items[active * _t.options.move] )[_offset_direction] );

                currentTriggerClass(false, active);
            });

        }
    }
});
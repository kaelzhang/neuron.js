KM.define({
    name: 'autoPlay',
    options: {
        autoPlay: true,
        interval: 5000,
        hoverStop: true
    },

    init: function(_this){
        function autoplay(){
            var t = _this;
            if(!t.triggerOn && !t.paused){
                t.switchTo( (t.activeIndex + 1) % t.length );
            }
        };

        var o = _this.options,
            autoPlayTimer = D.delay(autoplay, o.interval);

        _this.addEvent(EVENT_AFTER_INIT, function(){
            var t = _this;

            t.container.addEvents({
                mouseenter: function(){
                    t.paused = true;
                },

                mouseleave: function(){
                    t.paused = false;
                    autoPlayTimer.start();
                }
            });

            autoPlayTimer.start();
        });

        // 
        _this.addEvent(EVENT_BEFORE_SWITCH, function(){
            autoPlayTimer.cancel();
        });
            
        _this.addEvent(EVENT_FX_COMPLETE, function(){
            autoPlayTimer.start();
        });
    }
});
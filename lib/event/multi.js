NR.define(function () {

    var multiEvent = function (fn, time, opt) {
        var _this = this;
        this.fn = fn;
        this.time = time;
        this.go = true;

        opt = opt || {};
        opt.condition = opt.condition || function () { return true; };
        opt.onConditionFail = opt.onConditionFail || function () { };

        this._triggerEvent = function (e) {
            var elem = this,
				type = e.type;

            e.preventDefault();
            function funcwrap() {
                return _this.fn.call(elem, e);
            }

            if (!opt.condition(e)) {
                opt.onConditionFail(e);
            } else {
                clearTimeout(_this.timer);

                _this.timer = setTimeout(function () {
                    if (_this._canGo()) {
                        funcwrap.call(elem);
                    }
                }, _this.time);
            }

        };

        this._stopperEvent = function (e) {
            clearTimeout(_this.timer);
        };

    };

    multiEvent.prototype = {

        addTrigger: function (elems, type) {
            elems.on(type, this._triggerEvent);
        },

        addStopper: function (elems, type) {
            elems.on(type, this._stopperEvent);
        },

        removeTrigger: function (elems, type) {
            elems.off(type, this._triggerEvent);
        },

        removeStopper: function (elems, type) {
            elems.off(type, this._stopperEvent)
        },

        pause: function () {
            this.go = false;
        },

        resume: function () {
            this.go = true;
        },

        _canGo: function () {
            return this.go;
        }
    }

    return multiEvent;

});


/**
kael:
1. plz avoid adding static data on element directly
2. issue: 
- there will be too many addstarter::triggerEvent method. try to combine them into one
- the behavior of funcwrap changed the return value of param functions
- this.triggerEvent is changing which is unexpected
*/

/* use case:

var m1 = new multi(function(){console.log('from m1:',this);},200);				
m1.addTrigger($$('.m1.box'),'mouseenter');
m1.addTrigger($$('.m1.box'),'click');//觸發時會清掉上一個trigger設置的timer
m1.addStopper($$('.m1.box'),'mouseleave');
m1.removeStopper($('el2'),'mouseenter');		
				
				
var m2 = new multi(function(){console.log('from m2:',this);},200);
m2.addTrigger($$('.m2.box'),'mouseenter');
m2.addStopper($$('.m2.box'),'mouseleave');

				
$('pauseel1').addEvent('click',function(e){
m.pause($('el1'),'mouseenter');
return false;
});				
		
$('resumeel1').addEvent('click',function(e){
m.resume($('el1'),'mouseenter');
return false;
});


*/
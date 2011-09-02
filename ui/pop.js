KM.define(['dom/dimension'], function(K, require){

function $empty(){};


function coor(el){
	var size = DI.size(el),
		offset = DI.offset(el);
		
	return {
		left: offset.left,
		top: offset.top,
		width: size.width,
		height: size.height,
		right: offset.left + size.width,
		bottom: offset.top + size.height
	}
};


var DI = require('dom/dimension'),

PopupPanel = new Class({
    Implements: [Options, Events],
    options: {
        mode: 'single', //muti
        trigger: 'mouseover', //click
        type: 'cling-left',
        adjust: { x: 20, y: 20 },
        useFx: false,
        effect: { property: 'opacity' },
        zIndex: 1000,
        hasShim: true,
        onPreshow: $empty,
        onShow: $empty,
        onHide: $empty,
        needPosition: true
    },
    initialize: function (trigger, panel, options) {
        panel = $(panel);
        if (!panel) return;

        options = options || {};

        if (options.triger) {
            options.trigger = options.triger;
            delete options.triger;
        }
        
        var B = K.bind,
        	self = this;
        
        B('show', self);
        B('hide', self);
        B('position', self);

        this.setOptions(options);
        this.trigger = (this.options.mode == 'single' ? $(trigger) : $$(trigger));
        var defaultStyle = { 'position': 'absolute', 'visibility': 'hidden', 'zIndex': this.options.zIndex };
        this.panel = panel.setStyles(defaultStyle).inject($(document.body));
        // if (this.options.hasShim) this.shim = new IframeShim(this.panel);
        this.display = false;

        if (this.options.useFx) {
            this.fx = new Fx.Tween(this.panel, this.options.effect);
            this.fx.set(0);
        }

        if (this.options.mode == 'single') {
            if (this.options.trigger == 'click') {
                this.trigger.addEvents({
                    click: function (e) {
                        e && e.stop();  // bugfix_1: add
                        // console.log((this.display ? '<hide>' : '<show>') + 'event fired by trigger');

                        self.display ? self.hide() : self.show();
                    }
                });

                // change log: ref="bugfix_1 bugfix_2"
                // 2010-12-06  Kael Zhang: bug fixed, 修正了click的triggerType无法运行的问题。
                // 错误原因：
                // 1. trigger的click事件传递没有阻止，最终造成trigger的子元素触发hide
                // 2. document的事件之前是'mouseup', 与'click'不同，造成事件传递没有阻止，而无法通过再次点击trigger关闭panel
                //      典型的事件顺序： hide by document mouse up -> show by trigger

                document.addEvent('click', function (e) { // bugfix_2: mouse up -> click
                    if (e && self.display === true && e.target !== self.panel) {
                        // console.log((this.display ? '<hide>' : '<show>') + 'event fired by other place clicked:');
                        // console.log('trigger:', e.target);

                        self.hide();
                    }
                });
            } else {
                this.trigger.addEvents({
                    mouseenter: this.show,
                    mouseleave: this.hide
                });
                this.panel.addEvents({
                    mouseenter: this.show,
                    mouseleave: this.hide
                });
            }
        } else {
            this.currentTrigger = this.trigger[0];
            this.trigger.each(function (item) {
                item.addEvent(self.options.trigger, function () { self.currentTrigger = item; self.show(); });
            });

            //auto close function
        }


        window.addEvent('resize', this.position);
        this.position();
        return this;
    },
    setPanel: function (data) {
        if (K.isArray(data)) { this.panel.empty().adopt(data); }
        else { this.panel.set('html', data); }
    },
    show: function () {
        this.fireEvent('onPreshow');
        this.display = true;
        if (this.fx) {
            this.fx.cancel().start(1);
        } else {
            this.panel.setStyle('visibility', 'visible');
        }

        // if (this.shim) this.shim.show();
        this.fireEvent('onShow');
        return this.position();
    },
    hide: function () {
        this.display = false;
        if (this.fx) {
            this.fx.cancel().start(0);
        } else {
            this.panel.setStyle('visibility', 'hidden');
        }

        // if (this.shim) this.shim.hide();
        this.fireEvent('onHide');
        return this;
    }
    
});


var Pop = new Class({
    Extends: PopupPanel,
    options: {
        adjust: {x:0, y:0}
    },
    position: function() {
        var _this = this,
            o = _this.options,
            coor_trigger,
            coor_panel,
            adjust = o.adjust;

        if(o.needPosition){
            coor_trigger = (o.mode == 'single' ? coor(_this.trigger) : coor(_this.currentTrigger) );
            
            coor_panel = { top: coor_trigger.bottom - 2};
            switch (o.type) {
                case 'side-right':
                    coor_panel = {
                        left: coor_trigger.right - 2 + adjust.x, 
                        top: coor_trigger.top
                    };
                    break;
                case 'side-left':
                    coor_panel = {
                        right: DI.size(window).width - coor_trigger.left - 2 - adjust.x,
                        top: coor_trigger.top
                    };
                    break;
                case 'cling-right':
                    coor_panel.right = DI.size(window).width - coor_trigger.right - adjust.x;
                    break;

                default:
                    coor_panel.left = coor_trigger.left + adjust.x;
            }

            coor_panel.top += adjust.y;

            _this.panel.setStyles(coor_panel);
            // if (_this.shim) _this.shim.position();
        }
        return this;
    }
});


return Pop;


});
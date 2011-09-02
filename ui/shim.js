DP.define(['dom/dimension', './overlay', './position', './classmanager'], function (D, require) {
    var Dim = require('dom/dimension'),
		Overlay = require('./overlay'),
		Pos = require('./position'),
		ClsM = require('./classmanager'),
		_getClass = ClsM.className,
		_getId = ClsM.id,
		NEEDSHIM = 1, //DP.UA.ie < 7,
		NOOP = function () { };

    //TO DO:各种窗体事件触发时，Shim跟着Elem的样式作相应调整，及fix相关修补

    var proto = NEEDSHIM ? {
        Extends: Overlay,

        options: {
            zIndex: null,
            name: null,
            className: null,
            type: 'iframe'
        },

        initialize: function (elem, options) {
            var self = this;
            options = self.options = Object.merge(self.options, options);
            self.elem = $(elem);
            self.parent(options);
            self.createShim(options);
        },

        createShim: function (options) {
            var self = this;
            var shimElem = self.shimElem = self.get('win');
            var e = this.elem,
				h = Dim.size(e).height,
				w = Dim.size(e).width,
				z = e.style.zIndex, //mootools的getStyle方法有时候会傻逼,此处若e的style中设了z-index:999,e.getStyle('z-indxe')会得到auto
				o = this.options;            
            var positioner = self.get('win:position');


            this.id = _getId(o.name, this.constructor.NAME);

            if (z < 1 || z == 'auto') {
                z = o.zIndex > 0 ? o.zIndex : 999;
                e.setStyle('z-index', z);
            }

            shimElem.setStyles({
                'z-index': z - 1,
                'filter': 'mask()',
                'border': 'none',
                'position': 'absolute'
            });

            shimElem.setProperties({
                'frameborder': '0',
                'scrolling': 'no',
                'class': _getClass(o.className, this.constructor.NAME),
                'id': this.id
            });

            shimElem.setStyles({
                'height': h,
                'width': w
            });


            shimElem.inject(document.body);

            positioner.align(e, ['tl','tl']);
        },

        destory: function () {
            this.shim.destory();
            return this;
        }
    } : {
        initialize: NOOP,
        createShim: NOOP,
        destory: NOOP
    };


    Shim = new Class(proto);

    Shim.NAME = 'shim';
    return Shim;
});
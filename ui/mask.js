DP.define(['dom/dimension', './overlay', './shim', './c/mask.css'], function (D, require) {

    //TO DO : add shim to Mask

    var Dim = require('dom/dimension'),
        Overlay = require('./overlay'),
        Shim = require('./shim'),
        _set_get = {
            'content': {
                get: function () {
                    return this._content;
                }
            }
        };

    var Mask = (function () {

        var instance = null;

        var MaskInstance = new Class({
            Extends: Overlay,
            options: {
                onClick: function () { return console.log('clicked'); }
            },

            _bindUI: function () {
                var self = this;
                self.set('');
                self.get('win').inject(document.body);
                self.parent();
            },

            _renderUI: function () {
                var self = this;
                opt = self.options;
                D.bind('_size', self);

                //set elems
                self.positioner = self.get('win:position');
                self.positioner.align(document.body, ['tl', 'tl']);

                self._size();

                self.parent();
            },

            _size: function () {
                var self = this;
                //if (self.get('win') == document.body) {
                    var sizer = self.get('win:sizer');
                    sizer.fitTo(document.window);
                    //self.shim.shim && self.shim.shim.setStyles(size);
                    return;
                //}
            },

            _eventUI: function () {
                var self = this;

                self.get('win').addEvent('click', function () {
                    return self.fireEvent('click');
                });
                window.addEvent('resize', self._size);

                self.parent();
            },

            destructor: function () {
                var self = this;
                self.get('win').destroy();
                //this.shim.shim && this.shim.shim.destroy();
                instance = null;
                self.parent();
            }
        });

        MaskInstance.NAME = 'mask';
        MaskInstance.prototype.constructor = MaskInstance;
        MaskInstance._set_get = _set_get;
        D.mix(MaskInstance._set_get, Overlay._set_get, false);

        return {
            create: function (opt) {
                if (!instance) {
                    instance = new MaskInstance(opt);
                }
                return instance;
            }
        }
    })();


    return Mask;

})

DP.define(['dom/dimension'], function (D, require) {

    var Dim = require('dom/dimension');

    var defaultFits = {
        height: true,
        width: true,
        margin: false,
        border: false,
        padding: false
    };

    function calculateSize(dart, target, fits, scroll) {
        var dim = Dim,
        height, width,
        size = dim.size(target, scroll ? 'scroll' : '');

        function cal(elem, attr, type) {
            var pair = type == 'height' ? ['top', 'bottom'] : ['left', 'right'];
            var borderSuffix = attr == 'border' ? '-width' : '';
            return elem.getStyle(attr + '-' + pair[0] + borderSuffix).toInt() + dart.getStyle(attr + '-' + pair[1] + borderSuffix).toInt();
        }

        height = size.height - (fits.padding ? cal(dart, 'padding', 'height') : 0) - (fits.border ? cal(dart, 'border', 'height') : 0) + (fits.margin ? cal(dart, 'margin', 'height') - cal(dart, 'margin', 'height') : 0);
        width = size.width - (fits.padding ? cal(dart, 'padding', 'width') : 0) - (fits.border ? cal(dart, 'border', 'width') : 0) + (fits.margin ? cal(dart, 'margin', 'width') - cal(dart, 'margin', 'width') : 0);


        return {
            height: fits.height ? height : null,
            width: fits.width ? width : null
        };
    }

    function setSize(elem, size) {
        size.height && elem.setStyle('height', size.height);
        size.width && elem.setStyle('width', size.width);
    }

    // fits:{ fitMargin:Boolean, fitBorder:Boolean ,fitPadding:Boolean }
    function Sizer(dart, fits) {
        var self = this;
        self.fits = fits;
        self._dart = dart;
    }

    Sizer.prototype = {
        set: function (size) {
            var self = this;
            self.setSize(self._dart, size);
        },
        hide: function () {
            this._dart.setStyle('display', 'none');
        },
        show: function () {
            this._dart.setStyle('display', 'block');
        },
        fitTo: function (target, fits, scroll) {
            var self = this,
            size, fits = fits || {};
            fits = D.mix(defaultFits, fits);
            size = calculateSize(self._dart, target, fits, scroll);
            setSize(self._dart, size);
        }
    };

    return Sizer;

});
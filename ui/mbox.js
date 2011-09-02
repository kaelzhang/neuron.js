DP.define(['./dialog', './mask'], function (K, require) {
    var Dialog = require('./dialog'),
        Mask = require('./mask'),
        dialog,
        mask,
        NOOP = function () { };

    var Mbox = {
        _createAndShowMask: function () {
            mask = Mask.create();
            mask.show();
        },
        openLite: function (content) {
            var positions;

            Mbox._createAndShowMask();

            if (dialog) {
                dialog.destructor();
            };
            dialog = new Dialog({
                closeable: false,
                content: content,
                winCls: 'D-Mbox-win'
            });
            dialog.show();

            positions = dialog.get('win:position');

            positions.align($(document.body), ['cc', 'cc'], true);
        },
        open: function (options) {
            var positions,
                _closeEvent = NOOP;

            Mbox._createAndShowMask();

            if (dialog) {
                dialog.destructor();
            };

            if (options.type == 'ele') { console.log(options.url)
                dialog = new Dialog({
                    onShow: options.onShow || NOOP,
                    content: options.url,
                    winCls: 'D-Mbox-win ' + (options.winCls || ''),
                    closeCls: options.closeCls || ''
                });

                //这里如果onClosing为空值，mask.hide就不会执行了
                if (options.onClosing) {
                    dialog.addEvent('hide', function () {
                        options.onClosing.apply(this, arguments);
                        mask && mask.hide();
                    });
                };

                dialog.show();

                positions = dialog.get('win:position');

                positions.align($(document.body), ['cc', 'cc'], 'viewport');
            };
        },
        hide: function () {
            dialog && dialog.hide();
            mask && mask.hide();
        },
        close: function () {
            dialog && dialog.hide();
            mask && mask.hide();
        },
        show: function () {
            dialog && dialog.show();
            mask && mask.show();
        }
    };

    return Mbox;
});
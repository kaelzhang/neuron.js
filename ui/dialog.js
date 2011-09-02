DP.define(['ui/classmanager', 'ui/overlay'], function (K, require) {
    var Overlay = require('ui/overlay'),
        classManager = require('ui/classmanager'),
        _getClassName = classManager.className,
        DOC = document,
        BODY = DOC.body,
        EMPTY_STR = '',
        DIV = 'div',
        _set_get = {
            'close': {
                get: function () {
                    return this._close;
                }
            },
            'close:name': {
                value: 'close'
            }
        },
         Dialog = new Class({
             Extends: Overlay,
             options: {
                 closeable: true,
                 closeCls: EMPTY_STR
             },
             initialize: function (options) {
                 var self = this;
                 self.parent(options);
                 options = self.options;
                 if (options.closeable) {
                     self._close = new Element('a', { href: 'javascript:void(0)' });
                 };
             },
             /**
             * @public
             * @method destructor
             * @description 析构
             * @return {Self}
             */
             destructor: function () {
                 if (this._close) {
                     this._close.removeEvent('click', this.hide);
                 };
                 this.parent();
             },
             /**
             * @protected
             * @method _bindUI
             * @description 初始化DOM状态
             */
             _bindUI: function () {
                 var self = this,
                     _options = self.options,
                     _win = self.get('win');
                 if (self._close) {
                     _win.adopt(self._close);
                 };
                 self.parent();
             },
             /**
             * @protected
             * @method _renderUI
             * @description 初始化UI状态
             */
             _renderUI: function () {
                 var _close = this._close,
                     _name = this.constructor.NAME,
                     _options = this.options;
                 if (_close) {
                     _close.addClass(_getClassName(_set_get['close:name'].value, _name));
                     if (_options.closeCls) {
                         _close.addClass(_options.closeCls);
                     };
                 };
                 this.parent();
             },
             /**
             * @protected
             * @method _renderUI
             * @description 事件监听添加完毕
             */
             _eventUI: function () {
                 var _close = this._close;
                 if (_close) {
                     _close.addEvent('click', this.hide);
                 };
                 this.parent();
             }
         });
    Dialog.NAME = 'Dialog';
    Dialog.prototype.constructor = Dialog;
    Dialog._set_get = _set_get;
    K.mix(Dialog._set_get, Overlay._set_get, false);
    return Dialog;
});
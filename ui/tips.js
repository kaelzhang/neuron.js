DP.define(['ui/overlay', 'dom/dimension'], function (K, require) {
    var Overlay = require('ui/overlay'),
        Dimension = require('dom/dimension'),
        NOOP = function () { },
        EVENTS = ['enter', 'leave'],
        EVENT_MOVE = 'move',
        Tips = new Class({
            Extends: Overlay,
            options: {
                onMouseenter: NOOP,
                onMouseleave: NOOP,
                onMousemove: NOOP,
                id: null,
                offset: { x: 0, y: 0 },
                fixed: false,
                moveDelay: 30
            },
            initialize: function (options) {
                var self = this,
                    _events = self._events = EVENTS.clone();
                self.parent(options);
                options = self.options;
                options.id = K.isArray(options.id) ? $$(options.id) : $$(([$(options.id)]));
                if (!options.fixed) _events.push(EVENT_MOVE);
                _events.each(function (value) {
                    K.bind('_' + value, self);
                });
            },
            /**
            * @public
            * @method destructor
            * @description 析构
            * @return {Self}
            */
            destructor: function () {
                var self = this,
                    _target = self.options.id;
                self._events.each(function (value) {
                    _target.removeEvent('mover' + value, self['_' + value]);
                });
                self.parent();
                return self;
            },
            /**
            * @protected
            * @method _renderUI
            * @description 事件监听添加完毕
            */
            _eventUI: function () {
                var self = this,
                    _options = self.options,
                    _target = _options.id;

                self._events.each(function (value) {
                    _target.addEvent('mouse' + value, self['_' + value]);
                });

                this.parent();
            },
            /**
            * @private
            * @method _enter
            * @description 鼠标移入
            * @param {Event} e
            */
            _enter: function (e) {
                var _offset = Dimension.offset(e.target),
                    _fixed = !!this.options.fixed;
                e.stop();
                this.show();
                this._pos({
                    x: _fixed ? _offset.left : e.event.x,
                    y: _fixed ? _offset.top : e.event.y
                });
                this.fireEvent('mouseenter', e);
            },
            /**
            * @private
            * @method _leave
            * @description 鼠标移出
            * @param {Event} e
            */
            _leave: function (e) {
                e.stop();
                this.hide();
                this.fireEvent('mouseleave', e);
            },
            /**s
            * @private
            * @method _move
            * @description 鼠标移动
            * @param {Event} e
            */
            _move: function (e) {
                e.stop();
                this._pos({
                    x: e.event.x,
                    y: e.event.y
                }, this.options.moveDelay);
                this.fireEvent('mousemove', e);
            },
            /**
            * @private
            * @method _position
            * @description Tips定位
            * @param {Event} e
            */
            _pos: function (pos, delay) {
                var self = this,
                    _options = self.options,
                    _offset = _options.offset,
                    _win = self.get('win'),
                    _y = pos.y + _offset.y,
                    _x = pos.x + _offset.x;

                if (!self._timer) {
                    self._timer = setTimeout(function () {
                        _win.setStyles({ top: _y, left: _x });
                        clearTimeout(self._timer);
                        self._timer = null;
                    }, delay || 0);
                };
            },
            /**
            * @public
            * @method bind
            * @description 绑定Tips组件
            */
            bind: function () {
                this._eventUI();
                return this;
            }
        });
    Tips.NAME = 'Tips';
    Tips.prototype.constructor = Tips;
    return Tips;
});
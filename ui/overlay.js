DP.define(['./classmanager', './position', './sizer'], function (K, require) {
    var classManager = require('./classmanager'),
        _getClassName = classManager.className,
        position = require('./position'),
        sizer = require('./sizer'),
        DOC = document,
        BODY = DOC.body,
        NOOP = function () { },
        DISPLAY = 'display',
        DIV = 'div',
        EMPTY_STR = '',
        _set_get = {
            'win': {
                get: function () {
                    return this._win;
                }
            },
            'win:name': {
                value: 'win'
            },
            'win:position': {
                get: function () {
                    return this._position;
                }
            },
            'win:sizer': {
                get: function () {
                    return this._sizer;
                }
            }
        },
        Overlay = new Class({
            Implements: [Options, Events],
            options: {
                onInit: NOOP,
                onBind: NOOP,
                onRender: NOOP,
                onEvent: NOOP,
                onShow: NOOP,
                onHide: NOOP,

                target: BODY,
                type: DIV,

                content: EMPTY_STR,
                winCls: EMPTY_STR,
                zIndex: 2002
            },
            initialize: function (options) {
                var self = this,
                    _temp_div;

                self.setOptions(options);
                options = self.options;

                self._win = new Element(options.type);
                self._position = new position(self._win, {posType:'viewport'});
                self._sizer = new sizer(self._win);

                if (K.isString(options.content)) {

                    _temp_div = new Element(DIV, { html: options.content });

                    options.content = _temp_div.getChildren();
                };

                options.content = Array.from(options.content);

                self.fireEvent('init');

                K.bind('hide', self);

                K._onceBefore('show', '_show', self);
            },
            /**
            * @public
            * @method destructor
            * @description 析构
            * @return {Self}
            */
            destructor: function () {
                this._win.destroy();
                return this;
            },
            /**
            * @protected
            * @method _bindUI
            * @description 初始化DOM状态
            */
            _bindUI: function () {
                var self = this,
                    _options = self.options;
                $(_options.target).adopt(self._win.adopt($$(_options.content)));
                this.fireEvent('bind');
            },
            /**
            * @protected
            * @method _renderUI
            * @description 初始化UI状态
            */
            _renderUI: function () {
                var _win = this._win,
                    _name = this.constructor.NAME,
                    _options = this.options;
                _win.addClass(_getClassName(_set_get['win:name'].value, _name));
                if (_options.winCls) {
                    _win.addClass(_options.winCls);
                };
                this.fireEvent('render');
            },
            /**
            * @protected
            * @method _renderUI
            * @description 事件监听添加完毕
            */
            _eventUI: function () {
                this.fireEvent('event');
            },
            /**
            * @private
            * @method _show
            * @description 显示
            * @return {Self}
            */
            _show: function () {
                this._bindUI();
                this._renderUI();
                this._eventUI();
                this.fireEvent('show');
                return this;
            },
            /**
            * @public
            * @method show
            * @description 显示
            * @return {Self}
            */
            show: function () {
                this._win.setStyle(DISPLAY, '');
                this.fireEvent('show');
                return this;
            },
            /**
            * @public
            * @method hide
            * @description 隐藏
            * @return {Self}
            */
            hide: function () {
                this._win.setStyle(DISPLAY, 'none');
                this.fireEvent('hide');
                return this;
            },
            /**
            * @public
            * @method set
            * @description 写操作
            * @param {String} type -> _set_get
            * @param {String | Object} data
            * @return {Self}
            */
            set: function (type, data) {
                var _sg = this.constructor._set_get,
                    _setter = _sg ? _sg[type] : _set_get[type];
                _setter && _setter.set && _setter.set.call(this, data);
                return this;
            },
            /**
            * @public
            * @method get
            * @description 读操作
            * @param {String} type -> _set_get
            * @return {Object}
            */
            get: function (type) {
                var _sg = this.constructor._set_get,
                    _getter = _sg ? _sg[type] : _set_get[type];
                return _getter && _getter.get && _getter.get.call(this);
            }
        });
    Overlay.NAME = 'Overlay';
    Overlay._set_get = _set_get;
    return Overlay;
});
/*
    example:
        > var overlay= new Overlay({
                            content : HTML or Nodes
                       });
        > overlay.show();
        > overlay.hide();
*/
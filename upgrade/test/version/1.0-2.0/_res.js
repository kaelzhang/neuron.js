DP.define(function (D) {

    var $ = D.DOM,

    VPAction = D.Class({
        initialize: function (opt) {
            var self = this,
                preDistance = opt.preDistance,
                blocks = this.blocks = {},
                winHeight;

            function setWinHeight() {
                winHeight = self._getViewport().height;
            }

            function determine() {
                var scrollTop = self._getScrollTop();
                D.each(blocks, function (block, i) {
                    if (scrollTop + winHeight + preDistance >= i) {
                        block();
                        blocks[i] = null;
                        delete blocks[i];
                    }
                });
            }
            this.determine = determine;
            $(window).on('scroll', determine);


            $(window).on('resize', setWinHeight);

            setWinHeight();
        },
        add: function (block, cb, args) {
            var top;
            if (block.count()) {
                top = block.el(0).offsetTop; // Dim.offset(block).top
                this.blocks[top] = function () {
                    cb.apply(block.get(0), D.makeArray(args));
                };
            }
        },
        _getScrollTop: function () {
            // return Dim.scroll(window).top 
            if (typeof pageYOffset != 'undefined') {
                //most browsers
                return pageYOffset;
            }
            else {
                var B = document.body; //IE 'quirks'
                var D = document.documentElement; //IE with doctype
                D = (D.clientHeight) ? D : B;
                return D.scrollTop;
            }
        },
        _getViewport: function () {
            // return Dim.size(window).height;
            var viewPortWidth;
            var viewPortHeight;

            // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
            if (typeof window.innerWidth != 'undefined') {
                viewPortWidth = window.innerWidth,
               viewPortHeight = window.innerHeight
            }

            // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
            else if (typeof document.documentElement != 'undefined'
             && typeof document.documentElement.clientWidth !=
             'undefined' && document.documentElement.clientWidth != 0) {
                viewPortWidth = document.documentElement.clientWidth,
                viewPortHeight = document.documentElement.clientHeight
            }
            return { width: viewPortWidth, height: viewPortHeight }
        }
    });



    // -------------------------------- quick search -------------------------------- *\
    function initQuickSearch() {
        D.provide(['io/ajax', 'event/live', 'Main::header'], function (D, Ajax, Live, Header) {
            var 

        NULL = null,

        Select = D.Class({

            Implements: 'attrs events',

            initialize: function (select, panel, options) {
                var self = this,
                    o, close_btn;

                select = $(select);
                panel = $(panel);

                self.set({ opt: options });

                o = self.get('opt');

                self.select = select;
                self.text = o.txtCS ? select.one(o.txtCS) : select;
                self.panel = panel;

                self.cont = panel.one(o.contentCS);
                self.cont = self.cont.count() ? self.cont : panel;

                self._bind();
                self._initData();
            },

            // @private
            _bind: function () {
                var self = this,
                    o = self.get('opt'),
                    content = self.cont,
                    panel = self.panel,
                    activeCls = o.optionActiveCls;

                // panel close btn
                panel.one(o.closeCS).on('click', function (e) {
                    e.prevent();
                    self.hide();
                });

                // select
                self.select.on('click', function (e) {
                    e.prevent();

                    if (!self.shown) {
                        // prevent bubbling to body
                        e.stopBubble();

                        self.shown = true;
                        panel.css('visibility', self.shown ? 'visible' : '');
                        self.fire('show');
                    }
                });

                $(document.body).on('click', function (e) {
                    if (self.shown && !self.cont.one(e.target).count()) {
                        self.shown = false;
                        self.hide();
                    }
                });

                // select option
                Live.on(content, 'click', o.optionCS, function (e) {
                    e.prevent();

                    var t = $(this);

                    self.actived.removeClass(activeCls);
                    self.actived = t.addClass(activeCls);

                    self.hide();
                    self._setTxt(t.text());
                    self.setValue(t.attr(o.valueAttr), t.text());

                    self.fire('select', { selected: t });
                });

                // never destroy this method, _bind should be executed whenever reload
            },

            _initData: function () {
                var self = this,
                    o = self.get('opt'),
                    attr = o.valueAttr;

                self.actived = self.cont.one('.' + o.optionActiveCls);

                self._v = self.actived.attr(attr) || self.select.attr(attr);
            },

            // @private
            _filterTxt: function (text) {
                var txtFilter = this.get('opt').txtFilter;

                return txtFilter ? txtFilter(text) : text;
            },

            // @private
            _setTxt: function (text) {
                this.text.text(this._filterTxt(text));
            },

            // ---------------- public -----------------
            hide: function () {
                this.panel.css('visibility', 'hidden');
                this.shown = false;

                return this;
            },

            reload: function (html) {
                var self = this;

                self.cont.empty().html(html);
                // self._bind();
                self._initData();

                return self;
            },

            val: function () {
                return this._v || 0;
            },

            setValue: function (value, text, no_event) {
                var self = this;

                self._v = value;

                (text || text === '') && self._setTxt(text);

                !no_event && self.fire('change', { value: value });

                return self;
            }
        });

            D.Class.setAttrs(Select, {
                opt: {
                    value: {
                        txtCS: '.txt',
                        txtFilter: NULL,
                        contentCS: '.dp-option-wrap',
                        optionCS: '.option',
                        closeCS: '.close',
                        optionActiveCls: 'option-active',
                        valueAttr: 'data-value' // 存储value值的属性名，请不要在非表单元素上添加value属性，而请使用html5的 data-*
                    },

                    setter: function (v) {
                        return D.mix(v || {}, this.get('opt'), false);
                    }
                }
            });

            var qs_channel, qs_cate, qs_region,
            qs_btn = $('#J_qs-btn'),
            qs_data_cache = {},
            qs_action_array = [],
            city_id = D.data('cityID');

            // [shanghai food] -> food
            function text_filter(text) {
                return text.replace(/(?:\[|\])/g, '');
            }

            // get quich search data
            function get_qs_data(value, callback) {
                var cache = qs_data_cache;

                if (!callback) return;

                if (cache[value]) {
                    callback(cache[value]);
                } else {
                    new Ajax({
                        url: '/ajax/json/index/channel/common/searchbar',
                        data: {
                            'do': 'getHTML',
                            cid: city_id,
                            rid: value
                        }
                    }).on({
                        success: function (rt) {
                            if (rt && rt.code === 200 && rt.msg) {
                                cache[value] = rt.msg;
                                callback(rt.msg);
                            }
                        }
                    }).send();
                }
            }

            function qs_accordian(index) {
                var a = qs_action_array,
        i = 0, len = a.length;

                for (; i < len; i++) {
                    i !== index && a[i].hide();
                }
            }

            Header.runAfterInit(function () {
                qs_channel = new Select('#J_qs-channel', '#J_qsp-channel').on({
                    change: function (e) {
                        var value = e.value;

                        get_qs_data(value, function (data) {
                            qs_region.reload(data.regionhtml).setValue(0, data.regiontitle);
                            qs_cate.reload(data.categoryhtml).setValue(0, data.categorytitle);
                        });
                    },

                    show: function () {
                        qs_accordian(0);
                    }
                });

                qs_cate = new Select('#J_qs-cate', '#J_qsp-cate', { txtFilter: text_filter }).on({
                    show: function () { qs_accordian(1); }
                });

                qs_region = new Select('#J_qs-region', '#J_qsp-region', { txtFilter: text_filter }).on({
                    show: function () { qs_accordian(2); }
                });

                qs_action_array = [qs_channel, qs_cate, qs_region];

                qs_btn.on('click', function (e) {
                    e.prevent();

                    window.location.href = '/search/category/' + city_id + '/' + qs_channel.val() + '/g' + qs_cate.val() + 'r' + qs_region.val();
                });

                qs_channel.fire('change', { value: qs_channel.val() });
            });

        });
    };


    function initSwitches() {
        DP.provide("switch/core", function (D, Switch) {
            new Switch().plugin('tabSwitch').init({
                CSPre: '#J_user-tabs',
                itemCS: '.tab-panel',
                itemOnCls: 'tab-panel-on',
                triggerCS: '.tab',
                triggerOnCls: 'active',
                /*containerCS: '.block-inner',*/
                triggerType: 'mouseenter'
            });

            new Switch().plugin('carousel', 'autoPlay').init({
                CSPre: '.weekly-switch',
                itemCS: 'li',
                triggerCS: '.ws-pages li',
                triggerOnCls: 'current',
                containerCS: '.ws-wrap',
                triggerType: 'mouseenter',
                direction: 'top'
            });

            new Switch().plugin('tabSwitch').on({
                afterInit: function () {
                    $.all('#J_hot-tg img').forEach(function (img) {
                        var src = $(img).attr('data-src');
                        if (src) {
                            img.src = src;
                        }
                    });
                }
            }).init({
                CSPre: '#J_hot-tg',
                itemCS: 'li',
                itemOnCls: 'on',
                triggerCS: 'li',
                containerCS: 'ul',
                triggerType: 'mouseenter'
            });
        });
    };


    function initLazyLoad() {
        var vpa = new VPAction({
            preDistance: 100
        });

        function loadImg() {
            this.all('.J_lazy-img').forEach(function (img) {
                var src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                }
            });
        }

        vpa.add($('#J_hot-shop'), loadImg);
        vpa.add($('#J_hot-list'), loadImg);
        vpa.add($('.comment-list-a'), loadImg);
        vpa.add($('.thumb-list'), loadImg);
        vpa.determine();
    }

    function initHead() {
    /*
        D.provide(['util/cookie', 'io/ajax', 'Main::header'], function (D, Cookie, Ajax, Header) {
            // 请求用户信息
            var userinfo;


            if (!Cookie.read('dper')) {
                return;
            } else {

                Header.runAfterInit(function () {



                    new Ajax({
                        url: "/ajax/json/index/userinfo"
                    }).on('success', function (json) {
                        if (json.code == 200) {
                            userinfo = json.msg;
                            render();
                        }
                    }).send();


                    // 渲染
                    function render() {
                        var html = userinfo.headHtml,
                            ipadhint = $('.pp_ipad-hint'), // 保存ipad hint，若有
                            userId = userinfo.userId;



                        // 修改页头
                        $('.header-bar .inner').html(html);

                        ipadhint.inject($('.i-mobile'));

                        // 个人中心菜单
                        Header.initLazyLoad($('#J_uc-menu').el(0));
                        Header.menu($('#G_h-uc'), $('#G_h-uc-panel'), "hover", true);
                        // 消息
                        $('.toolbar-box').count() ? Header.initUserHeader() : Header.initMainHeaderUserMessage();

                        // 修改页脚
                        var gs = $.all('.footer_w .catLinks .G');

                        gs.forEach(function (el) {
                            el = $(el);
                            var pattern = el.attr('data-pattern');
                            pattern && el.attr('href', D.sub(pattern, { userId: userId }));
                        });
                    }


                });
            }
        });
        */
    }

    function abtest() {

        var abtestData = $.all(".J-abtest").el(),
			contain = {
			    'name': "",
			    "cityId": "",
			    "shopType": "",
			    "testId": ""
			},
			selector = {};
        prefix = "data-abtest-";
        if (abtestData.length > 0) {
            DP.each(abtestData, function (data, i) {
                data = $(data);
                contain.name += (data.attr(prefix + "name") || "") + ",";
                contain.cityId += (data.attr(prefix + "cityId") || "") + ",";
                contain.shopType += (data.attr(prefix + "shopType") || "") + ",";
                contain.testId += (data.attr(prefix + "testId") || "") + ",";
                !selector.name && (selector[data.attr(prefix + "name")] = data);
            });

            for (key in contain) {
                contain[key] = contain[key].replace(/\,$/, "");
            }

            DP.provide('io/ajax', function (K, Ajax) {
                new Ajax({
                    url: "/ajax/json/index/abtest",
                    method: 'post',
                    data: contain
                }).on({
                    success: function (data) { _success(data, selector) }
                }).send();
            });
        }

        function _success(data, selector) {
            var msg = data.msg || "";
            if (data.code && data.code == "200") {
                if (DP.isArray(msg)) {
                    DP.each(msg, function (data) {
                        if (selector[data.name]) {
                            selector[data.name].html(data.html);
                        }
                    })
                }
            } else {
                //alert(msg);
            }
        }
    }


    return {
        init: function () {




            D.ready(function () {
                initQuickSearch();
                initSwitches();
                // image lazy load
                initLazyLoad();
                initHead(); // 首页静态化，之后铺开到所有页面后迁到Main::header中

                abtest(); //abtest

            });
        }
    };

});
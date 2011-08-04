/*!
 * module  switch
 * author  Kael Zhang
 */

KM.define(function(K){

var EVENT_BEFORE_INIT = 'beforeInit',
    EVENT_AFTER_INIT = 'afterInit',
    EVENT_BEFORE_SWITCH = 'beforeSwitch',
    EVENT_ON_SWITCH = 'switching',
    EVENT_FX_COMPLETE = 'fxcomplete',

    FORWARD = 'forward',
    BACKWARD = 'backward',

    NOOP = function(){},
    EMPTY = '',

    Switch, Initializer;
    
    
/**
 * initializer, 
 * put all specified methods into an executing queue before initialization method complete
 
 <code>
 	// .plugin method is an asynchronous method, but .init method relies on the effect of .plugin method
 	new Switch().plugin('carousel').init({...});
 </code>
 */
Initializer = new Class({
    Implements: Options,
    
    initialize: function(host, items){
    	var self = this;
    
    	self.host = host;
    	
    	K.makeArray(items).each(function(i){
    		i && self._add(i, host);
    	});
    },

    _items: {},
    _stack: [],
    _history: [],
    
    _add: function(name, host, undef){
    	var self = this,
    		auto = true, once = false,
    		fn, before;
    	
    	if(K.isPlainObject(name)){
    		// @type {boolean} 
    		auto = name.auto;
    		auto = auto === undef ? true : auto;
    		
    		// @type {}
    		before = name.before;
    		
    		// @type {boolean} whether the item should be executed only once
    		once = name.once;
    		name = name.name;
    	}
		
		fn = self._items[name] = self._items[name] || host[name];
		
		if(fn){
			host[name] = function(){ console.log(name, 'wrapper', arguments)
				// 
				if(
					!self._history.contains(before) && 
					(!once || 
						!self._history.contains(name)
					)
				){
					self._stack.push({
						auto: !!auto,
						once: !!once,
						name: name,
						arg: arguments
					});
					
					self._history.push(name);
				}
				
				// avoid recursive invocation
				setTimeout(function(){
					self._next();
				}, 0);
				
				return host; // chain
			}
		}
    },
    
    // finish will stop all functionalities of Initializer
    finish: function(){
    	var name, 
    		self = this,
    		host = self.host;
    	
    	for(name in self._items){
    		host[name] = self._items[name];
    	}
    	
    	self._items = {};
    },
    
    _next: function(){
    	var self = this,
    		current, fn;

    	if(!self.on && (current = self._stack.shift()) && (fn = self._items[current.name])){
    		self.on = true;
    		
    		// clean the method before executing
    		if(current.once){
    			self._items[current.name] = NOOP;
    		}
    		console.log(current)
    	
    		fn.apply(self.host, current.arg || []);
    		
    		return current.auto && self.resume();
    	}
    },
    
    resume: function(){
    	var self = this;
    	self.on = false;
    	
    	return self._next();
    }
});


/**
 * @constructor
 *
 * @usage 
 *
 *  new Switch().plugin('lazyLoad', 'autoPlay'[, …]).init(options);
 *
 * if no plugin is specified, the items will plainly switched with no effect
 */
Switch = new Class({
    Implements: [Options, Events],

    options: {
        // stage {int} the number of items in one viewport
        stage: 1,

        // move {int} the number of items a single switch will move
        move: 1,

        // to do
        // moveRelative: false,
        // noClick: false,

        triggerType: 	'click',

        // selectorPre {string} prefix of selectors
        // if selectorPre === '#switch', then we will get previous button with $$('#switch ' + options.prev)[0]
        CSPre: 			EMPTY,

        // triggerS {dom selector $$ || Mootools Elements} trigger selector of switch tabs, such as 1,2,3,4
        triggerCS: 		EMPTY, 		// '.trigger',
        triggerOnCls: 	EMPTY, 		// 'J_trigger-on',

        countCls: 		EMPTY, 		// '.page-count',

        // container, prev, next {dom selector $$[0] || Mootools Element} 
        containerCS: 	EMPTY, 		// '.switch-track',
        prevCS: 		EMPTY, 		// '.prev',
        nextCS: 		EMPTY, 		// '.next',

        // items will be fetched by container.getElements()
        itemsCS: 		EMPTY, 		// 'li',
        itemOnCls: 		EMPTY, 		// 'J_cont-on',

        // the index of the first items activated when initializing
        activeIndex: 	0
    },
    
    initialize: function(){
    	var self = this;
    	
    	/**
    	 
    	 */
    	self._initializer = new Initializer(self, [{
	    		name: 'plugin',
	    		auto: false,
	    		before: 'init'
	    		
	    	}, {
	    		name: 'init',
	    		once: true	
	    	},
	    	
	    	'switchTo', 'prev', 'next'
    	]);
    },
    

    // @private
    // store the instance of plugin
    _plugins: [],

    // store the name of the plugins for indexing
    _plugin_names: [],
	
	_pendingPlugins: function(plugins){
		var plugin, i = 0, len = plugins.length,
			pending_plugins = [],
			prefix = Switch.PREFIX;
			
		
		for(; i < len; i ++){
			plugin = plugins[i];
			
			if(K.isString(plugin)){
				pending_plugins.push(prefix + plugin.toLowerCase());
			}
		}
		
		return pending_plugins;
	},
	
	plugin: function(){
		var self = this,
			arg = arguments,
    		pending = self._pendingPlugins(arg);
    	
    	// before executing ._addPlugin, make sure every plugin is provided
		K.provide(pending, function(){
			self._plugin.apply(self, arg);
			
			self._initializer.resume();
		});
		
		return self;
	},
	
	/**
	 * @param {Object} plugin
	 * @return {boolean} whether is the final plugin
	 */
	_addPlugin: function(plugin){
		var self = this;

        // you can add a plugin only once
        if(!plugin || !plugin.name || self._plugin_names.contains(plugin.name) || self.pluginFinal){
            return;
        }

        // if has required plugin, register that plugin first
        if(_plugin.require && arguments.callee(D.Switch.Plugins[_plugin.require]) ){
            return _t.pluginFinal = true;
        }

        // set plugin options before method Switch.init, so that we can override plugin options before plugin.init
        if(plugin.options){
            self.setOptions(plugin.options);
        }

        self._plugins.push(plugin);
        self._plugin_names.push(plugin.name);
        
        return plugin.final_ ? (self.pluginFinal = true) : false;
	},
	
    // register plugins
    // @param {object} arguments plugin object
    _plugin: function(){
        if(!this.pluginFinal){
            var i = 0,
                len = arguments.length,
                plugin,
                self = this;

            for(; i < len; ++ i){
                plugin = arguments[i]; 

                if(!plugin){
                    continue;
                }

                if(K.isString(plugin)){
                    K.provide(Switch.PREFIX + plugin.toLowerCase(), function(K, p){
                    	plugin = p;
                    });
                }

                // add plugin,
                // and if it's final, exit for-loop
                if( self._addPlugin(plugin) ){
                    break;
                }
            }

        }
    },

   	// initialization of Switch and Switch plugins
    // @param options {object} DP.Switch options and DP.Switch.Plugins options
    init: function(options){ console.log('init')
    
    	this._initializer.finish();
    
    	return;
        var _this = this,
            o,
            currentTrigger, activeIndex,
            plugins = _this._plugins;

        // we can override plugin options here
        _this.setOptions(options);
        o = _this.options;

        if(o.selectorPre){
            o.selectorPre = String(o.selectorPre).trim() + ' ';
        }

        // apply plugin initialization method
        plugins.each(function(plugin){
            if(plugin.init){
                plugin.init(_this);
            }
        });

        _this._initEvent();

        // however, the container should be found first
        _this.container = $$(o.selectorPre + o.container)[0];
                
        if(_this.container){
            activeIndex = _this.activeIndex = o.activeIndex || 0;

            _this.fireEvent(EVENT_BEFORE_INIT);

            _this._initDom();
            _this._bindNav();
            _this.fireEvent(EVENT_AFTER_INIT);

            currentItem = _this.items[activeIndex];

            if(currentItem && !currentItem.hasClass(_this.options.itemOnClass)){
                _this.switchTo(activeIndex, true);
            }
        }

        // method init can be executed only once
        // after initialization, registering new plugin is forbidden
        _this.init = _this.plugin = function(){return _this;};

        return _this;
    },

    // initialize DOM
    _initDom: function(){
        var _this = this,
            o = _this.options,
            pre = o.selectorPre;

        _this.items = _this.container.getElements(o.items);
        _this.triggers = o.trigger ? $$(pre + o.trigger) : [];
        _this.pageCounters = $$(pre + o.countClass);

        o.prev && (_this.prevBtn = $$(pre + o.prev)[0]);
        o.next && (_this.nextBtn = $$(pre + o.next)[0]);

        _this.length = _this.items.length;


		/**
         calculate how many pages the Switcher has:
         
         //////////////////////////////////////////////////////////////////////////////////////
         
                                      |         length          |
                                      | stage |
                                      _________
         begin                        ___________________________ <-- move to left
         end      ___________________________
                  | move * (page - 1) |  L  |
		
		 //////////////////////////////////////////////////////////////////////////////////////

         1. move * (page - 1) + L = length    // size
         2. 0 < L <= stage                    // 
         3. 0 <= stage - L < move             // no exceed
         
         // common sense: each move should be less than the length of stage 
         // otherwise, some pics will be invisible
         4. stage >= move
                             
         so, page?
         -> 1 + (length - stage)/move <= page < 2 + (length - stage)/move
         -> page = {1 + (length - stage)/move}
        */
        _this.pages = 1 + Math.ceil( (_this.length - o.stage) / (o.move || 1) );

        if(_this.pages < 2){
            _this.leftEnd = _this.rightEnd = true;
        }
    },

    // bind navigators and triggers
    _bindNav: function(){
        var _this = this,
            o = this.options,
            type = o.triggerType,
            i = 0,
            len = this.triggers.length,
            trigger;
            
        _this.prevBtn && _this.prevBtn.addEvent(type, _this.prev.bind(_this));
        _this.nextBtn && _this.nextBtn.addEvent(type, _this.next.bind(_this));

        for(; i < len; ++ i){

            // use closure to store i
            (function(index){
                var _t = _this;

                trigger = _t.triggers[index];

                trigger.addEvent(type, function(e){
                    e && e.preventDefault();
                    _t.switchTo(index);

                }).addEvents({
                    mouseenter: function(){ _t._onEnterTrigger(index); },
                    mouseleave: function(){ _t._onLeaveTrigger(index); }
                });

            })(i);
        };

//        _this.container.addEvents({
//            mouse enter: function(){ _this.hoverOn = true; },
//            mouse leave: function(){ _this.hoverOn = false; }
//        });
    },

    _initEvent: function(){
        this.addEvents(this.options.events);
    },

    _onEnterTrigger: function(index){
        this.triggerOn = true;
    },

    _onLeaveTrigger: function(index){
        this.triggerOn = false;
    },

    // switch to a certain item
    // @param index {Number} the index of the item to be switched on
    // @param force {Boolean} force to switching
    switchTo: function(index, force){
        var _this = this;

        if(force || _this.activeIndex !== index){
            _this.fireEvent(EVENT_BEFORE_SWITCH, [_this.activeIndex, index]);
            _this.activeIndex = index;
            _this.fireEvent(EVENT_ON_SWITCH);
            _this.pageCounters.set('text', index + 1);
        }

        return _this;
    },

    prev: function(e){
        e && e.preventDefault();
        var _this = this;

        // 限制 activeIndex 的范围
        !_this.leftEnd && _this.switchTo((_this.activeIndex - 1).limit(0, _this.pages - 1));
    },

    next: function(e){
        e && e.preventDefault();
        var _this = this;

        !_this.rightEnd && _this.switchTo((_this.activeIndex + 1).limit(0, _this.pages - 1));
    },

    // 激活或者禁用导航按钮，并设置标识状态
    _dealBtn: function(){
        var disable = {
                opacity: .3,
                cursor: 'default'
            },

            enable = {
                opacity: 1,
                cursor: ''
            },
            _this = this;

        if(_this.prevBtn){
            if(_this.leftEnd = !_this.activeIndex){
                _this.prevBtn.setStyles(disable);
            }else{
                _this.prevBtn.setStyles(enable);
            }
        }

        if(_this.nextBtn){
            if(_this.rightEnd = (_this.activeIndex >= _this.pages - 1) ){
                _this.nextBtn.setStyles(disable);
            }else{
                _this.nextBtn.setStyles(enable);
            }
        }
    }
});


// 检查舞台，删除多余的trigger
// @method checkStage
// @param t {Object} DP.Switch instance
function checkStage(_t){
    var triggerlength = _t.triggers.length,                            
        i;
                        
    // 若trigger数比翻页数更多，则移除多余的trigger，这是为了避免后端输出错误，对js造成影响
    for(i = _t.pages; i < triggerlength; ++ i){
        _t.triggers[i].dispose();
    }

    // 设置container为offsetParent，从而正确的定位和获得偏移量
    if(_t.items[0].offsetParent !== _t.container){
        _t.container.setStyle('position', 'relative');
    }
                            
};


Switch.PREFIX = 'switch/';

return Switch;

});

/**
 change log:

 TODO:
 A. plugin host, a instance of loader
 B. hirachical plugin
 C. split methods of utilities

 2011-08-01  Kael:
 - migrate to loader
 
 2010-01-05  Kael:
 - 修正一个nextBtn没有正确禁用的问题
 
 2010-12-23  Kael:
 - 处理activeIndex属性的一个问题，将其的初始化从插件里移动到本体中进行
 - 优化了plugin的调用链，优化部分性能
 - 加入autoplay
 - 修正本体中，一个计算分页值的算法错误
 */
/*!
 * module  switch
 * author  Kael Zhang
 */
 
/**
 life cycle --------->  Switch  <--------- event interface
                        ^   ^ 
                        |   |
                        |   |
 plugin host -----------|   |-------- prototype inheritance: 
                                      only allowed for methods about life cycle
 */
 
KM.define(['util/queue' /* , 'event/multi' */ ], function(K, require){

var __CONSTRUCT = '__construct',
	EVENT_BEFORE_INIT = 'beforeInit',
    EVENT_AFTER_INIT = 'afterInit',
    EVENT_BEFORE_SWITCH = 'beforeSwitch',
    EVENT_ON_SWITCH = 'switching',
    EVENT_COMPLETE_SWITCH = 'completeSwitch',
    EVENT_NAV_ENABLE = 'navEnable',
    EVENT_NAV_DISABLE = 'navDisable',
    
    PLUGIN_PREFIX = 'switch/plugin/',
    
    // style presets
    NAVITATOR_DISABLE_STYLE = {
        opacity	: .3,
        cursor	: 'default'
    },

    NAVITATOR_ENABLE_STYLE = {
        opacity	: 1,
        cursor	: ''
    },

    NOOP = function(){},
    EMPTY = '',
    
    PREV = 'prev',
    NEXT = 'next',

    Switch,
    
    // MultiEvent = require('event/multi'),
    Queue = require('util/queue');
    

function limit(num, min, max){
	return Math.min(max, Math.max(min, num));
};

function atLeastOne(num){
	return !num || num < 1 ? 1 : num;
};

/**
 * @constructor
 *
 * @usage 
 *
 * new Switch().plugin('lazyLoad', 'autoPlay'[, …]).init(options);
 *
 * if no plugin is specified, the items will plainly switched with no effect
 */
Switch = new Class({
    Implements: 'attrs events',
    
    initialize: function(){
    	var self = this,
    		bind = K.bind;
    	
    	self.fire(__CONSTRUCT);
    	
    	bind('prev', self);
    	bind('next', self);
    	bind('plugin', self);
    	bind('init', self);
    	
    	// initialization queue for dynamicly loading plugins
    	self._initializer = new Queue.Converter([
    		{
	    		method: 'plugin',
	    		
	    		// asychronously loading more plugins
	    		auto: false,
	    		
	    		// after initialization, registering new plugin is forbidden
	    		before: 'init'
	    	}, {
	    		method: 'init',
	    		
	    		// method init should be executed only once
	    		once: true
	    	},
	    	
	    	'switchTo', 'prev', 'next'
    	], self).on();
    	
    	// processing queue for switch life cycle
    	self._lifeCycle = new Queue.Runner(self._lifeCycle, self);
    },

    // @private
    // store the instance of plugin
    _plugins: [],

    // store the name of the plugins for indexing
    _plugin_names: [],
	
	/**
	 * Life Cycle
	 * key feature of switch module
	 * to extend the Switch Class into a much more complex switcher,
	 * you could override this setting, according to the api of util/asqueue
	 */
	_lifeCycle: ['_before', '_on', '_after'],
	
	
	/**
	 * filter plugins to get the ones which need to be provided
	 * @param {Array.<string, Object>} plugins
	 */
	_pendingPlugins: function(plugins){
		var plugin, i = 0, len = plugins.length,
			pending_plugins = [],
			prefix = PLUGIN_PREFIX;
			
		
		for(; i < len; i ++){
			plugin = plugins[i];
			
			if(K.isString(plugin)){
				pending_plugins.push(prefix + plugin.toLowerCase());
			}
		}
		
		return pending_plugins;
	},
	
	/**
	 * attach a plugin or plugins to the switch instance
	 * .plugin might be an asynchronous method which will be added to the end of the pending queue of Initializer
	 * @param {string|Object} arguments
	 */
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
                
                	// synchronous providing, for all plugins have been loaded
                    K.provide(PLUGIN_PREFIX + plugin.toLowerCase(), function(K, p){
                    	plugin = p;
                    });
                }

                // add plugin,
                // and if it's final, exit for-loop
                if( self._addOnePlugin(plugin) ){
                    break;
                }
            }

        }
    },
	
	/**
	 * @param {Object} plugin
	 * @return {boolean} whether is the a plugin
	 */
	_addOnePlugin: function(plugin){
		var self = this;

        // you can add a plugin only once
        if(!plugin || !plugin.name || self._plugin_names.contains(plugin.name) || self.pluginFinal){
            return;
        }
		
		// removed: dependency detection will be assigned to loader
        // if has required plugin, register that plugin first
        // if(plugin.require && arguments.callee(D.Switch.Plugins[_plugin.require]) ){
        //    return t.pluginFinal = true;
        // }

        // set plugin options before method Switch.init, so that we can override plugin options before plugin.init
        if(plugin.options){
            self.setOptions(plugin.options);
        }

        self._plugins.push(plugin);
        self._plugin_names.push(plugin.name);
        
        return plugin.final_ ? (self.pluginFinal = true) : false;
	},

   	// initialization of Switch and Switch plugins
    // @param options {object} DP.Switch options and DP.Switch.Plugins options
    init: function(options){
        var self = this,
            o,
            currentTrigger, activePage,
            plugins = self._plugins;

		self._initializer.off();

        // initialize extension: attrs
        self.setAttrs();

        // apply plugin initialization method
        plugins.each(function(plugin){
            if(plugin.init){
                plugin.init(self);
            }
        });

		['CSpre', 'containerCS', 'activePage'].forEach(function(key){
			var setting = options[key];
			
			setting && self.set(key, setting);
			delete options[key];
		});

        self.nav = {};
                
        if(self.container){
            self.fire(EVENT_BEFORE_INIT);
            
            self.set(options);

            self._itemData();
            self.fire(EVENT_AFTER_INIT);

            currentItem = self.items[activePage];

            if(currentItem && !currentItem.hasClass(o.itemOnCls)){
                self.switchTo(self.activePage, true);
            }
        }

        return self;
    },

	_itemData: function(){
		var self = this;
	
		self.length = self.items.count();
		
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
        self.pages = 1 + Math.ceil( (self.length - self.get('stage')) / self.get('move') );
	},

    // switch to a certain item
    // @param {number} index the index of the item to be switched on
    // @param {boolean} force force to switching
    switchTo: function(index, force){
        var self = this;
        
        self.force = force;
        self.expectPage = index;
        
        self._lifeCycle.run();

        return self;
    },
    
    prev: function(e){
        e && e.prevent();
        var self = this;

        // 限制 activePage 的范围
        !self.noprev && self.switchTo( limit(self.activePage - 1, 0, self.pages - 1) );
    },

    next: function(e){
        e && e.prevent();
        var self = this;

        !self.rightEnd && self.switchTo( limit(self.activePage + 1, 0, self.pages - 1) );
    },
    
    //////// life cycle start ///////////////////////////////////////////////////////////////////////////////
    _before: function(){
    	var self = this, index = self.expectPage;
    	
    	if(self.force || self.activePage !== index){
    		self.fire(EVENT_BEFORE_SWITCH, [self.activePage, index]);
    	}else{
    		self._lifeCycle.stop();
    	}
    },
    
    _on: function(){
    	this.fire(EVENT_ON_SWITCH);
    },
    
    _after: function(){
    	var counters = this.pageCounters;
    	
    	counters && counters.text(this.activePage + 1);
    },
    //////// life cycle end ///////////////////////////////////////////////////////////////////////////////
  
  
  	/**
  	 * @private
  	 --------------------------------------------------------------------------------------------------- */
  	_onEnterTrigger: function(index){
        this.triggerOn = true;
    },

    _onLeaveTrigger: function(index){
        this.triggerOn = false;
    },
    
    /**
	 * method to check the number of pages to determine whether the Switch instance meet either of the 2 ends
	 * which could be overridden for infinite carousel and step loading
	 */
    _isNoprev: function(){
    	var self = this;
    
    	return self.noprev = !self.activePage;
    },
    
    _isNonext: function(){
    	var self = this;
    	
    	return self.nonext = (self.activePage >= self.pages - 1);
    },

    // disable or enable navigation buttons
 
 	// TODO:
 	// use event instead
    _dealNavs: function(){
        var self = this;
        
        self._dealNav('prev');
        self._dealNav('next');
    },
    
    _dealNav: function(type){
    	var self = this, nav = self.nav[type], isEnd;
    
    	if(nav){
    		isEnd = self['_isNo' + type]();
    		
    		self.fire((isEnd ? EVENT_NAV_DISABLE : EVENT_NAV_ENABLE), [nav, type]);
    	}
    }
});


Class.setAttrs(Switch, {

	// stage {int} the number of items in one viewport
	stage: {
		value: 1,
		setter: atLeastOne
	},
	
	// move {int} the number of items a single switch will move
	move: {
		value: 1,
		setter: atLeastOne
	},
	
	triggerType: {
		value: 'click'
	}
	
	// CSPre {string} prefix of selectors
	// if CSPre === '#switch', then we will get previous button with $$('#switch ' + options.prev)[0]
	CSPre: {
		writeOnce: true,
		setter: function(v){
			this.CSPre = v + ' ';
		}
	},
	
	// triggerS {dom selector $$ || Mootools Elements} trigger selector of switch tabs, such as 1,2,3,4
	triggerCS: {
		setter: function(v){
			var self = this;
				
			self.triggers = $.all(self.CSPre + v).forEach(function(trigger, index){
	        	var t = self;
	        
	        	$(trigger).on(type, function(e){
	                e && e.prevent();
	                t.switchTo(index);
	
	            }).on({
	                mouseenter: function(){ t._onEnterTrigger(index); },
	                mouseleave: function(){ t._onLeaveTrigger(index); }
	            });
	        
	        }, true);
		}
	},
	 		
	triggerOnCls: {
		value: EMPTY
	},
	
	countCS: {
		setter: function(v){
			this.pageCounters = $.all(this.CSPre + v);
		}
	},
	
	// container, prev, next {dom selector $$[0] || Mootools Element} 
	containerCS: {
		setter: function(v){
			this.container = $(this.CSPre + v);
		}
	},
	
	prevCS: {
		setter: function(v){
			var self = this, PREV = 'prev';
			
			self.nav[PREV] = $.all(self.CSPre + v).on(self.triggerType, self[PREV]);
		}
	},
	
	nextCS: {
		setter: function(v){
			var self = this, NEXT = 'next';
			
			self.nav[NEXT] = $.all(self.CSPre + v).on(self.triggerType, self[NEXT]);
		}
	},
	
	// items will be fetched by container.getElements()
	itemCS: {
		setter: function(v){
			var self = this;
			
			self.items = self.container.all(self.CSPre + v);
		}
	},
	
	itemOnCls: {
		value: EMPTY
	},
	
	// the index of the first items activated when initializing
	activePage: {
		value: 0,
		setter: function(v){
			this.activePage = !v || v < 0 ? 0 : v;
		}
	},
	
	onNavEnable: {
		value: function(btn, which){
			btn && btn.css(NAVITATOR_ENABLE_STYLE);
		}
	},
	
	onNavDisable: {
		value: function(btn, which){
			btn && btn.css(NAVITATOR_DISABLE_STYLE);
		}
	}

});


Switch.EVENTS = {
	__CONSTRUCT		: __CONSTRUCT,
	BEFORE_INIT		: EVENT_BEFORE_INIT,
    AFTER_INIT		: EVENT_AFTER_INIT,
    BEFORE_SWITCH	: EVENT_BEFORE_SWITCH,
    ON_SWITCH		: EVENT_ON_SWITCH,
    COMPLETE_SWITCH	: EVENT_COMPLETE_SWITCH
};


return Switch;

});

/**
 change log:
 2011-08-15  Kael:
 
 TODO:
 A. add method .addItem .addTrigger
 B. [issue] when there's only one page, the status of prev button is incorrect
 C. add plugin cfg support for configuring the base paths of modules
 
 2011-08-11  Kael:
 - add support to multiple prev and next button
 - split several methods, add ._itemData, ._isLeftEnd, ._isRightEnd
 
 2011-08-10  Kael:
 - TODO[08.09].[B,D]
 
 2011-08-09  Kael:
 - complete the whole life cycle
 
 TODO:
 A. add multi-event support
 √ B. add event interface of onActive and onDeactive
 C. dom santitizer for all plugins
 √ D. manage all event method and names of switch core and plugins
 
 2011-08-08  Kael:
 - complete ASQueue.Converter and ASQueue.Runner. TODO[08-07].A
 
 2011-08-07  Kael:
 TODO:
 √ A. ASQ	
 		ASQueue::convert, method to convert the exist methods as ASQueue methods
 		ASQueue::run, method to run a specific list of methods
 
 2011-08-05  Kael:
 - migrate all of the current plugins to loader
 - add Initializer (instead of TODO[08.01].[A,B])
 	1. which can dynamically load dependencies and plugins
 	2. is a pending queue for async and sync methods
 - enhance the stability of the lazy-load plugin

 2011-08-01  Kael:
 - migrate to loader
 
 TODO:
 √ A. plugin host, a instance of loader
 √ B. hirachical plugin
 C. split methods of utilities
 D. if the 'before' property is defined, the method will be emptied after the terminator executed
 E. Initializer: allow parallelly executing many methods of the same type
 F. deal with the letter case of plugin names
 
 2010-02-23  Kael:
 - 处理activePage属性的一个问题，将其的初始化从插件里移动到本体中进行
 - 优化了plugin的调用链，优化部分性能
 - 加入autoplay
 - 修正本体中，一个计算分页值的算法错误
 
 2010-01-05  Kael:
 - 修正一个nextBtn没有正确禁用的问题
 
 2009-10-20  Kael:
 - 主体方法
 */
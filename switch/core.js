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
                                      only allowd for methods about life cycle
 */
 
KM.define(['util/asqueue' /* , 'event/multi' */ ], function(K, require){


// the event name of __CONSTRUCT begins with 2 underscores, 
// preventing user from configuring __CONSTRUCT event by Switch options
var __CONSTRUCT = '__construct',
	EVENT_BEFORE_INIT = 'beforeInit',
    EVENT_AFTER_INIT = 'afterInit',
    EVENT_BEFORE_SWITCH = 'beforeSwitch',
    EVENT_ON_SWITCH = 'switching',
    EVENT_COMPLETE_SWITCH = 'completeSwitch',
    EVENT_NAV_ENABLE = 'navEnable',
    EVENT_NAV_DISABLE = 'navDisable',
    
    PLUGIN_PREFIX = 'switch/plugin/',
    
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

    Switch,
    // MultiEvent = require('event/multi'),
    ASQueue = require('util/asqueue');

  
function getNoEmptyElements(CS){
	var elements = $$(CS);
	
	return elements.length ? elements : null;
};

function limit(num, min, max){
	return Math.min(max, Math.max(min, num));
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
    Implements: [Options, Events],

    options: {
        // stage {int} the number of items in one viewport
        stage: 1,

        // move {int} the number of items a single switch will move
        move: 1,

        triggerType: 	'click',

        // CSPre {string} prefix of selectors
        // if CSPre === '#switch', then we will get previous button with $$('#switch ' + options.prev)[0]
        CSPre: 			EMPTY,

        // triggerS {dom selector $$ || Mootools Elements} trigger selector of switch tabs, such as 1,2,3,4
        triggerCS: 		EMPTY, 		// '.trigger',
        triggerOnCls: 	EMPTY, 		// 'Jtrigger-on',

        countCS: 		EMPTY, 		// '.page-count',

        // container, prev, next {dom selector $$[0] || Mootools Element} 
        containerCS: 	EMPTY, 		// '.switch-track',
        prevCS: 		EMPTY, 		// '.prev',
        nextCS: 		EMPTY, 		// '.next',

        // items will be fetched by container.getElements()
        itemCS: 		EMPTY, 		// 'li',
        itemOnCls: 		EMPTY, 		// 'J_cont-on',

        // the index of the first items activated when initializing
        activeIndex: 	0,
        
        onNavEnable:	function(btn, which){
        	btn.setStyles(NAVITATOR_ENABLE_STYLE);
        },
        
        onNavDisable:	function(btn, which){
        	btn.setStyles(NAVITATOR_DISABLE_STYLE);
        }
    },
    
    initialize: function(){
    	var self = this,
    		bind = K.bind;
    	
    	self.fireEvent(__CONSTRUCT);
    	
    	bind('prev', self);
    	bind('next', self);
    	bind('plugin', self);
    	bind('init', self);
    	
    	// initialization queue for dynamicly loading plugins
    	self._initializer = new ASQueue.Converter([
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
    	self._lifeCycle = new ASQueue.Runner(self._lifeCycle, self);
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
            currentTrigger, activeIndex,
            plugins = self._plugins;

		self._initializer.off();

        // we can override plugin options here
        self.setOptions(options);
        o = self.options;

        if(o.CSPre){
            o.CSPre = String(o.CSPre).trim() + ' ';
        }

        // apply plugin initialization method
        plugins.each(function(plugin){
            if(plugin.init){
                plugin.init(self);
            }
        });

        self._initEvent();

        // however, the container should be found first
        self.container = $$(o.CSPre + o.containerCS)[0];
                
        if(self.container){
            activeIndex = self.activeIndex = o.activeIndex || 0;

            self.fireEvent(EVENT_BEFORE_INIT);

            self._initDom();
            self._bindNav();
            self.fireEvent(EVENT_AFTER_INIT);

            currentItem = self.items[activeIndex];

            if(currentItem && !currentItem.hasClass(o.itemOnCls)){
                self.switchTo(activeIndex, true);
            }
        }

        return self;
    },

    /**
     * initialize DOM
     *
     */
    _initDom: function(){
        var self = this,
            o = self.options,
            pre = o.CSPre,
            nav = self.nav = {};

        self.items = self.container.getElements(o.itemCS);
        self.triggers = o.triggerCS ? $$(pre + o.triggerCS) : [];
        self.pageCounters = o.countCS ? getNoEmptyElements(pre + o.countCS) : null;

		
        o.prevCS && (nav.prev = getNoEmptyElements(pre + o.prevCS));
        o.nextCS && (nav.next = getNoEmptyElements(pre + o.nextCS));
        
        self._itemData();
    },

	_itemData: function(){
		var self = this, o = self.options;
	
		self.length = self.items.length;
		
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
        self.pages = 1 + Math.ceil( (self.length - o.stage) / (o.move || 1) );
	},

	// _checkPages: function(){
	//	if(self.pages < 2){
    //        self.noprev = self.rightEnd = true;
    //    }
	// },

    // bind navgators and triggers
    _bindNav: function(){
        var self = this,
            o = self.options,
            nav = self.nav,
            type = o.triggerType,
            i = 0,
            len = self.triggers.length,
            trigger;
            
        nav.prev && nav.prev.addEvent(type, self.prev);
        nav.next && nav.next.addEvent(type, self.next);

        for(; i < len; ++ i){

            // use closure to store i
            (function(index){
                var t = self;

                trigger = t.triggers[index];

                trigger.addEvent(type, function(e){
                    e && e.preventDefault();
                    t.switchTo(index);

                }).addEvents({
                    mouseenter: function(){ t._onEnterTrigger(index); },
                    mouseleave: function(){ t._onLeaveTrigger(index); }
                });

            })(i);
        };

//        self.container.addEvents({
//            mouse enter: function(){ self.hoverOn = true; },
//            mouse leave: function(){ self.hoverOn = false; }
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
    // @param {number} index the index of the item to be switched on
    // @param {boolean} force force to switching
    switchTo: function(index, force){
        var self = this;
        
        self.force = force;
        self.expectIndex = index;
        
        self._lifeCycle.run();

        return self;
    },
    
    //////// life cycle start ///////////////////////////////////////////////////////////////////////////////
    _before: function(){
    	var self = this, index = self.expectIndex;
    	
    	if(self.force || self.activeIndex !== index){
    		self.fireEvent(EVENT_BEFORE_SWITCH, [self.activeIndex, index]);
    	}else{
    		self._lifeCycle.stop();
    	}
    },
    
    _on: function(){
    	this.fireEvent(EVENT_ON_SWITCH);
    },
    
    _after: function(){
    	var self = this;
    	
    	self.pageCounters && self.pageCounters.set('text', self.activeIndex + 1);
    },
    //////// life cycle end ///////////////////////////////////////////////////////////////////////////////

    prev: function(e){
        e && e.preventDefault();
        var self = this;

        // 限制 activeIndex 的范围
        !self.noprev && self.switchTo( limit(self.activeIndex - 1, 0, self.pages - 1) );
    },

    next: function(e){
        e && e.preventDefault();
        var self = this;

        !self.rightEnd && self.switchTo( limit(self.activeIndex + 1, 0, self.pages - 1) );
    },
    
    
    /**
	 * method to check the number of pages to determine whether the Switch instance meet either of the 2 ends
	 * which could be overridden for infinite carousel and step loading
	 */
    _isNoprev: function(){
    	var self = this;
    
    	return self.noprev = !self.activeIndex;
    },
    
    _isNonext: function(){
    	var self = this;
    	
    	return self.nonext = (self.activeIndex >= self.pages - 1);
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
    		
    		self.fireEvent((isEnd ? EVENT_NAV_DISABLE : EVENT_NAV_ENABLE), [nav, type]);
    	}
    },
    
    get: function(key){
    	return this.constructor[key];
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
 - 处理activeIndex属性的一个问题，将其的初始化从插件里移动到本体中进行
 - 优化了plugin的调用链，优化部分性能
 - 加入autoplay
 - 修正本体中，一个计算分页值的算法错误
 
 2010-01-05  Kael:
 - 修正一个nextBtn没有正确禁用的问题
 
 2009-10-20  Kael:
 - 主体方法
 */
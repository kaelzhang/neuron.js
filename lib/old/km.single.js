/**
 * Kael.Me Top banner position ctrl
 */

KM.topCtrl = function(panel, top, btn, autoOpen){
	panel = $(panel);
	top = $(top);
	btn = $(btn);
	
	var toOpen = false,
	
		fx = new Fx.Tween(panel, {property: 'top', 'link': 'cancel', duration: 300, onComplete: function(){
			if(!toOpen){
				btn.removeClass('J_panel-open');
			}
		}}),
	
		down = function(){
			toOpen = true;
			fx.start(0);
			btn.addClass('J_panel-open');
		},
		
		up = function(){
			toOpen = false;
			fx.start(-105);
		},
		
		ctrl = KM.multiEvent(
			up, 
			down, 
			[{ele: panel, ev: 'mouseleave'}, {ele: top, ev: 'mouseleave'}], 
			[{ele: btn, ev: 'mouseenter'}, {ele: panel, ev: 'mouseenter'}, {ele: top, ev: 'mouseenter'}]
		),
		
		_open = function(){
			ctrl.cancel();
			down();
		},
		
		_close = function(){
			ctrl.resume();
			up();
		},
		
		_set = function(){
			return window.getScroll().y === 0 ? _open() : _close();
		},
		
		bind = function(){
			var self = arguments.callee;
			if(self.binded) return;
			
			window.addEvent('scroll', _set);
			self.binded = true;
		}
	
	if(autoOpen){
		bind();
		_set();
	}
	
	return {
		bind: bind,
		down: down
	}
}


/**
 * Kael.Me Tab Switchable
 * @constructor
 * @need KM.Crsl
 */
KM.TabSwitch = new Class({
	Implements: [Options, Events],					 
						 
	options: {
		ajax: true,
		url: 'handler.x',
		contClass: 'track',
		onSwitch: $empty,
		onComplete: $empty
	},
						 
	// @param {selector} tabs: switch trigger
	// @param {selector} wrap: parent of the carousel element
	initialize: function(tabs, wrap, options){
		var self = this;
		
		this.setOptions(options);
		
		this.tabs = $$(tabs);
		this.wrap = $j(wrap);

		this.cont = this.wrap.getElement('.' + this.options.contClass);
		
		this.switch_ = this.switch_.bind(this);
		
		this.tabs.each(function(el, index){
			var link = el.getElement('a');			
			
			if(el.hasClass('this')){
				self.tab = el.store('cont', self.cont)
					.store('crsl', new KM.Crsl({tk:'#top-toggle .track', tn:'#top-toggle .train', cr:'.train li', pv:'#top-toggle .prev', nt:'#top-toggle .next', altKey:0}) );
			}
			
			link.addEvent('click', function(e){
				e.preventDefault();
				self.switch_(el, link.get('href'));
			});
		});
	},
	
	switch_: function(el, link){
		if(this.tab === el) return;
		
		var cont = el.retrieve('cont'),
			self = this,
			complete = function(cont){
				var crsl;
				
				self.tab && self.tab.removeClass('this').retrieve('crsl').cancel();
				self.tab = el.addClass('this');
				
				self.change(cont);
				
				// create new instance of KM.Crsl, or resume it
				crsl = self.tab.retrieve('crsl');
				if(crsl) crsl.resume();
				else{
					self.tab.store('crsl', new KM.Crsl({tk:'#top-toggle .track', tn:'#top-toggle .train', cr:'.train li', pv:'#top-toggle .prev', nt:'#top-toggle .next', altKey:0}) );
				}
				
				self.fireEvent('complete');
			};

		if(cont) complete(cont, true);
		else{

			var data = $extend({type: link.split('=')[1], a: 'list'}, {limit: KM.query.limit, thumb: KM.query.thumb});
			
			new KM.Request({
				url: this.options.url,
				data: data,
				onRequest: function(){
					self.cont.set('opacity', .5);
					KM.loading.show('top');
				},
				
				onSuccess: function(rt){
					if(rt.html){
						var _cont = new Element('div', {'class': self.options.contClass, 'html': rt.html}),
							ul = _cont.getElement('ul');
	
						self.cont.set('opacity', 1);
						KM.loading.hide('top');
						
						ul && complete(_cont);
					}
				},
				
				onError: function(){
					self.cont.set('opacity', 1);
					KM.loading.hide('top');
				}
			}).send();
		}
	},

	change: function(cont, notStore){
		this.cont.dispose();
		
		// so that the new this.cont will be a different one
		this.cont = new Element(cont);
		cont.inject(this.wrap);
		!notStore && this.tab.store('cont', this.cont);
		
		this.fireEvent('switch');
	}
	
});
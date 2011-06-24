/*Kael.Me Slideshow
------------------------------------------------*/
KM.Crsl = new Class({
					 
	Implements: Options,
					 
	options:{
	/*
		tk : track,
		tn : train,
		cr : carriage,
		pv : prevBtn,
		nt : nextBtn
	*/
		duration: 300,
		platforms: 10,
		fade: 0.2,
		mousewheel: true,
		altKey: true
	},
					 
	
	initialize: function(options){
		this.setOptions(options);

		this.prev = this._prev.bind(this);
		this.next = this._next.bind(this);
		this.onSlide = this._onSlide.bind(this);
		this.postSlide = this._postSlide.bind(this);
		
		this.construct();
		this.init();
		if(this.options.mousewheel) this.bindWheel();
	},
	
	//construct the dom
	construct: function(){
		this.track = $j(this.options.tk);
		this.train = $j(this.options.tn);
		this.carriage = $j(this.options.cr);
		this.prevBtn = $j(this.options.pv);
		this.nextBtn = $j(this.options.nt);
		
		this.cur = this.former = 0;
		this.carriages = this.carriage.length;
		this.max = this.carriages - this.options.platforms;
	},
	
	//init slide method and bind events
	init: function(){
		this.dealBtn();
		this.slide = new Fx.Tween( this.train, {
			//transition: Fx.Transitions.Back.easeIn,
			property: 'left',
			duration: this.options.duration,
			onComplete: this.postSlide
		});
	},
	
	bindWheel: function(){
		var _scroll = function(e){
			//ctrl + mousewheel event can't be stopped in Chrome, so use altKey instead
			if(this.options.altKey && !e.alt) return;
			e.stop();
			if(e.wheel < 0) this.setPos();
			else this.setPos(true);
			
		}.bind(this);
		
		this.track.addEvent('mousewheel', _scroll);
	},
	
	dealBtn: function(){
		this.cur ? this.enableBtn( this.prevBtn, true ) : this.disableBtn( this.prevBtn );
		this.cur < this.max ? this.enableBtn( this.nextBtn ) : this.disableBtn( this.nextBtn );
		return this;
	},
	
	enableBtn: function( btn, isPrev ){
		if( isPrev ) btn.addEvent('click', this.prev );
		else btn.addEvent('click', this.next );
		
		btn.setStyle('opacity', 1 ).removeClass('disable');
	},
	
	disableBtn: function( btn ){
		btn.removeEvents('click').setStyle('opacity', this.options.fade ).addClass('disable');
	},
	
	disableStyleAll: function(){
		this.prevBtn.addClass('disable');
		this.nextBtn.addClass('disable');
	},
	
	_prev: function(e){
		e && e.preventDefault();
		this.setPos(true);
	},
	
	_next: function(e){
		e && e.preventDefault();
		this.setPos();
	},
	
	setPos: function( isPrev ){
		if(this.sliding || this.stop) return;
		
		if(isPrev){
			if(this.cur < 1) return;
			-- this.cur;
		}else{
			if(this.cur >= this.max ) return;
			++ this.cur;
		}
		
		this.sliding = true;
		this.preSlide();
	},

	preSlide: function(){
		this.onSlide();
		this.dealBtn();
		this.disableStyleAll();
	},
	
	_onSlide: function(){
		this.slide.start( -this.carriage[this.cur].getPosition(this.train).x );
	},
	
	_postSlide: function(){
		this.former = this.cur;
		this.sliding = false;
		this.dealBtn();
	},
	
	cancel: function(){
		this.stop = true;
		return this;
	},
	
	resume: function(){
		this.stop = false;
		
		// prevent that several instance of KM.Crsl will use a same navigation btn simultaneously
		return this.dealBtn();
	}
});

KM.TranCrsl = new Class({
	Implements: KM.Crsl,
	
	options:{
		transition: Fx.Transitions.Circ.easeOut,
		
		max_width:740,
		max_height: Number.POSITIVE_INFINITY,
		min_width: 1,
		min_height: 300
		
	},
	
	init: function(){
		this.cover = $j(this.options.cv);
		
		this.train.fix();
		this.fx = {
			resize: new Fx.Morph( this.train, {
				transition: this.options.transition,
				duration: this.options.duration,
				onComplete: this.endSlide.bind(this)
			}),
			
			fade: new Fx.Tween( this.cover, {
				property: 'opacity',
				onComplete: this.postSlide
			})
		};
		
		this.dealBtn();
	},
	
	preSlide: function(){
		var image = new KM.imgLoader(this.carriage[this.cur].get('src'), {
			onload: this.onSlide
		});
		
		this.curImage = image;
		this.dealBtn();
		this.disableStyleAll();
	},
	
	_onSlide: function(){
		this.carriage[this.former].hide();
		this.cover.setStyle('opacity', 1).show();
		
		var _w = this.curImage.width || 1, // prevent zero
			w = _w.limit(this.options.min_width, this.options.max_width),
			h = (this.curImage.height * (w / _w)).limit(this.options.min_height, this.options.max_height);
		
		this.fx.resize.start({
			'width': w,
			'height': h							 
		});
		
		this.carriage[this.cur].setStyles({
			'width': w,
			'height': h							 
		});
	},
	
	endSlide: function(){
		this.carriage[this.cur].show();
		this.fx.fade.start(0);
	}
});
/*Kael.Me Plan class
 *
 *unlike Robert Penner's easing equations, Kael.Me Plan Class deal with the offset concerning to the time.
 *not only animations, this class is a time plan for any functions
 *y-axis is the argument of the function, x-axis is time
----------------------------------------------------*/
KM.Plan = new Class({
	
	Implements: [Options, Events],
	
	options: {
		
		/*onStart: $empty,
		onCancel: $empty,
		onComplete: $empty,*/
		
		fps: 50,  // frame per second, i.e. how many this.options.props per second
		prop: 1, // one frame equal to <prop> seconds, proportion of time-axis in offset formula
		
		begin: 0, //ms
		end: 500, //ms
		
		//method: null,
		//func
		
	},
	
	initialize: function(func, options){
		if( $type(func) != 'function' ) return;
		
		this.func = func;
		this.setOptions(options);
		
		this.periodical = Math.round(1000 / this.options.fps);
		this.options.end < 0 && (this.options.end = false);
		this.num = this.options.method.length;
		
		
		//bind this-pointer for all external methods
		this.start = this._start.bind(this);
		this.cancel = this._cancel.bind(this);
		this.pause = this._pause.bind(this);
		this.resume = this._resume.bind(this);
		this.complete = this._complete.bind(this);
		
		//use setTimeout or setInterval will reset the default this-pointer to 'window'
		//so bind before use
		this.step = this._step.bind(this);
	},
	
	_step: function(){
		this.time = $time() - this.time;
		
		if( !this.options.end || this.time < this.options.end ){
			this.func.run( this.getArgs() );
			!this.stop && this.startTimer();
		}
		else{
			this.time = this.options.end;
			this.func.run( this.getArgs() );
			this.complete();
		}
	},
	
	getArgs: function(){
		var ret = [], time = this.time * this.options.prop;
		for(var i = 0; i < this.num; i ++ ){
			ret.push( this.options.method[i]( time ) );
		}
		
		//return the computed arguments
		return ret;
	},
	
	_start: function(){
		if(this.timer) return;

		this.time = this.options.begin;
		this.startTimer();
		this.onStart();
	},
	
	_cancel: function(){
		if (this.stopTimer()) this.onCancel();
		return this;
	},
	
	//what's coming...
	_pause: function(){
	},
	
	_resume: function(){
	},
	
	_complete: function(){
		if (this.stopTimer()) this.onComplete();
		return this;
	},
	
	onStart: function(){
		this.fireEvent('start', this);
	},
	
	onCancel: function(){
		this.fireEvent('cancel', this);
	},
	
	onComplete: function(){
		this.fireEvent('complete', this);
	},
	
	stopTimer: function(){
		if(this.timer) this.timer = $clear(this.timer);
		return this.stop = true;
	},
	
	startTimer: function(){
		if(this.timer) this.timer = $clear(this.timer);
		this.time = $time() - this.time;

		this.timer = setTimeout(this.step, this.periodical);
	}
});
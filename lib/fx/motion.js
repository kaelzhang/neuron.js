/**
 * module fx/motion
 *
 * unlike Robert Penner's easing equations,  fx/motion deal with the offset concerning to the time.
 * not only animations, this class is a time plan for any functions
 * y-axis is the argument of the function, x-axis is time
 */

NR.define([], function(K){

var

Motion = K.Class({
	
	Implements: 'events options',
	
	/**
	 * @param {function()} onMotion
	 * @param {(Array.<function()>)|function()} equations
	 * @param {Object} options
	 */
	initialize: function(onMotion, equations, options){
		if(!K.isFunction(onMotion)) return;
		
		var self = this,
			bind = K.bind;
		
		self.set(options);
		
		self.fn = onMotion;
		self.eq = K.makeArray(equations);
		
		self.num = self.eq.length;
		
		self._setPeriodical(self.get('fps'));
		
		bind('_step', self);
		
		self.timer = K.delay(self._step, self.periodical, true);
	},
	
	
	_setPeriodical: function(fps){
		self.periodical = Math.round(1000 / fps);
		return fps;
	},
	
	_step: function(){
		var self = this,
			end = self.get('end');
	
		self.time += + new Date - self.ts;
		
		if( !end || self.time < end ){
			self._motion();
			
			/**
			 * set the timing timestamp when a single frame completed
			 * so that timer would not be affected by the executing of user functions and efficiency
			 */
			self.ts = + new Date;
		}else{
			self.time = end;
			self._motion();
			self.complete();
		}
	},
	
	_motion: function(){
		var self = this,
			args = self._getArgs();
		
		self.fn.apply(self, args);
	},
	
	_getArgs: function(){
		var self = this,
			ret = [], 
			time = self.time * self.get('prop'),
			i = 0, len = self.num;
			
		for(; i < len; i ++ ){
			ret.push( self.eq[i]( time ) );
		}
		
		//return the computed arguments
		return ret;
	},
	
	start: function(){
		var self = this;
		
		if(!self.timer.id){
			self.time = self.get('begin');
			
			self._startTimer();
			self.fireEvent('start');
		}
		
		return self;
	},
	
	cancel: function(){
		this._stopTimer().fireEvent('cancel');
		
		return this;
	},
	
	//what's coming...
	pause: function(){
		this._stopTimer().fireEvent('pause');
		return this;
	},
	
	resume: function(){
		this._startTimer().fireEvent('resume');
		return this;
	},
	
	complete: function(){
		this._stopTimer().fireEvent('complete');
		return this;
	},
	
	_stopTimer: function(){
		this.timer.cancel();
		return this;
	},
	
	_startTimer: function(){
		var self = this;
		
		// timestamp
		self.ts = + new Date;
		self.timer.start();
		
		return self;
	}
});

K.Class.setAttrs({
		
	// frame per second, i.e. how many this.options.props per second
	fps: {
		value: 50,
		setter: '_setPeriodical'
	},
	
	// one frame equal to <prop> miniseconds, proportion of time-axis in offset formula
	prop: {
		value: 1
	}, 
	
	begin: {
		value: 0,
		validator: K.isNumber
		
	},
	
	end: {
		value: 500,
		validator: K.isNumber,
		setter: function(v){
			return v < 0 ? 0 : v;
		}
		
	}
});


return Motion;

});
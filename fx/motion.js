/**
 * module fx/motion
 *
 * unlike Robert Penner's easing equations,  fx/motion deal with the offset concerning to the time.
 * not only animations, this class is a time plan for any functions
 * y-axis is the argument of the function, x-axis is time
 */

KM.define([], function(K){

return new Class({
	
	Implements: [Options, Events],
	
	options: {
		
		// onStart: $empty,
		// onCancel: $empty,
		// onComplete: $empty,
		
		// frame per second, i.e. how many this.options.props per second
		fps: 50,
		
		// one frame equal to <prop> miniseconds, proportion of time-axis in offset formula
		prop: 1, 
		
		begin: 0, // ms
		end: 500  // ms
	},
	
	/**
	 * @param {function()} onMotion
	 * @param {(Array.<function()>)|function()} equations
	 * @param {Object} options
	 */
	initialize: function(onMotion, equations, options){
		if( !K.isFunction(onMotion) ) return;
		
		var self = this,
			bind = K.bind,
			o = self.setOptions(options);
		
		self.fn = onMotion;
		self.eq = K.makeArray(equations);
		
		
		
		self.periodical = Math.round(1000 / this.options.fps);
		
		o.end < 0 && (o.end = 0);
		self.num = self.eq.length;
		
		bind('_step', self);
		
		self.timer = K.delay(self._step, self.periodical, true);
	},
	
	_step: function(){
		var self = this,
			o = self.options;
	
		self.time = + new Date - self.time;
		
		if( !o.end || self.time < o.end ){
			self._motion();
		}else{
			self.time = o.end;
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
			time = self.time * self.options.prop,
			i = 0, len = self.num;
			
		for(; i < len; i ++ ){
			ret.push( self.eq[i]( time ) );
		}
		
		//return the computed arguments
		return ret;
	},
	
	start: function(){
		var self = this;
		
		if(self.timer.id) return;

		self.time = self.options.begin;
		self._startTimer();
		self.fireEvent('start');
	},
	
	cancel: function(){
		this._stopTimer().fireEvent('cancel');
		
		return this;
	},
	
	//what's coming...
	pause: function(){
		this._stopTimer().fireEvent('onPause');
		return this;
	},
	
	resume: function(){
		this._stopTimer().fireEvent('onResume');
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
	
		self.time = + new Date - self.time;
		self.timer.start();
		
		return self;
	}
});

});
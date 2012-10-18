/**
 * @param {Array.<Fx>} list list of Fx instances
 */
function loop(list){
	var now = + new Date,
		len = list.length,
		instance;
		
	while(len --){
		if (instance = list[len]){
			instance._step(now);
		}
	}
};


/**
 * add system clock frequency
 * @param {Fx} instance
 * @param {number} fps
 * @param {boolean=} fps 
 */
function addOrRemoveClockTicking(instance, fps, toAdd){
	var list = _instances[fps] || (_instances[fps] = []),
		timer = _timers[fps],
		i = 0,
		len = list.length;
		
	if(toAdd){
		list.push(instance);
		
		if(!timer){
			_timers[fps] = setInterval(function(){
				loop(list);
			}, Math.round(1000 / fps));
		}
	}else{
		for(; i < len; i ++){
			if(list[i] === instance){
				list.splice(i, 1);
			}
		}
		
		if(!list.length && timer){
			_timers[fps] = clearInterval(timer);
		}
	}
};


var

// map:  fps -> Array.<Fx instance> 
_instances = {},

// map:  fps -> timer
_timers = {},

META_LINK_WRAPPER = {
	cancel: function(fn){
		return function(){
			this.cancel();
			fn.apply(this, arguments);
		};
	},
	
	chain: function(fn){
		var self = this,
			queue = self.__queue,
			running;
			
		function next(){
			var args = queue.shift();
			
			running = false;
			if(args){
				running = true;
				run(args);
			}
		};
		
		function run(args){
			fn.apply(args);
		};
		
		function add(args){
			running ? queue.push(args) : run(args);
		};
	
		self.on('complete', next);
	
		return function(){
			add(arguments);
			return self;
		};
	},
	
	ignore: function(fn){
		return function(){
			!this._isRunning() && fn.apply(this, arguments);
		}
	}
},


Fx = NR.Class({
	Implements: 'events attrs',

	initialize: function(options){
		var self = this,
			start = self.start;
	
		self.subject = self.subject || self;
		self.set(options);
		
		self.frameSkip = self.get('frameSkip');
		
		self.start = META_LINK_WRAPPER[self.get('link')].call(this, start);
	},
	
	__queue: [],

	_step: function(now){
		var self = this;
	
		if (self.frameSkip){
			var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
			
			self.time = now;
			self.frame += frames;
			
		} else {
			self.frame ++;
		}
		
		if (self.frame < self.frames){
			var progress = self._transition(self.frame / self.frames),
				now = self._compute(self.from, self.to, progress);
				
			self._set(now);
			
			self.fire('step', [now]);
			
		} else {
			self.frame = self.frames;
			self._set(self._compute(self.from, self.to, 1));
			
			self.stop();
		}
	},

	_set: function(now){
		return now;
	},

	_compute: function(from, to, progress){
		return Fx.compute(from, to, progress);
	},

	_isRunning: function(){
		var list = _instances[this.get('fps')];
		return list && list.indexOf(this) !== -1;
	},

	start: function(from, to){
		var self = this;
		
		self.from = from;
		self.to = to;
		self.frame = self.frameSkip ? 0 : -1;
		self.time = null;
		self._transition = self.get('transition');
		
		var frames = self.get('frames'),
			fps = self.get('fps'),
			duration = self.get('duration');
		
		self.duration = duration;
		self.frameInterval = 1000 / fps;
		self.frames = frames || Math.round( duration / self.frameInterval);
		self.fire('start', self.subject);
		
		addOrRemoveClockTicking(self, fps, true);
		
		return self;
	},
	
	stop: function(){
		var self = this;
		
		if (self._isRunning()){
			self.time = null;
			
			self.__queue.length = 0;
			
			addOrRemoveClockTicking(self, self.get('fps'));
			
			if (self.frames === self.frame){
				self.fire('complete', self.subject);
				
			} else {
				self.fire('stop', self.subject);
			}
		}
		
		return self;
	},
	
	cancel: function(){
		var self = this;
	
		if (self._isRunning()){
			self.time = null;
			
			addOrRemoveClockTicking(self, self.get('fps'));
			
			self.frame = self.frames;
			
			self.fire('cancel', self.subject);
		}
		
		return self;
	},
	
	pause: function(){
		var self = this;
	
		if (self._isRunning()){
			self.time = null;
			addOrRemoveClockTicking(self, self.get('fps'));
		}
		
		return self;
	},
	
	resume: function(){
		var self = this;

		self.frame < self.frames && !self._isRunning() && addOrRemoveClockTicking(self, self.get('fps'), true);
		return self;
	}

}, {
	fps: {
		writeOnce: true,
		value: 60
	},
	
	unit: {
		value: false
	},
	
	duration: {
		value: 500
	},
	
	frames: {
		writeOnce: true,
		value: null
	},
	
	frameSkip: {
		value: true
	},
	
	link: {
		value: 'ignore'
	},
	
	property: {
		setter: function(v){
			this.property = v;
		}
	},
	
	transition: {
		value: function(p){
			return - ( Math.cos( Math.PI * p ) - 1) / 2;
		}
	}
});


Fx.compute = function(from, to, progress){
	return (to - from) * progress + from;
};


module.exports = Fx;

/**
 2011-10-09  Kael
 - migrate to Neuron

 TODO:
 A. CSS3 transition support
 B. chain support
 
 */
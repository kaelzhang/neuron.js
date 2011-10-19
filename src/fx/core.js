KM.define([], function(K){

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


function addOrRemoveClockTicking(instance, fps, toAdd){
	var list = _instances[fps] || (_instances[fps] = []),
		timers = _timers,
		timer = timers[fps],
		i = 0,
		len = list.length;
		
	if(toAdd){
		list.push(instance);
		
		if(!timer){
			timers[fps] = setInterval(function(){ console.log('loop', fps)
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
			timers[fps] = clearInterval(timer);
		}
	}
};


var

_instances = {},

_timers = {},

Fx = K.Class({

	Implements: 'events attrs',

	initialize: function(options){ console.log('fx init called', options, this.subject)
		var self = this;
	
		self.subject = self.subject || self;
		self.setAttrs(options);
		
		self.frameSkip = self.get('frameSkip');
	},

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
			var delta = self._transition(self.frame / self.frames),
				now = self._compute(self.from, self.to, delta);
				
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

	_compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	_check: function(){
		var self = this, args = arguments;
	
		if (!self._isRunning()) return true;
		switch (self.get('link')){
			case 'cancel': self.cancel(); return true;
			case 'chain': self.chain(function(){
				return self.caller.apply(self, args);
			}); return false;
		}
		return false;
	},

	_isRunning: function(){
		var list = _instances[this.get('fps')];
		return list && list.indexOf(this) !== -1;
	},

	start: function(from, to){
		var self = this;
	
		if (self._check(from, to)){
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
			
			addOrRemoveClockTicking.call(self, fps, true);
		}
		
		return this;
	},
	
	stop: function(){
		var self = this;
		
		if (self._isRunning()){
			self.time = null;
			
			addOrRemoveClockTicking.call(self, self.get('fps'));
			
			if (self.frames === self.frame){
				self.fire('complete', self.subject);
				
			} else {
				self.fire('stop', self.subject);
			}
		}
		
		return self;
	},
	
	cancel: function(){
		if (self._isRunning()){
			self.time = null;
			
			addOrRemoveClockTicking.call(self, self.get('fps'));
			
			self.frame = self.frames;
			
			self.fire('cancel', self.subject).clearChain();
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

});


K.Class.setAttrs(Fx, {
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


Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};


return Fx;

});

/**
 TODO:
 A. CSS3 transition support
 
 
 */
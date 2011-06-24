KM.index = {
	init: function( box, r, origin ){
		this.box = $j(box);
		this.r = r;
		this.origin = origin;
		
		new KM.Images('/s/i/index-logo.png', '/s/i/item-top.png', '/s/i/item-bot.png', '/s/i/s.png', this._init.bind(this) );
	},

	_init: function(){
		var self = this,
			methodX = this._method.x.bind(this),
			methodY = this._method.y.bind(this),
			func = this._func.bind(this),
			complete = this._complete.bind(this),

			prop = .004,
			end = .93 * Math.PI / prop,
			delay = 300,
			per = 4;
		
		this.box.each(function(box, i){
			box.setStyles({
				'left': self.origin.x,
				'top': self.origin.y,
				'opacity': 0,
				'display': 'block'
			});
			
			var last = end - i * Math.PI / prop / per,
				circ = new KM.Plan(
					func(i), {
						method: [ methodX, methodY ],
						end: last,
						prop: prop,
						onComplete : complete
					}
				),
				opac = new Fx.Tween(box, {duration: last, property: 'opacity'});
			
				start = function(){
					opac.start(1);
					circ.start();
				}
				
			setTimeout(start, i * delay );
		});	
	},
	
	_func: function(i){
		return function(x, y){
			KM.index.box[i].setStyles({
				'left': this.origin.x + x,
				'top': this.origin.y + y
			});
		}.bind(this);
	},
	
	_method: {
		x: function(t){
			return this.r * Math.sin(t);
		},
	
		y: function(t){
			return this.r * ( Math.cos(t) - 1 );
		}
	},
	
	_complete: function(){
		this.box.addClass('active');
	}
};
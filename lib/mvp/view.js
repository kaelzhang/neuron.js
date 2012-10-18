/**
 module  mvp/view
 inspired by apple, ref: http://developer.apple.com/library/ios/#documentation/WindowsViews/Conceptual/ViewPG_iPhoneOS/CreatingViews/CreatingViews.html

 Actually, on browsers, the `View` of Model-View-Presenter structure is the DOM itself.
 we can use DOM api to listen user events, and re-render elements.
 
 
 
 for some
 
 we use interface to communicate with Presenter
 
 @interface
 
 subject {Object} the subject might be even a mock element, i.e. instances of formui modules
 
 render {function()} 
 
 */


/**
 
 draft:
 
 1.
 new View({
 	template: '<div class="@{className}"></div>',
 	render: render
 });
 
 2.
 var myView = NR.Class({
 	Extends: View,
 	
 	template: '<div class="@{className}"></div>',
 	render: render
 });
 
 new myView();
 
 */

var

TemplateEngine = require('./tpl');

module.exports = NR.Class({
	initialize: function(){
		
	},

	// template: {string|function()}

	render: function(){
		return this;
	},
	
	dispose: function(){
	},
	
	destroy: function(){
	}

}, {
	template: {
		value: '<div></div>',
		
		validator: function(v){
			return NR.isString(v) || NR.isFunction(v);
		},
		
		getter: function(v){
			var self = this, tpl;
			
			if(!self._template){
				tpl = self.get('template') || self.template;
				
				self._template = NR.isFunction(tpl) ? tpl : TemplateEngine.parse(tpl);
			}
			
			return self._template;
		}
	},
	
	/**
	 * the most outter element of the current view, 
	 */
	subject: {
		getter: function(v){
			if(!v){
				var v = $.create();
			
				this.set('subject', v);
			}
		
			return v;
		}
	},
	
	/**
	 * view container
	 */
	wrap: {
		value: null
	}
});
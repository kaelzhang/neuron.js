/**
 * mvp/app is a complex constructor conforms of all related modules
 * Unlike normal presenters, mvp/app is a global singleton instance of mvp/presenter
 */

var 

Model 		= require('./model'),
Presenter 	= require('./presenter'),
History 	= require('./history'),
Router 		= require('./router'),
Live		= require('event/live'),
DOC			= NR.__HOST.document,

/**
 
 new App({
    routes: [
        {
            path: '/shop/:shopID/photos', 
            presenter: 'shopPhoto' 
            events: {
                '.page': {
                    'click': navigateToPage
                }
            },
            
            view: 'photos'
        },
        
        {
            path: '/shop/:shopID/upload',
            presenter: 'shopUpload',
            events: {
                
            } 
        },
        
        ... 
    },
    
    views: {
        'photos': shopPhotoView
    },
    
    presenters: {
        'shopPhoto': ShopPhotoPresenter
    },
    
    links: [
        '.mvc-link',
        
        {
            CS: ''
        }
        
    ]
    
 });
 
 
 
 
 
 
 */



App = NR.Class({
	
	initialize: function(options){
		var self = this;
		
		self.router = new Router;
		self.presenter = new Presenter;
		
		// bind event handler
		NR.bind('_routeTrigger', self);
		
		self._bindRoutes();
	},
	
	// events: {},
	
	// routes: {}, 
	
	/**
	 * @this {App}
	 */
	_routeTrigger: function(e){
		this.router.navigate(e.target.href);
	},
	
	_bindTrigger: function(linkCS){
		Live.on(DOC, 'click', linkCS, this._routeTrigger);
	},
	
	_attachView: function(){
	    
	},
	
	_detachView: function(){
	    
	},
	
	_destroyView: function(){
	    
	},
	
	_isParentView: function(){
	    
	   
	},
	
	_isChildView: function(){
	    
	},
	
	
	
}, {
	views: {},
	
	routes: {}
	
});


module.exports = App;

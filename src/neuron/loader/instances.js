;(function(K){


var Loader = K._Loader;

/** 
 * create a new loader application
 * and also create a new namespace for modules under this application
 * will be very useful for business requirement

 <code env="page">
 	var Checkin = KM.app('Checkin', {
 		base: '/q/mods/'
 	});
 	
 	// ? Checkin.define('http://i1.dpfile.com/q/mods/page/index.js'); // should be allowed?
 	// or
 	KM.define('http://i1.dpfile.com/q/mods/page/index.js');
 	
 	// provide a module within a specified app
 	// use double colon to distinguish with uri ports
 	// 'Checkin' -> namespace
 	KM.provide('Checkin::page/index', function(K, index){
 		index.init();
 	});
 	
 	// provide a module of the kernel
 	KM.provide('io/ajax', function(K, Ajax){
 		new Ajax( ... )
 	})
 </code>
 
 <code env="index.js">
 
 	// '~/' -> the home dir for the current application
 	KM.define(['~/timeline'], function(K, require){
 		var timeline = require('~/timeline');
 	});
 	
 </code>
 */
K.app = function(name, config){
};


K.define = function(){
};


delete K._Loader;

})(KM);
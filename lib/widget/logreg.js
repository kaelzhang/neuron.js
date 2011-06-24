KM.define(function(K, require, exports){
	var validator 	= require('form/validator'),
		tpl 		= require('template/demo'),
		mbox 		= require('ui/mbox');
	
	require('abc');
	
	exports.open = function(){
		mbox.open(tpl.HTML);
		
		// validator
		cx = new validator.Complex('form-wrap', tpl.rules, {CSPrefix: '#i-', showAllErr: true});
		
		$('submit-btn').addEvent('click', function(e){
			e.preventDefault();
			cx.check();
			
			// code for business ...
		});
	};
});
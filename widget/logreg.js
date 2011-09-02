KM.define(['form/validator', 'ui/mbox', 'template/demo'], function (K, require) {


var validator 	= require('form/validator'),
	mbox 		= require('ui/mbox'),
	tpl 		= require('template/demo');
 
 console.log(tpl, tpl.html)

function logreg(){ };

logreg.prototype.show = function(){
	mbox.open({
		winCls: 'pop-win',
		closeCls: 'pop-close',
		url: tpl.HTML,
		type: 'ele',
		onShow: function () {
		     window.console && console.log('step show');
		},
		onClosing: function (d) {
		    window.console && console.log('step close');
		}
	});
 
	var cx = new validator.Complex('form-wrap', tpl.rules, {CSPrefix: '#i-', showAllErr: true});
	
	$('submit-btn').addEvent('click', function(e){
		e.preventDefault();
		cx.check();
		
		// code for business ...
	});
};
 
return logreg;
 
});
 
 
 
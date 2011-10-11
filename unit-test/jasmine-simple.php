<script>
// fake jasmine

if(!window.console){
	var console = {
		log: log
	}
}

function log(msg){
	var div = document.createElement('div');
	
	div.innerHTML = msg;
		
	body.appendChild(div);
};

function describe(des, cb){
	var old_des = _des;

	_des += ' > ' + des;
	
	cb();
	
	_des = old_des;
};


function expect(result){

	return {
		toBeTruthy: function(){
			_expect(result, true);
		},
		
		toBeFalsy: function(){
			_expect(result, false);
		},
		
		toBeUndefined: function(){
			_expect(result, undefined);
		},
		
		toEqual: function(v){
			_expect(result, v);
		}
	}
};


function _expect(result, exp){
	des = _des;

	log(
		result === exp ? 
			des + ' >> <span style="color:green">passed</span>' :
			des + ' >> <span style="color:red">failed</span>: expect ' + result + ' to be ' + exp
	);
};

function runs(fn){
	fn();
};

var _des = '', 
	it = describe,
	waitsFor = runs,
	body = document.getElementsByTagName('body')[0];


</script>
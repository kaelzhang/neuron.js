NR.define(['io/ajax'], function (D, require) {
	var Ajax = require('io/ajax');
	
	var Remote = function (field, rule) {		
        var cache={};

		return function (v) {
			// TODO: judege  tpe of "test"
			var url = rule.test.slice(rule.test.indexOf(':')+1);
			var ret,loading;
			if ((ret = cache[v]) == undefined) {
				var loading = true;
				ret = 'loading';
				new Ajax({
					method : 'post',
					url : url,
					data : {
						v : v
					}
				}).on('success', function (json) {
					if (json.code != 100) {
						cache[v] = false;
					} else {
						cache[v] = json.msg.pass;
					}
					field.check();
				}).on('error',function(){
					cache[v] = false;
					field.check();
				}).send();
			}			
			return ret;
		}
		
	}
	
	return Remote;
});

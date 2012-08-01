<script>

KM.provide('mvp/model', function(K, Model){
	var myModel = K.Class({
	   Extends: Model
	});
	
	K.Class.setAttrs(myModel, {
    	a: {value: null},
    	b: {value: null}
	});
	
	var m = new myModel;
	
	console.log(m, m.get('validators'));
	
	
	m.set({a: 1, b: 2});
	
	console.log('first set', m.get());
	
	m.set({a: 2, b: 4});
	m.set({a: 3, b: 6});
	
	m.undo();
	
	console.log('after undo', m.get());
	
	/*
m.on({
		update: function(e){
			console.log('update ' + e.key + ' to: ', e.value);
		},
		
		remove: function(e){
			console.log('remove ', e.remove);
		},
		
		error: function(e){
			console.log('fail to update ' + e.key + ' to: ', e.value);
		}
		
	});
*/
	
	/*
m.set('abc', {a:1, b:2});
	m.set('def', {a:1, b:2});
	m.set({a: 1, b: 2});
	
	console.log('fetch: all', m.fetch());
	console.log('fetch: abc, b', m.fetch('abc'), m.fetch('b'));
	
	m.remove('abc');
	m.remove('def', 'a', 'b');
	
	console.log('-----------------------------');
	
	m.update('name', '2');
	m.update('name', 'blah blah blah');
		
	m.update('html', '<script>alert("abc")<\/script>');
	
	console.log('escape', m.escape('html'));
*/
	
	
});

</script>
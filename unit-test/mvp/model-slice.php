<script>

KM.provide('mvp/model', function(K, Model){
	var m = new Model({}, {
		validators: {
			name: function(v){ console.log(v.length > 3)
				return v.length > 3;
			}
		}
	});
	
	console.log(m, m.get('validators'));
	
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
	
	m.update('abc', {a:1, b:2});
	m.update('def', {a:1, b:2});
	m.update({a: 1, b: 2});
	
	console.log('fetch: all', m.fetch());
	console.log('fetch: abc, b', m.fetch('abc'), m.fetch('b'));
	
	m.remove('abc');
	m.remove('def', 'a', 'b');
	
	console.log('-----------------------------');
	
	m.update('name', '2');
	m.update('name', 'blah blah blah');
		
	m.update('html', '<script>alert("abc")<\/script>');
	
	console.log('escape', m.escape('html'));
	
	
});

</script>
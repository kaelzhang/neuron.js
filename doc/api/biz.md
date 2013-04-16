Neuron Business Methods
====

NR.data(): setter
----
存入一个或者一组值

### Syntax
	NR.data(key, value);
	NR.data(keyMap);
	
### Arguments
#### key
{string}

#### value
{mixed}

#### keyMap
{Object} 包含 `key: value` 的对象



NR.data(key): getter
----
读取一个值


Example
----
	NR.data({
		a: 1,
		b: "b"
	});
	
	NR.data('a'); // 1
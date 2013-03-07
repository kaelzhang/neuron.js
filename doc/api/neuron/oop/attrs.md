Neuron: oop/attrs
====
为一个类提供强大的 getter 和 setter 特性。
使用本文档中的方法，需要在你的类声明中加入 `Implements: "attrs"`


Outline
----
- set
- get
- addAttr
- removeAttr
- setting: value
- setting: setter
- setting: getter
- setting: validator
- setting: readOnly
- setting: writeOnce
- Examples


本文档的参数
----
#### setting
{Object} 某一个 attr 的设置

#### key
{string} 某一个 attr 的名字

#### value
{mixed} attr 的值

#### keyMap
{Object} 包含 `key: value` 的对象

attributes
----

### Syntax
	
	key: setting

### Example
一个可能的例子。一个完整的例子见文档底部。

	var Person = NR.Class({
		Implements: 'attrs'
		
	}, {
		name: {},
		
		gender: {}
	});
	
	// 定义了一个最简单的类，
	// 它有两个属性，`name` 和 `gender`
	// 并且这两个属性都采用默认的设置
	// 设置的说明，见本文档下面的部分

.get(key)
----
获取一个 key

### Returns
{mixed} 名为 key 的 attr 的值，若不存在，则会返回 null


.set()
----
设置一个或者一组 attr 的值

### Syntax

	.set(key, value)
	.set(keyMap)
	
### Returns
{boolean} 参数是否设置成功

若同时设置了多个参数，则只有当所有的参数都设置成功，才会返回 `true`


.addAttr()
----
添加一个 attr 或者一组 attr

### Syntax
	
	.addAttr(key, setting);
	.addAttr({
		key: setting,
		...
	});
	

.removeAttr(key)
----
移除一个 attr


setting: value
----
设置一个 attr 的默认值

setting: getter
----
设置一个 attr 的 getter 方法。

当调用 `.get(key)` 的时候，若 `setting: getter` 已定义，则会调用该方法，将内部目前的值作为参数，并将 `getter` 返回值作为 `.get(key)` 的返回值。


#### getter
{function(v)} getter

{string} 若为字符串，则会调用当前实例上，名为 `getter` 的方法作为 getter。

#### v
{mixed} 会传递内部目前的值，作为 getter 的参数

setting: setter
----
设置一个 attr 的 setter 方法。

同理，在调用 `.set()` 的时候，会尝试调用 setter

#### setter
{function(v)} setter

{string} 若为字符串，则会调用当前实例上，名为 `setter` 的方法作为 setter。

#### v
{mixed} 会将用户定义的 `value`, 作为 setter 的参数


setting: validator
----
在设置一个 attr 的值的时候，调用的验证函数，若验证失败（ validator 返回值非真），则会放弃写入该值。

#### setter
{function(v)} validator

{string} 若为字符串，则会调用当前实例上，名为 `validator` 的方法作为 validator。

#### v
{mixed} 会将 `validator`, 作为 validator 的参数


setting: readOnly
----
标记一个 attr 为只读

#### readOnly
{boolean}


setting: writeOnce
----
设置当前的 attr 只允许设置一次取值，当用户第二次尝试写入新值的时候，就会失败


Examples
----
下面是一个集中的例子，包含上面几乎所有的用法

	var Male = NR.Class({
		Implements: "attrs",
		
		initialize: function(options){
			this.set(options);
		}
		
	}, {
		gender: {
			value: 'male',
			readOnly: true
		},
		
		name: {
			// 要求 name 为字符串，否则设置会失败
			validator: NR.isString,
			getter: function(v){
				return v || "no name";
			} 
		},
		
		weight: {
			setter: function(v){
				return parseInt(v);
			}
		}
	});
	
	var wangcai = new Male({
	
		// 这是一个只读属性，设置会失败
		gender: "female",
		
		// 设置失败，因为要求为字符串
		name: 1,
		
		// 会被转化为数字 `100`
		weight: "100t"
	});
	
	wangcai.get('gender'); // "male"
	wangcai.get('name');   // "no name"，注意上面的 getter
	wangcai.get('weight'); // 100
	
	wangcai.set('name', 'wangcai');
	wangcai.get('name');   // "wangcai"
	
	


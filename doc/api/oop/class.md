Neuron: oop/class
=======
类

概览
------
- constructor
- Property:Extends
- Property:Implements
- Property:initialize

NR.Class: Constructor
---------

### Syntax

    var MyClass = NR.Class(properties, attributes);

### Arguments
#### properties
{Object} 自定义属性集合、特殊属性（`Extends`、`Implements`、`initialize`）

#### attributes
{Object} 见 attrs.md


### Returns
{function()} 定义好的类

### Examples:

    var Person = NR.Class({
        initialize: function(name){
            this.name = name;
        },
        
        getName: function(){
        	return this.name;
        }
    });
    
    var kael = new Person('Kael');
    
    console.log(kael.getName()); // 'Kael'

Property: Extends
----
继承一个类，被继承的类，可能通过原型链的回溯，来访问到父类或者更上级父类的方法。

### Syntax

	Extends: SuperClass
	
### Arguments
#### SuperClass
{function()} 需要继承的父类，可以是一个纯净的 JavaScript 函数，构造器，或者 NR.Class 实例。


Property: Implements
----
mixin 一个或多个工具类的方法，或者工具对象的方法

### Syntax
	
	Implements: buildInClassName
	Implements: buildInClassNames
	Implements: ExtClass
	Implements: [ ExtClass, buildInClassName, ...]

### Arguments
#### buildInClassName
{string} 内置工具类的名字，目前可选的仅有 `"attrs"`, `"events"`

#### buildInClassNames
{string} 多个内置工具类的名字，用空格隔开，比如 "attrs events"

#### ExtClass
{function()|Object} 工具类，或者工具对象。

若 `ExtClass` 为一个简单的对象，则该对象上的方法会 mixin 到新类的 `prototype` 上。

若为一个构造函数，则该构造函数的原型会被 mixin 到新类的 `prototype` 上

### Example
以下为不完整的代码片段

	Implements: "attrs"
	
	Implements: "attrs events"
	
	Implements: MyExtClass
	
	Implements: [ MyExtClass, "attrs", MyTools ]


Property: initialize
----
{function()} 定义类的构造函数

### 特别说明
与原生 JavaScript 不同，即使构造函数的返回值为对象，用户自定义类的实例化后，仍然会返回 `this`

### Example
原生的 JavaScript “类”

	function MyClass(){
		return {
			a: 1,
			b: 2
		}
	};
	
	MyClass.prototype = {
		a: 1
	};

	new MyClass(); // {a: 1, b: 2}
	
NR.Class
	
	var MyClass = NR.Class({
		initialize: function(){
			return {
				a: 1,
				b: 2
			};
		},
		
		a: 1
	});
	
	new MyClass(); // 返回 MyClass 的实例


Deprecated: NR.Class.setAttrs
----
为一个类设置 attributes。

不建议使用，在今后的新版本中，可能会废弃。建议直接使用 `NR.Class(properties, attributes)` 语法。

### Syntax

	NR.Class.setAttrs(cls, attributes)
	
### Arguments
#### cls
{NR.Class}

#### attributes
{Object} 见 attrs.md


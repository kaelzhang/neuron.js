Outline
----
- one
- all
- child
- children

one
-----
在DOM对象的`首个`节点的`子孙`节点中选取符合选择器的`首个`元素

### 语法
	
	DOM().one(selector);

### 参数

1. selector {string} css选择器

### 返回

- {DOM} 新的DOM实例

### 示例

##### html
	<ul id="ul1">
		<li><a href="#">1</a></li>
		<li><a href="#">2</a></li>
		<li><a href="#">3</a></li>
	</ul>
	<ul id="ul2">
		<li><a href="#">4</a></li>
		<li><a href="#">5</a></li>
		<li><a href="#">6</a></li>
	</ul>

##### javascript

	DOM('ul').one('a');
	
##### resulting context

	[<a href="#">1</a>]

all
-----
在DOM对象的`首个`节点的`子孙`节点中选取符合选择器的`所有`元素

### 语法

	DOM().all(selector);

### 参数

1. selector {string} css选择器

### 返回

- {DOM} 新的DOM实例

### 示例

##### html
	<ul id="ul1">
		<li><a href="#">1</a></li>
		<li><a href="#">2</a></li>
		<li><a href="#">3</a></li>
	</ul>
	<ul id="ul2">
		<li><a href="#">4</a></li>
		<li><a href="#">5</a></li>
		<li><a href="#">6</a></li>
	</ul>

##### javascript

	DOM('ul').all('a');
	
##### resulting context

	[<a href="#">1</a>,<a href="#">2</a>,<a href="#">3</a>]


child
-----
在DOM对象的`首个`节点的`子`节点中选取符合选择器的`首个`元素

### 语法

	DOM().child(selector);

### 参数

1. selector {string} css选择器

### 返回

- {DOM} 新的DOM实例

### 示例

##### html
	<ul id="ul1">
		<li><a href="#">1</a></li>
		<li><a href="#">2</a></li>
		<li><a href="#">3</a></li>
	</ul>
	<ul id="ul2">
		<li><a href="#">4</a></li>
		<li><a href="#">5</a></li>
		<li><a href="#">6</a></li>
	</ul>

##### javascript

	DOM('ul').child('li');
	
##### resulting context

	[<li><a href="#">1</a><li>]

children
-----
在DOM对象的`首个`节点的`子`节点中选取符合选择器的`所有`元素

### 语法

	DOM().children(selector);

### 参数

1. selector {string} css选择器

### 返回

- {DOM} 新的DOM实例

### 示例

##### html
	<ul id="ul1">
		<li><a href="#">1</a></li>
		<li><a href="#">2</a></li>
		<li><a href="#">3</a></li>
	</ul>
	<ul id="ul2">
		<li><a href="#">4</a></li>
		<li><a href="#">5</a></li>
		<li><a href="#">6</a></li>
	</ul>

##### javascript

	DOM('ul').children('li');
	
##### resulting context

	[<li><a href="#">1</a></li>,<li><a href="#">2</a></li>,<li><a href="#">3</a></li>]
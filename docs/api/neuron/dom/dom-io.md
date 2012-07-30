Outline
----
- html 
- text
- val
- attr
- data
- removeData
- removeAttr


html
----
修改或获取节点的innerHtml

### 语法
	
	
	DOM().html();

	DOM().html(html);

### 参数

1. html {string} 目标html，若不传则调用取值方法

### 示例

- 取值：
#### html
	
	<div id="container">
		<p class="content">hi</p>
	</div>
	
##### javascript
	
	DOM('#container').html()
	
##### return string
	
	<p class="content">hi</p>	

- 设值：

##### html
	
	<div id="container">
		<p class="content">hi</p>
	</div>
	
##### javascript
	
	DOM('#container').html('<p class="content">beauty</p>');
	
##### result html
	
	<div id="container">
		<p class="content">beauty</p>
	</div>

### 注意

1. 请勿使用html('')来清空html中的内容。使用empty()

text
----
修改或获取节点内的innerText

### 语法
	
	
	DOM().text();
	
	DOM().text(text);

### 参数

1. text {string} 目标text，若不传则调用取值方法

### 示例

- 取值：
##### html
	
	<div id="container">
		<p class="content">hi</p>
	</div>
	
##### javascript
	
	DOM('#container').text()
	
##### return string
	
	hi	

- 设值：
##### html
	
	<div id="container">
		<p class="content">hi</p>
	</div>
	
##### javascript
	
	DOM('#container').text('<p class="content">beauty</p>');
	
##### result html
	
	<div id="container">
		&lt;p class="content"&gt;beauty&lt;/p&gt;
	</div>


val
----
设置或获取元素的val

### 语法
	
	DOM().val();
	
	DOM().val(value);
	
### 参数

1. value:{mix} 	需要设置的值

### 示例

- 取值：
##### html
	
	<input type="text" value="hey" id="word" />
	
##### javascript
	
	DOM('#word').val()
	
##### return string
	
	hey


attr
----
设置或获取元素的特定属性

### 语法
	
	DOM().attr(key,value);
	
	DOM().attr(key);
	
### 参数

1. key:{string} 属性的名称
2. value:{string} 属性的值

### 示例

##### html
	
	<input type="text" value="hey" id="word" />
	
##### javascript
	
	DOM('#word').attr('type')
	
##### return string
	
	text



data
----
在DOM对象上存值，取值

### 语法

	DOM().data(key);

	DOM().data(key,value);

### 参数

1. key:{string} 数据的键
2. value:{string} 数据的值

### 示例

##### html
	
	<li id="user">Spud</li>
	
##### javascript
	
	DOM('#word').data('gender','male');
	DOM('#word').data('gender');
	
##### return string
	
	male

removeData
------
删除节点上所存储的相应数据

### 语法

	DOM().removeData('key');
	
### 参数

1. key: {string} 所要删除数据的键，若为undefined，则删除节点上存储的所有数据

### 示例

	DOM("#myele").removeData("key");
	
removeAttr
-------
删除节点上的相应属性

### 语法

	DOM().removeAttr('key');
	
### 参数

1. key: {string} 所要删除的属性，若为undefined，

### 示例

	DOM("#myele").removeAttr("key");


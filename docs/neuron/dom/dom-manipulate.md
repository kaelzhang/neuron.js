Outline
-----
- addClass
- removeClass
- toggleClass
- inject
- grab
- empty
- dispose
- destory


以下方法`逐个`处理DOM对象中的所有节点

addClass
------
为节点添加特定class

### 语法

	DOM().addClass(className);

### 参数

1. className {string} 需要添加的class名

### 返回

- {DOM} 原DOM对象

### 示例
	
	DOM("#myele").addClass("myCls");


removeClass
------
删除节点上的特定class

### 语法

	DOM().removeClass(className);

### 参数

1. className {string} 需要删除的class名

### 返回

- {DOM} 原DOM对象

### 示例
	
	DOM("#myele").removeClass("myCls");

toggleClass
------
判断节点有无某class，有则删除，无则添加

### 语法

	DOM().toggleClass(className);

### 参数

1. className {string} 需要添加或删除的class名

### 返回

- {DOM} 原DOM对象

### 示例
	
	DOM("#myele").toggleClass("myCls");

inject
-------
将原节点插入到目标节点中

### 语法

	DOM().insert(element,where);

### 参数

1. element {DOM} 目标节点
2. where {enum \<string\> } 在目标节点的什么位置插入，接受before(元素前), after(元素后), top(元素内部最前), bottom(元素内部最后 默认值)

### 返回

- {DOM} 原DOM对象

### 示例

##### html

	<div id="myparent">
		<div>content</div>
	</div>
	<div id="myele">content</div>

##### javascript
	
	DOM("#myele").insert($("#myparent"),"bottom");

##### resulting html

	<div id="myparent">
		<div>content</div>
		<div id="myele">content</div>
	</div>
	
grab
----
将目标节点插入原节点中

### 语法

	DOM().grab(element,where);

### 参数

1. elem {DOM} 目标节点
2. where {enum \<string\> } 在原节点的什么位置插入，接受before(元素前), after(元素后), top(元素内部最前), bottom(元素内部最后 默认值)

### 返回

- {DOM} 原DOM对象

### 示例
	
	DOM("#myele").toggleClass("myCls");


empty
-----
删除节点中的内容


### 语法

	DOM().empty();
	
### 示例

##### html
	
	<div id="container">
		<div class="myele"></div>
		<div class="myele"></div>
		<div class="myele"></div> 
	</div>
	
##### javascript

	DOM.all(".myele").dispose()

##### resulting context
	
	<div id="container">
		<div class="myele"></div>
		<div class="myele"></div>
		<div class="myele"></div> 
	</div>

dispose
-----

将节点从文档中移除

### 语法
	
	DOM().dispose();

### 示例	

##### html
	
	<div id="container">
		<div class="myele">1</div>
		<div class="myele">2</div>
		<div class="myele">3</div> 
	</div>
	
##### javascript

	DOM.all(".myele").dispose()

##### resulting context
	
	<div id="container"></div>


destroy
----

将节点销毁

### 语法
	
	DOM().dispose();

### 示例	

##### html
	
	<div id="container">
		<div class="myele">1</div>
		<div class="myele">2</div>
		<div class="myele">3</div> 
	</div>
	
##### javascript

	DOM.all(".myele").dispose()

##### resulting context
	
	<div id="container"></div>
	
### 注意

1. 与dispose的区别。destroy不仅会将节点从DOM中移除，还会清理DOM上绑定的事件以及存储的数据和属性。
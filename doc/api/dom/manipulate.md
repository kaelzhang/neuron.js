Neuron: DOM/manipulate
====
DOM 操作及修改

Outline
-----
- css
- text
- html
- attr
- data
- removeData
- addClass
- removeClass
- toggleClass
- inject
- grab
- empty
- dispose
- destory


以下方法 **逐个** 处理DOM对象中的所有节点


.css()
----
详见 css.md


.text(text): setter
----
将集合中所有元素的文本都设置为 text

### Arguments
#### text
{string} 


.text(): getter
----
当 `.text()` 没有参数的时候，将返回当前集合中第一个元素的文本内容，若当前集合中没有元素，则会返回 null


.data(): setter
----
在存储一个或一组多个数据，并将这些数据与当前的 DOM 节点关联到一起。之后可以用 getter 来获取这些数据

### Syntax
	
	.data(key, value)
	.data(dataObject)
	
### Arguments
#### key
{string} 数据的名字

#### value
{mixed} 数据的值

#### dataObject
{Object} 包含 <key: value> 的对象，相当于 Hash-map

### Returns
{Object} 原 Neuron DOM 对象


.data(key): getter
----
读取一个关联的数据，若当前的 Neuron DOM 对象集合中包含多个元素，则仅获取与第一个元素关联的数据

### Returns
{mixed} 对应 key 的值


.removeData(key): getter
----
移除当前集合中所有元素中，名为 `key` 的数据

### Returns
{Object} 原 Neuron DOM 对象


.html(html): setter
----
将集合中所有元素的 innerHTML 都设置为 html

### Arguments
#### html
{string}


.html(): getter
----
当 `.html()` 没有参数的时候，将返回当前集合中第一个元素的文本内容，若当前集合中没有元素，则会返回 null


.addClass(className)
------
向集合中所有的DOM元素上添加特定 class

### Syntax

	.addClass(className);

### Arguments

#### className 
{string} 需要添加的 class 名

### Returns

{Object} 原 Neuron DOM 对象

### Example
	
	NR.DOM("#myele").addClass("myCls");


.removeClass(className)
------
将集合中所有的DOM元素上特定的 class 移除

### Syntax

	.removeClass(className);

### Arguments

#### className 
{string} 需要删除的class名

### Returns

{Object} 原 Neuron DOM 对象

### Example
	
	// 将移除所有 <div> 上的 "myCls" 的 class
	NR.DOM("div").removeClass("myCls");


.toggleClass(className)
------
依次判断集合中所有的节点上有无某class，有则删除，无则添加

### Syntax

	.toggleClass(className);

### Arguments

#### className
{string} 需要添加或删除的class名

### Returns

{Object} 原 Neuron DOM 对象

### Example
	
	NR.DOM(".myele").toggleClass("myCls");


.inject(element, where=)
-------
将原节点插入到目标节点中

### Syntax

	.insert(element, where=)
	.insert(neuronDOMObject, where=)
	.insert(cssSelector, where=)

### Arguments

#### element
{Element} 目标 DOM 节点

#### neuronDOMObject
{Object} 目标节点 (Neuron DOM 对象)，若集合中包含多个 DOM节点，则会插入到第一个 DOM 节点的目标位置

#### cssSelector
{CSS Selector} 目标节点的 CSS 选择符，若该 CSS 选择符获取的元素不唯一，则会插入到第一个元素的目标位置

#### where
{string="bottom"} 在目标节点的什么位置插入，接受:

- "before" (元素前)
- "after"  (元素后)
- "top"    (元素内部最前)
- "bottom" (元素内部最后 **默认值**)

### Returns

{Object} 原 Neuron DOM 对象

### Example

##### html

	<div id="myparent">
		<div>content</div>
	</div>
	<div id="myele">content</div>

##### javascript
	
	NR.DOM("#myele").insert($("#myparent"),"bottom");

##### result html

	<div id="myparent">
		<div>content</div>
		<div id="myele">content</div>
	</div>


.grab()
----
将节点插入原节点某处，若当前的集合中包含多个节点，则仅仅会插入到第一个节点的目标位置

### Syntax

	.grab(element, where=);
	.grab(elements, where=);
	.grab(cssSelector, where=);
	.grab(neuronDOMObject, where=);

### Arguments

#### element
{Object} 需要插入的节点 (Neuron DOM 对象)

#### elements
{Element} 需要插入的节点的数组

#### cssSelector
{CSS Selector} CSS 选择符，会将匹配到的所有元素都插入到目标位置

#### neuronDOMObject
{Object} 会将 `neuronDOMObject` 集合中所有的元素都插入到目标位置

#### where
{string="bottom"} 在目标节点的什么位置插入，接受:

- "before" (元素前)
- "after"  (元素后)
- "top"    (元素内部最前)
- "bottom" (元素内部最后 **默认值**)

### Returns

{Object} 原 Neuron DOM 对象

### Example
	
	NR.DOM("#myele").grab("myCls");


.empty()
-----
删除当前集合中，所有节点的子节点


### 语法

	.empty();
	
### 示例

##### html
	
	<div id="container">
		<div class="myele"></div>
		<div class="myele"></div>
		<div class="myele"></div> 
	</div>
	
##### javascript

	NR.DOM.all("#myele").empty()

##### resulting context
	
	<div id="container">
	</div>

.dispose()
-----
将集合中所有的节点从文档中移除。移除的的元素并不会立即从内存中释放，并且这些元素上原有的事件也会保留。

### 语法
	
	.dispose();

### 示例	

##### html
	
	<div id="container">
		<div class="myele">1</div>
		<div class="myele">2</div>
		<div class="myele">3</div> 
	</div>
	
##### javascript

	NR.DOM("#container .myele").dispose()

##### resulting context
	
	<div id="container"></div>


.destroy()
----
将节点销毁

### 语法
	
	.dispose();

### 示例	

##### html
	
	<div id="container">
		<div class="myele">1</div>
		<div class="myele">2</div>
		<div class="myele">3</div> 
	</div>
	
##### javascript

	NR.DOM("#container .myele").dispose();

##### resulting context
	
	<div id="container"></div>
	
### 注意

与dispose的区别。destroy不仅会将节点从DOM中移除，还会清理DOM上绑定的事件以及存储的数据和属性。
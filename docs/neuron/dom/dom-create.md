Outline
----

- Constructor
- DOM.all
- DOM.create


DOM - Constructor
-------

### 语法

	DOM(element,context)

### 参数

1. element {string|DOMElement} 需要选择的元素。css选择器或DOMElement对象
2. context {DOM|NodeList|DOMElement} dom查找的上下文

### 返回

- {DOM} 新的DOM实例

### 示例

- 通过DOMElement构造

	DOM(DOC.getElementById('myele'));
	
- 通过css选择器构造

	DOM("#myele");

### 注意

- DOM方法始终只返回`第一个`元素，若需取出所有，请使用`DOM.all`方法

DOM.all
------
选取出所有符合选择器的元素

### 语法

	DOM.all(selector,context)

### 返回

- {DOM} 新的DOM实例

### 示例
- selector as a `string` 

	    DOM.all("#id",document);
	    DOM.all("li",container);


DOM.create
------
创建一个DOM实例

### 语法

	DOM.create(tag,attributes);

### 参数
1. tag {string} 创建节点的tagName
2. attributes {object} 属性键值对
	
### 返回

- {DOM} 新的DOM实例

### 示例
	
	DOM.create('input',{
		"name":"username",
		"type":"text"
	});
Outline
----
- hasClass
- match


以下操作只针对DOM对象的`首个`节点

hasClass
-------
判断节点是否包含特定class

### 语法

	DOM().hasClass(className);

### 参数

1. className {string} 需要判断的class名

### 返回

- {boolean} 节点是否含有特定class

### 示例
	
	DOM("#myele").hasClass("myCls");
	
match
-----
判断节点是否匹配特定选择器

### 语法

	DOM().match(selector);

### 参数

1. selector {string} 用以判断的css选择器

### 返回

- {boolean} 节点是否含有特定class

### 示例
	
	myDOM.match(".myCls");
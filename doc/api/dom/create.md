Neuron: DOM/create
====
创建一个 DOM 元素，并包裹为 Neuron DOM 对象

NR.DOM.create()
----

### Syntax
	NR.DOM.create(tagName);
	NR.DOM.create(tagName, attributes);
	
### Arguments

#### tagName
{string} 需要创建的元素的标签名

#### attributes
{Object} 需要创建的元素的属性，**需要特别注意的是**，`attributes` 必须是 HTML 中能够包含的属性（attributeNode），因此，下列参数不能作为 `attributes` 的成员：
	
- text
- html
- val
	
请使用 `.text()`, `.html()`, `.val()` 方法来替代，用法具体见 ./manipulate.md。

具体见下面的示例。

### Example

创建一个空的 div：

	NR.DOM.create('div');
	
创建一个空的 div，并包含部分属性：

	NR.DOM.create('div', {
		// 注意，class 在 JavaScript 中是一个关键字，需要使用引号
		'class': 'wrapper',
		
		'data-id': 'nr-123',
		id: 'container'
	});
	
创建一个包含文本节点的 span，请注意 text 并不是 span 的一个 attribute。这里可以使用 .text() 方法：

	NR.DOM.create('span').text('blah-blah');

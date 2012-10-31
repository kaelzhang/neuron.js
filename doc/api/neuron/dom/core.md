Neuron: DOM/core (jQuerified)
====
DOM 核心方法

本文档的参数
----
****

#### element
{Element} 原生的 DOM 对象，会在返回值中包裹成 Neuron DOM 对象。

#### selector
{string} css选择表达式

#### context
{(Element|Array.<Element>|Neuron DOM|NodeList)=} 可选，默认为 document。定义 selector 的上下文。

#### elementArray
{Array.<Element>|NodeList} 包含原生 DOM 对象的数组，或者 NodeList。若改数组中包含非原生 DOM 对象的成员，则会被过滤掉。

#### neuronDOMObject
{Neuron DOM} 会直接返回该 Neuron DOM Object


NR.DOM()
----
****
`NR.DOM()` 会查找所有符合条件的 DOM 对象，并将他们包装为 Neuron DOM 对象，并可以使用 Neuron DOM 的所有方法。


### Syntax
	
	NR.DOM(element)
	NR.DOM(selector, context = document)
	NR.DOM(elementArray)
	NR.DOM(neuronDOMOjbect)


### Returns
{Object} Neuron DOM 对象（请注意并不是 `NR.DOM` 的实例）

### Example

	// 下列表达式的值都是一个包含 document.body 的 Neuron DOM 对象
	NR.DOM(document.body);
	NR.DOM('body');
	NR.DOM('body', document);
	NR.DOM([document.body]);
	NR.DOM(NR.DOM('body'));
	
### 特别说明
- 与 jQuery 不同的是，`NR.DOM` 创建的对象中，仅仅会包含 DOM 元素，也永远只会处理与DOM相关的内容；而 jQuery 对象中，可以包含多种类型的对象，如 Ajax 对象，defered 对象，甚至是 number，string，boolean，null。
- NR.DOM 不提供 domready 事件的绑定，如果需要绑定 domready 事件，可是使用 `NR.ready(fn)` 方法


.find()
----
****
查找当前集合中元素的子元素，获取所有符合条件的元素集合，并在**去除重复**之后，包裹为 Neuron DOM 对象。

使用该方法，不会修改原对象，而会创建一个新的 Neuron DOM 对象。

### Syntax
	.find(selector)
	.find(element)

### Returns
{Object} Neuron DOM 对象

### 特别说明
我们来说说 .find() 的工作原理。假若有如下的结构

	<div id="div-1">
		<div id="div-2">
			<div id="div-3">
		</div>
	</div>
	
那么：

	// 它包含 div#div-1, div#div-2, div#div-3
	var divs = NR.DOM('div'); 
	
	divs.find('div');
	// 它实际包含 div#div-2, div#div-3
	// 如何得到这个结果的呢？过程是这样的：
	
	// div#div-1 -> find('div') -> [div#div-2, div#div-3]
	// div#div-2 -> find('div') -> [div#div-3]
	// div#div-3 -> find('div') -> []
	
	// 接下来，将三者的结果集合起来，并去除重复的元素，得到：
	// [div#div-2, div#div-3]
	

.eq(index=)
----
****
获取当前集合中，指定位置的元素，并包裹为 Neuron DOM 对象。若位于 index 处的元素不存在，则会返回空的 Neuron DOM 对象。

使用该方法，不会修改原对象，而会创建一个新的 Neuron DOM 对象。

### Arguments
#### index
{number} 元素的数组位置。

### Returns
{Object} Neuron DOM 对象

.get(index=)
----
****
获取当前集合中，指定位置的元素，并返回该元素。若元素不存在，则返回 undefined

### Arguments
#### index
{number} 元素的数组位置。

### Returns
{Element|undefined} DOM 元素；若没找到元素，则返回 undefined。


.add()
----
****
创建一个新的集合，这个集合除了包含原有集合中的元素外，还会增添一个或多个元素指定的元素。可以理解为，向新的集合中，加入了 `NR.DOM(subject)` 包含的所有元素。

使用该方法，不会修改原对象，而会创建一个新的 Neuron DOM 对象。

### Syntax

	.add(element)
	.add(selector)
	.add(elementArray)
	.add(neuronDOMObject)

### Returns
{Object} Neuron DOM 对象。

NR.DOM.noConflict()
----
****
让 Neuron 交出对 `$` 的控制权，使用该方法后。你就必须使用 NR.DOM 来使用 Neuron DOM 相关的方法

### Returns
{Object} 会返回 NR.DOM
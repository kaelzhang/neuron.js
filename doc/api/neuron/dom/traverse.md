Neuron: DOM/traverse
====
DOM 遍历相关的方法，这些方法全部都不会修改原对象，而会创建一个新的对象


.add()
----
见 core.md


.find()
----
见 core.md


.eq()
----
见 core.md


.prev(selector=)
----
****
获取当前集合中每一个元素的**第一个**符合条件的向前的兄弟元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=} 可选。css 选择器表达式。若 selector 未定义，则获取当前的元素的相邻的向前兄弟元素。


.prevAll(selector=)
----
****
获取当前集合中每一个元素的**所有**符合条件的向前的兄弟元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=} 可选。css 选择器表达式。若 selector 未定义，则获取当前的元素所有向前的兄弟元素。


.next(selector=)
----
****
获取当前集合中每一个元素的**第一个**符合条件的向后的兄弟元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=} 可选。css 选择器表达式。若 selector 未定义，则获取当前的元素的相邻的向后兄弟元素。


.nextAll(selector=)
----
****
获取当前集合中每一个元素的**所有**符合条件的向后的兄弟元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=}（可选）css 选择器表达式。若 selector 未定义，则获取当前的元素所有向后的兄弟元素。


.parent(selector=)
----
****
获取当前集合中每一个元素的**第一个**符合条件的祖辈元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=} 可选。css 选择器表达式。若 selector 未定义，则获取当前的元素的直接父级元素。


.parents(selector=)
----
****
获取当前集合中每一个元素的**所有**符合条件的祖辈元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=}（可选）css 选择器表达式。若 selector 未定义，则获取当前的元素所有祖辈元素。


.children(selector=)
----
****
获取当前集合中每一个元素的**所有**符合条件的直接子元素，并集合在一起，去除重复的元素后，包装为 Neuron DOM 对象。

### Returns
{Object} Neuron DOM 对象

### Arguments
#### selector
{string=}（可选）css 选择器表达式。若 selector 未定义，则获取当前的元素所有直接子元素。

### 特别说明
.children() 与 .find() 的不同点是，.children() 仅仅会获取元素的直接子元素（子女），而会忽略更深层级的元素（孙子）。


.first()
----
****
获取当前集合中的第一个元素，并将其包装为一个新的 Neuron DOM 对象。
该方法等价于 .eq(0)


.last()
----
****
获取当前集合中的最后一个元素，并将其包装为一个新的 Neuron DOM 对象。
该方法等价于 .eq(-1)


.contains()
----
****
判断某一个元素，是否包含在当前元素集合的**子元素**中

### Syntax 

	.contains(element);
	.contains(neuronDOMObject);
	
### Arguments
#### element
{DOMElement} 原生 DOM 对象

#### neuronDOMOjbect
{Neuron DOM} Neuron DOM 对象 `.contains(neuronDOMObject)` 仅会检测该对象中的第一个元素的是否包含在当前元素集合的子元素中。

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
获取当前集合的元素，符合条件的首个子元素

### Arguments
#### selector
{string=} 可选。css 选择器表达式。若 selector 未定义，则获取前一个


.prevAll(selector=)
----
****
获取当前集合的元素的符合条件的所有的子元素，并去除重复后，包装为 Neuron DOM 对象


.next(selector=)



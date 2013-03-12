Neuron lib: switch/accordion
====
手风琴插件

Options
----

### property
{string="height"} 可选择'height'或者'width'其中的一个，若为 'height'，则为一个竖向的手风琴。

### activeValue
{int=} 激活时，元素的尺寸。若没有定义，则Switch组件会根据初始的状态来计算。

### normalValue
{int=} 当不再激活时，元素的尺寸

### fx
{Object} 与 carousel 相同，见 carousel.md


Events
----
### Event: itemActive
当元素被激活时被触发

### Event: itemDeactive
当一个当前已经激活的元素变为非激活状态的时候会触发
Neuron: DOM/css
======

修改或获取元素的特定css

Outline
----
- css


.css(key)
---------
获取某个css属性

### 参数
#### key
{string} css属性的键

### 返回

css属性的值


.css(key,value)
---------
设置一条css属性

### 参数
#### key
{string} css属性的键
#### value
{string|number} css属性的值

.css(properties)
---------
设置一组css属性
### 参数
#### properties
{Object} css属性键值对


### 注意

- 通过css方法取出的值应当默认为string类型，需要自行处理单位
- 设值时若类型为数字或纯数字符串，则会以px为单位，亦可自行决定其他单位
- 设值方法会遍历DOM对象的所有元素进行设置
- 取值方法只会处理DOM对象第一个元素

</markdown>
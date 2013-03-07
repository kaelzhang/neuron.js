Neuron: oop/events
====
为一个类提供事件支持。
使用本文档中的方法，需要在你的类声明中加入 `Implements: "options"`

使用事件机制，可以提供一种很好的 "热插拔" 的插件支持

Outline
----
- on
- off
- fire
- Examples


本文档参数
----
#### event
{string} 事件的名称

#### handler
{function()} 事件的回调函数

#### eventMap
{Object} 包含 `event: handler` 的对象

#### args
{mixed|Array.<mixed>} 回调函数的参数


.on(event, handler)
----
为类的实例注册一个事件

.on(eventMap)
----
为类的实例注册一组事件


.off(event, handler)
----
移除一个事件

.off(event)
----
移除所有名为 `event` 的事件

.off()
----
移除所有事件

.fire(event [, args])
----
触发一个事件

Examples
----

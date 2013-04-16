Neuron: lang/type
====
类型检测。

请在大部分的时候，都避免使用 typeof 来进行类型判断，这样会有很多问题，请统一使用这里的方法。

本文档参数
----
#### subject
{mixed} 需要检测类型的变量


NR.is\<XXX\>(subject)
----
判断一个变量是否为\<XXX\>，可以检测的类型包括：

- Boolean 
- Number
- String
- Function
- Array
- Date
- RegExp
- Object

### Returns
{boolean} 变量是否为指定的类型


NR.isPlainObject(subject)
----

### Returns
{boolean} 只有当一个对象是由类似 `{}`，`new Object()`, 或者 `new myClass` 创建的，该方法才会返回 `true`


NR.isWindow(subject)
----
判断一个对象是否是 [DOMWindow]
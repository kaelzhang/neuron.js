neuron/lang/native
==================

源生语言增强。

###条件
只有满足如下条件的方法才会被加入到 neuron/lang 中：

1. ECMAScript 5.0或以上版本的规范中包含明确描述的；
2. 该方法从用途上不能由二义性或者明显处于草案阶段；
3. 该方法使用老的方法能够被完美的实现，并且没有浏览器兼容问题
4. 该方法有一定的使用需求

###编码要求

1. neuron/lang 不能依赖于任何其他 neuron
2. 若浏览器已经源生实现了某个方法，neuron/lang 中不允许覆盖的那个一

#Array
[Reference](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array)

### indexOf
### lastIndexOf
### filter
### forEach
### every
### map
### some
### reduce
### reduceRight


#String
### trim
### trimLeft
### trimRight


#Object

###Object.keys
###Object.create


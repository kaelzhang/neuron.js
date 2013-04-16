neuron/loader/assets
=======

包含动态加载 JavaScript, CSS, 及图片的方法

Outline
------

- NR.load
- NR.load.js
- NR.load.css
- NR.load.img


NR.load
---------

加载一个静态文件

### Syntax

    NR.load(src [, callback [, type] ]);
	
### Returns
{DOMElement} 包含该静态文件的 node（源生对象）

### Arguments

#### src
{string} 静态文件的 URL

#### callback（可选）
{function()=} 当该静态文件加载完成后，触发的回调事件，函数体中，this 指向为包含该静态文件的 node

#### type（可选）
{string} 指定该静态文件使用何种类型载入到页面中。可取值为 `"js"`, `"css"`, `"img"`。

type 这个参数大多数情况下可以不传，NR.load 会根据 `src` 参数的扩展名来判断类型，若扩展名判断失败，则默认为 `"img"`。

另外，可以通过 type 参数强制指定载入的类型，比如

    NR.load(
    	'http://www.google-analytics.com/ga.js', 
    	function(){}, 
    	'img'
    );
    
会将 http://www.google-analytics.com/ga.js 这个javascript 文件当作图片来载入到页面中。

##### type 优先级
用户指定的 type > 自动判断的 type > 默认值(`"img"`)


### 注意

加载 CSS 文件的回调事件是不靠谱的，请不要在代码中依赖这个特性。


NR.load.js
----

加载一个 JavaScript 文件

### Syntax

	NR.load.js(src [, callback]);


NR.load.css
----

加载一个 CSS 文件

### Syntax

	NR.load.css(src [, callback]);
	

NR.load.img
----

加载一个图片文件

### Syntax

	NR.load.img(src [, callback]);	

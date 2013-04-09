Neuron UA
====
用户浏览器核心 与 platform 侦测

NR.UA
----
{Object} Neuron UA 对象，它包含如下属性


NR.UA.[engine]
----
{int=} 它包括

- NR.UA.webkit
- NR.UA.opera
- NR.UA.ie
- NR.UA.mozilla

### 说明
当用户的浏览器引擎为 webkit 时，`NR.UA.webkit` 的值为当前浏览器核心或者浏览器的主版本号。

比如，用户的浏览器引擎核心为 AppleWebKit/537.11 时，有 `NR.UA.webkit === 537`

其他同理

### Example

要判断是否为 IE6-7，可以用：

	if(NR.UA.ie < 8){
		// code...
	}
	
	# 为什么可以不用 NR.UA.ie && NR.UA.ie < 8，读者可以思考一下。

NR.UA.version
----
{int=} 当前浏览器引擎核心的主版本


NR.UA.fullVersion
----
{string} 当前浏览器核心的完整版本

NR.UA.[platform]
----
{true=} 它包括

- NR.UA.ios
- NR.UA.webos
- NR.UA.android
- NR.UA.mac
- NR.UA.win
- NR.UA.linux

NR.UA.platform
----
{string=} 用户操作系统的简称，可以为 `"ios"`, `"webos"`, `"android"`, `"mac"`, `"win"`, `"linux"`, 或者 `undefined`


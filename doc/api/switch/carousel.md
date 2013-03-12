Neuron lib: switch/carousel
====
carousel 插件

Options
----

### direction
{string} 轮播的方向，可选择 'left' 或者 'top'

### fx
{Object} fx包含三个参数：

#### fx.link
{string} 用来处理，当一个动画没有完成时，用户再次触发动画效果时的处理方式：

- 'cancel'：结束上一个动画，并立即开始下一个动画，视觉上，用户将不会感觉到这个切换过程

- 'ignore'：若上一个动画没有结束，则忽略下一个动画。也就是如果轮播没有结束，用户点下一张的时候，将不会有效果

- 'chain'：若上一个动画没有结束，则下一个动画会在当前动画效果结束后立即运行。效果就是，用户疯狂点击下一张，轮播组件将花费很长的时间来播放整个过程。
}

#### fx.transition
{function()=} 缓动方程

#### fx.duration
{int=300} 动画的花费的时间，单位为毫秒 

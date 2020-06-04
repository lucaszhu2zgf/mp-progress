# mp-progress
专注于在小程序中实现圆环形进度条的工具

## why
小程序目前有很多第三方ui组件，基本都是以组件的形式引入使用，如果项目风格比较贴近第三方，那么这些成套的三方组件库是比较方便，不过如果只是使用三方ui库的某几个组件的话，安装一个非常大的库则不太合理。

`mp-progress`目标文件体积小于7KB，方便的js调用方式和原生的canvas标签写法，非常适用于希望保留高度控制权的项目。

## 安装
```
$ npm install mp-progress --save
```

## 用法

传入的单位是`rpx`，即如果canvas宽度为400rpx，则传入400，后续会自动计算真实尺寸
```
import MpProgress from 'mp-progress';
...
// 初始化
const mprogress = new MpProgress({
  target: this,
  canvasId: 'progress',
  canvasSize: {width: 400, height: 400},
  barStyle: [{width: 12, fillStyle: '#f0f0f0'}, {width: 12, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]}]
});

// 开始绘制进度，60代表60%
mprogress.draw(60);

...
<canvas class="canvas" type="2d" id="progress"></canvas>
```
## 显示模式

|效果|解析|
|:----|:-----|
|![正常模式](/assets/images/params.png)|正常模式（默认）|
|![百分比模式](/assets/images/percent.png)|百分比模式（只需要按需求传入percent即可，相见参数说明）|

## 参数说明

|参数名|数据类型|必要参数|解析|示列|
|:----|:-----|:---:|:-----|:-----|
|target|Object|是|页面上下文|this|
|canvasId|String|是|页面canvas的id|progress|
|canvasSize|Object|是|canvas画布的大小，对应单位是rpx，只需要传入数字即可|{width: 200, height: 300}|
|percent|Number|否|默认按照360度去计算和显示圆环，如果传入80%则会自动根据canvas尺寸贴底画出最大半圆弧，有效值在50%～100%|100|
|barStyle|Array|是|圆弧进度样式，按照数组元素的位置顺序渲染，一般第一个元素配置是铺满整个圆弧的底色，第二个元素配置是按照进度百分比渲染圆弧。fillStyle可以是是普通颜色和渐变颜色，使用渐变颜色是需要按照数组的格式传入各个点的位置和颜色信息|[{width: 12, fillStyle: '#f0f0f0'}, {width: 12, animate: true, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]}]|
|needDot|Boolean|否|是否需要显示进度点|false|
|dotStyle|Array|否|进度点样式配置，最多支持两种样式叠加，为保证进度点的清晰显示第一个点默认添加阴影。如果第一个进度点直径比进度条更大时，为了保证在画布内完整显示进度点，绘制的进度条圆圈必须减少对应的差值，其中shadow是可选的配置，shadow的值是`(0, 0, r/2, shadow)`|dotStyle: [{r: 24, fillStyle: '#fff', shadow: 'rgba(0,0,0,.15)'}, {r: 10, fillStyle: '#56B37F'}]|

## 绘制函数说明

考虑到进度条在一个页面可能多次更新，所以当组件实例化完成之后，需要手动调用`draw`方法去画图
|参数名|数据类型|必要参数|解析|
|:----|:-----|:---:|:-----|
|percentage|Number|是|圆弧百分比，比如传入的是60，只会逆时针渲染剩余的60%圆弧|

## 其他说明

- 如何设置弧线端点样式

  可以在`barStyle`中任何一个参数项增加`lineCap`参数，例如：barStyle: [{width: 12, lineCap: 'round', fillStyle: '#56B37F'}]，`lineCap`有效值可以[查看文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineCap.html)

- 必须在2.7.0版本以上的SDK运行

  组件已经采用微信最新的同层渲染方法，该方法要求SDK版本不低于2.7.0

- dotStyle

  如果dotStyle包含shadow的话，为了保证shadow在圆环的所有都可以完整展示，会自动缩减进度条的半径

- 进度动画

  目前动画只在barStyle最后一个元素的定义中起作用，每一帧的动画为总动画的2%

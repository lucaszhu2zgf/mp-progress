# mp-progress
专注于在小程序中实现圆环形进度条的工具

## 安装
```
$ npm install mp-progress --save
```

## 用法
```
import MpProgress from 'mp-progress';
...
// 初始化
const mprogress = new MpProgress({
  canvasId: 'progress',
  canvasSize: {width: 400, height: 400},
  barStyle: [{width: 12, fillStyle: '#f0f0f0'}, {width: 12, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]}]
});

// 开始绘制进度，60代表60%
mprogress.draw(60);

...
<canvas class="canvas" canvas-id="progress"></canvas>
```
## 参数说明
![图解参数](/assets/images/params.png)
|参数名|数据类型|解析|必要参数|示列|
|:----|:-----|:-----|:---:|:-----|
|canvasId|String|页面canvas的id|是|progress|
|canvasSize|Object|canvas画布的大小，对应单位是rpx，只需要传入数字即可|是|{width: 200, height: 300}|
|barStyle|Array|圆弧进度样式，按照数组元素的位置顺序渲染，一般第一个元素配置是铺满整个圆弧的底色，第二个元素配置是按照进度百分比渲染圆弧。fillStyle可以是是普通颜色和渐变颜色，使用渐变颜色是需要按照数组的格式传入各个点的位置和颜色信息|是|[{width: 12, fillStyle: '#f0f0f0'}, {width: 12, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]}]|
|needDot|Boolean|是否需要显示进度点|否|false|
|dotStyle|Array|进度点样式配置，最多支持两种样式叠加，为保证进度点的清晰显示第一个点默认添加阴影。如果第一个进度点直径比进度条更大时，为了保证在画布内完整显示进度点，绘制的进度条圆圈必须减少对应的差值，其中shadow是可选的配置，shadow的值是`(0, 0, r/2, shadow)`|否|dotStyle: [{r: 24, fillStyle: '#fff', shadow: 'rgba(0,0,0,.15)'}, {r: 10, fillStyle: '#56B37F'}]|

## 绘制函数说明
考虑到进度条在一个页面可能多次更新，所以当组件实例化完成之后，需要手动调用`draw`方法去画图
|参数名|数据类型|解析|必要参数|
|:----|:-----|:-----|:---:|
|percentage|Number|圆弧百分比，比如传入的是60，只会逆时针渲染剩余的60%圆弧|是|

## 其他说明
|问题描述|解决方案|
|:----|:-----|
|如何设置弧线端点样式|可以在`barStyle`中任何一个参数项增加`lineCap`参数，例如：barStyle: [{width: 12, lineCap: 'round', fillStyle: '#56B37F'}]，`lineCap`有效值可以[查看文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineCap.html)|
|dotStyle|如果包含shadow的话，为了保证shadow在圆环的所有都可以完整展示，会自动缩减进度条的半径|

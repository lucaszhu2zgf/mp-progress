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
  backgroundBar: {width: 12, fillStyle: '#f0f0f0'},
  foregroundBar: {width: 12, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]}
});

// 开始绘制进度，60代表60%
mprogress.draw(60);

...
<canvas class="canvas" canvas-id="progress"></canvas>
```
## 参数说明
|参数名|数据类型|解析|必要参数|
|:----|:-----|:-----|:---:|
|canvasId|String|页面canvas的id|是|
|canvasSize|Object|canvas画布的大小，对应单位是rpx，只需要传入数字即可，比如canvas的宽高分别是200rpx、300rpx，对应传入参数为{width: 200, height: 300}|是|
|backgroundBar|Object|第一层圆弧额样式配置，一般作为背景铺满完整圆弧|是|
|foregroundBar|Object|第二层圆弧额样式配置，一般作为动态进度根据percent参数决定铺满多少圆弧，如果需要使用渐变颜色，fillStyle需要按照数组的格式传入各个点的位置和颜色信息|否|
|needDot|Boolean|是否需要显示进度点|否|
|dotStyle|Array|进度点样式配置，最多支持两种样式叠加，为保证进度点的清晰显示第一个点默认添加阴影。如果第一个进度点直径比进度条更大时，为了保证在画布内完整显示进度点，绘制的进度条圆圈必须减少对应的差值|否|

## 绘制函数draw
考虑到进度条在一个页面可能多次更新，所以当组件实例化完成之后，需要手动调用drwa方法去画图
|参数名|数据类型|解析|必要参数|
|:----|:-----|:-----|:---:|
|percentage|Number|圆弧百分比，比如传入的是60，只会逆时针渲染剩余的60%圆弧|是|

## 其他说明
|问题描述|解决方案|
|:----|:-----|
|如何设置弧线端点样式|可以在backgroundBar或者foregroundBar中增加lineCap参数，例如：`foregroundBar: {width: 12, lineCap: 'round', fillStyle: '#56B37F'}`有效值可以[查看文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.setLineCap.html)|

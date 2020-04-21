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

MpProgress({
  canvasId: 'progress',
  percentage: 60,
  backgroundBar: {width: 12, fillStyle: '#f0f0f0'},
  foregroundBar: width: 12, fillStyle: [{position: 0, color: '#56B37F'}, {position: 1, color: '#c0e674'}]
});

...
<canvas class="canvas" canvas-id="progress"></canvas>
```
## 参数列表
|参数名|解析|必要参数|
|:----|:-----|:---:|
|canvasId|页面canvas的id|是|
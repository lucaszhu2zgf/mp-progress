/**
 * 渲染函数
 * @param {canvasId} String canvas标签的id
 * @param {percentage} Number 旋转百分比
 * @param {needDot} Boolean 是否需要纽扣
 * @param {dotStyle} Array 进度点样式，最多支持两种颜色，如：[{r: 3, fillStyle: '#56B37F'}]，r代表半径、fillStyle代表填充颜色
 * @param {gradientList} Array 渐变颜色定义数组
 */
class MpProgress{
  constructor(options){
    const {canvasId, canvasSize = {width: 0, height: 0}, backgroundBar, foregroundBar, needDot = false, dotStyle = []} = options;
    if (canvasId) {
      this._context = wx.createContext();
      this._options = {
        canvasId,
        needDot,
        dotStyle,
        canvasSize,
        backgroundBar,
        foregroundBar
      };
    }else{
      throw '[初始化失败]: 缺少canvasId';
    }
  }
  draw(percentage){
    if (typeof percentage === 'undefined') {
      console.warn('[绘图过程出现错误]: 调用draw方法必须传入百分比参数');
      return;
    }
    this._options.percentage = +percentage || 0;
    try {
      // 需要旋转的角度
      const deg = ((this._options.percentage/100).toFixed(2))*2*Math.PI;
      // 圆圈半径
      let _r = Math.round(this._options.canvasSize.width/2 - this._options.backgroundBar.width) - 6;

      if (this._options.needDot) {
        if (this._options.dotStyle.length > 0) {
          const circleR = this._options.dotStyle[0].r;
          const barWidth = this._options.backgroundBar.width
          if (circleR > barWidth) {
            // 4-阴影大小
            _r -= circleR - barWidth + 4;
          }
        }else{
          console.warn('参数dotStyle不完整，请检查');
          return;
        }
      }
      this._r = this.convertLength(_r);

      // 更换原点
      const originX = Math.round(this._options.canvasSize.width/2);
      const originY = Math.round(this._options.canvasSize.height/2);
      this._context.translate(this.convertLength(originX), this.convertLength(originY));
      // arc原点默认为3点钟方向，需要调整到12点
      this._context.rotate(-90 * Math.PI / 180);

      const isForegroundBarConfig = typeof this._options.foregroundBar !== 'undefined' ? true : false;

      // 画第一层
      this._context.beginPath();
      this._context.arc(0, 0, this._r, 0, isForegroundBarConfig ? 2*Math.PI : deg);
      this._context.setLineWidth(this._options.backgroundBar.width);
      this._context.setStrokeStyle(this.generateBarFillStyle(this._options.backgroundBar.fillStyle));
      const backgroundBarLineCap = this._options.backgroundBar.lineCap;
      if (backgroundBarLineCap) {
        this._context.setLineCap(backgroundBarLineCap);
      }
      this._context.stroke();

      // 画第二层
      if (isForegroundBarConfig) {
        this._context.beginPath();
        this._context.arc(0, 0, this._r, 0, deg);
        this._context.setLineWidth(this._options.foregroundBar.width);
        const foregroundBarLineCap = this._options.foregroundBar.lineCap;
        if (foregroundBarLineCap) {
          this._context.setLineCap(foregroundBarLineCap);
        }
        // this._context.setLineCap('round');
        this._context.setStrokeStyle(this.generateBarFillStyle(this._options.foregroundBar.fillStyle));
        this._context.stroke();
      }

      if (this._options.needDot) {
        this.drawBarCoordinateDot();
      }

      wx.drawCanvas({
        canvasId: this._options.canvasId,
        actions: this._context.getActions()
      });
    } catch (err) {
      console.warn('[绘图过程出现错误]: ', err);
    }
  }
  /**
   * 计算填充颜色
   * @param {config} 传入的颜色配置
   */
  generateBarFillStyle(config){
    if (typeof config === 'string') {
      // 单一色彩
      return config;
    }else{
      // 渐变色彩
      const grd = this._context.createLinearGradient(0, 0, 100, 90);
      for (let i = 0; i < config.length; i++) {
        const item = config[i];
        grd.addColorStop(item.position, item.color);
      }
      return grd;
    }
  }
  /**
   * convertLength
   * 小程序长度单位转换函数
   */
  convertLength(length) {
    return +Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
  }
  /**
   * drawCircleWithFillStyle
   * @param {context} Object canvas 2d context
   * @param {style} Object 圆的样式参数
   */
  drawCircleWithFillStyle(style){
    console.log(style)
    this._context.beginPath();
    this._context.arc(style.x, style.y, this.convertLength(style.r), 0, 2 * Math.PI);
    this._context.setFillStyle(style.fillStyle || '#ffffff');
    if (style.needShadow) {
      this._context.setShadow(0, 0, this.convertLength(style.r/2), 'rgba(86,179,127,0.5)');
    }
    this._context.fill();
  }
  /**
   * drawBarCoordinateDot
   * @param {percentage} Number 旋转百分比
   */
  drawBarCoordinateDot(){
    // 数学夹脚
    const mathDeg = ((this._options.percentage/100).toFixed(2))*360;
    // 计算弧度
    let radian = '';
    // 三角函数cos=y/r，sin=x/r，分别得到小点的x、y坐标
    let x = 0;
    let y = 0;
    if (mathDeg <= 90) {
      // 求弧度
      radian = 2*Math.PI/360*mathDeg;
      x = Math.round(Math.cos(radian)*this._r);
      y = Math.round(Math.sin(radian)*this._r);
    } else if (mathDeg > 90 && mathDeg <= 180) {
      // 求弧度
      radian = 2*Math.PI/360*(180 - mathDeg);
      x = -Math.round(Math.cos(radian)*this._r);
      y = Math.round(Math.sin(radian)*this._r);
    } else if (mathDeg > 180 && mathDeg <= 270) {
      // 求弧度
      radian = 2*Math.PI/360*(mathDeg - 180);
      x = -Math.round(Math.cos(radian)*this._r);
      y = -Math.round(Math.sin(radian)*this._r);
    } else{
      // 求弧度
      radian = 2*Math.PI/360*(360 - mathDeg);
      x = Math.round(Math.cos(radian)*this._r);
      y = -Math.round(Math.sin(radian)*this._r);
    }
    // console.log(x, y);

    if (this._options.dotStyle.length > 0) {
      // 画背景大点
      this.drawCircleWithFillStyle({x, y, needShadow: true, ...this._options.dotStyle[0]});
    }else{
      console.warn('参数dotStyle不完整，请检查');
    }

    if (this._options.dotStyle.length > 1) {
      // 画前景小点
      this.drawCircleWithFillStyle({x, y, ...this._options.dotStyle[1]});
    }
  }
}

export default MpProgress;

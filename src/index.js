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
    const {canvasId, canvasSize = {width: 0, height: 0}, percentage = 0, backgroundBar = {}, foregroundBar = {}, needDot = false, dotStyle = []} = options;
    if (canvasId) {
      this._context = wx.createContext();
      this._options = {
        needDot,
        dotStyle,
        canvasSize,
        percentage,
        backgroundBar,
        foregroundBar
      };
    }else{
      throw '[初始化失败]: 缺少canvasId';
    }
  }
  drawFn(){
    // 需要旋转的角度
    const deg = ((this._options.percentage).toFixed(2))*2*Math.PI;
    // 圆圈半径
    const r = this.convertLength(Math.round(this._options.canvasSize.width/2 - backgroundBar.width/2));

    // 更换原点
    const originX = Math.round(this._options.canvasSize.width/2);
    const originY = Math.round(this._options.canvasSize.height/2);
    context.translate(convertLength(originX), convertLength(originY));
    // arc原点默认为3点钟方向，需要调整到12点
    context.rotate(-90 * Math.PI / 180);

    // 画底圈
    context.beginPath();
    context.arc(0, 0, r, 0, 2*Math.PI);
    context.setLineWidth(this._options.backgroundBar.width);
    context.setStrokeStyle(this._options.backgroundBar.fillStyle);
    context.stroke();

    // 画进度圈
    let foregroundBarFillStyle = '';
    const {fillStyle} = this._options.foregroundBar;
    if (typeof this._options.foregroundBar.fillStyle === 'string') {
      // 单一色彩
      foregroundBarFillStyle = fillStyle;
    }else{
      // 渐变色彩
      const grd = context.createLinearGradient(0, 0, 100, 90);
      for (let i = 0; i < fillStyle.length; i++) {
        const item = fillStyle[i];
        grd.addColorStop(item.position, item.color);
      }
      foregroundBarFillStyle = grd;
    }

    context.beginPath();
    context.arc(0, 0, r, 0, deg);
    context.setLineWidth(this._options.foregroundBar.width);
    // context.setLineCap('round');
    context.setStrokeStyle(foregroundBarFillStyle);
    context.stroke();

    if (needDot) {
      this.drawBarCoordinateDot();
    }

    wx.drawCanvas({
      canvasId: this._options.canvasId,
      actions: context.getActions()
    });
  }
  /**
   * convertLength
   * 小程序长度单位转换函数
   */
  static convertLength(length) {
    return +Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
  }
  /**
   * drawCircleWithFillStyle
   * @param {context} Object canvas 2d context
   * @param {style} Object 圆的样式参数
   */
  static drawCircleWithFillStyle(style){
    this._context.beginPath();
    this._context.arc(style.x, style.y, this.convertLength(style.r), 0, 2 * Math.PI);
    this._context.setFillStyle(style.fillStyle || '#ffffff');
    this._context.fill();
  }
  /**
   * drawBarCoordinateDot
   * @param {percentage} Number 旋转百分比
   */
  static drawBarCoordinateDot(){
    // 数学夹脚
    const mathDeg = ((this._options.percentage).toFixed(2))*360;
    // 计算弧度
    let radian = '';
    // 三角函数cos=y/r，sin=x/r，分别得到小点的x、y坐标
    let x = 0;
    let y = 0;
    if (mathDeg <= 90) {
      // 求弧度
      radian = 2*Math.PI/360*mathDeg;
      x = Math.round(Math.cos(radian)*r);
      y = Math.round(Math.sin(radian)*r);
    } else if (mathDeg > 90 && mathDeg <= 180) {
      // 求弧度
      radian = 2*Math.PI/360*(180 - mathDeg);
      x = -Math.round(Math.cos(radian)*r);
      y = Math.round(Math.sin(radian)*r);
    } else if (mathDeg > 180 && mathDeg <= 270) {
      // 求弧度
      radian = 2*Math.PI/360*(mathDeg - 180);
      x = -Math.round(Math.cos(radian)*r);
      y = -Math.round(Math.sin(radian)*r);
    } else{
      // 求弧度
      radian = 2*Math.PI/360*(360 - mathDeg);
      x = Math.round(Math.cos(radian)*r);
      y = -Math.round(Math.sin(radian)*r);
    }
    console.log(x, y);

    if (this._options.dotStyle.length > 0) {
      // 画背景大点
      this.drawCircleWithFillStyle({x, y, ...dotStyle[0]});
    }

    if (this._options.dotStyle.length > 1) {
      // 画前景小店
      this.drawCircleWithFillStyle({x, y, ...dotStyle[1]});
    }
  }
}


export default function({canvasId, percentage = 0, needDot = false, dotStyle = []}){
  if (canvasId) {
    // 需要旋转的角度
    const deg = ((percentage).toFixed(2))*2*Math.PI;
    // 圆圈半径
    const r = convertLength(170);

    var context = wx.createContext();
    const grd = context.createLinearGradient(0, 0, 100, 90);
    grd.addColorStop(0, '#56B37F');
    grd.addColorStop(1, '#c0e674');
    // 更换原点
    context.translate(convertLength(200), convertLength(200));
    // arc原点默认为3点钟方向，需要调整到12点
    context.rotate(-90 * Math.PI / 180);

    // 打底灰色曲线
    context.beginPath();
    context.arc(0, 0, r, 0, 2*Math.PI);
    context.setLineWidth(12);
    context.setStrokeStyle('#f0f0f0');
    context.stroke();

    // 画渐变曲线
    context.beginPath();
    context.arc(0, 0, r, 0, deg);
    context.setLineWidth(12);
    // context.setLineCap('round');
    context.setStrokeStyle(grd);
    context.stroke();

    if (needDot) {
      drawBarCoordinateDot({percentage, context, dotStyle});
    }

    wx.drawCanvas({
      canvasId: 'progress',
      actions: context.getActions()
    });
  }else{
    console.error('canvasId不能为空');
  }
};
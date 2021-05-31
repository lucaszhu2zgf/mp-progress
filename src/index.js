/**
 * 渲染函数
 * @param {canvasId} String canvas标签的id
 * @param {percentage} Number 旋转百分比
 * @param {needDot} Boolean 是否需要纽扣
 * @param {dotStyle} Array 进度点样式，最多支持两种颜色，如：[{r: 3, fillStyle: '#56B37F'}]，r代表半径、fillStyle代表填充颜色
 * @param {gradientList} Array 渐变颜色定义数组
 */
class MpProgress {
    constructor(options) {
        const {
            canvasId,
            canvasSize = {
                width: 400,
                height: 400
            },
            percent = 100,
            barStyle = {},
            needDot = false,
            dotStyle = [],
            target = null
        } = options;

        if (canvasId) {
            // 定义展示圆环的百分比，百分比不少于50%
            this._percent = percent < 50 ? 50 : (percent > 100 ? 100 : percent);
            this._options = {
                canvasId,
                needDot,
                dotStyle,
                canvasSize,
                barStyle,
                target
            };
            this._barIndex = 0;
            this.isInit = false;
        } else {
            throw '[初始化失败]: 缺少canvasId';
        }
    }
    draw(percentage) {
        const version = wx.getSystemInfoSync().SDKVersion
        if (this.compareVersion(version, '2.7.0') < 0) {
            console.error(`请在2.7.0以上的SDK中使用，当前SDK版本：${version}`);
            return;
        }

        if (typeof percentage === 'undefined') {
            console.warn('[绘图过程出现错误]: 调用draw方法必须传入百分比参数');
            return;
        }

        if (percentage < 0) {
            percentage = 0;
            console.warn('[参数percentagegit<0]: 已自动调整为0');
        }

        if (percentage > 100) {
            percentage = 100;
            console.warn('[参数percentage>100]: 已自动调整为100');
        }

        this._options.percentage = +percentage || 0;
        if (this._context) {
            // context初始化完毕
            this.drawFn();
        } else {
            try {
                const _target = this._options.target;
                let query = wx.createSelectorQuery().in(_target);
                if (_target.$wx && _target.$wx.$wepy) {
                    // wepy不支持in的方式去查找
                    query = wx.createSelectorQuery();
                }
                query
                    .select(`#${this._options.canvasId}`)
                    .node((res) => {
                        console.log(res)
                        const canvas = res.node;
                        this._requestAnimationFrame = canvas.requestAnimationFrame.bind(canvas);
                        const ctx = canvas.getContext('2d');
                        const dpr = wx.getSystemInfoSync().pixelRatio;
                        canvas.width = canvas._width * dpr;
                        canvas.height = canvas._height * dpr;
                        ctx.scale(dpr, dpr);
                        this._context = ctx;

                        this.drawFn();
                    }).exec();
            } catch (err) {
                console.warn(err);
            }
        }
    }
    drawFn(){
        try {
            const {
                barStyle
            } = this._options;
            if (barStyle.length > 0) {
                if (this.isInit) {
                    console.log(this._positionInfo)
                    // 需要清除画布
                    if (this._percent === 100) {
                        this._context.clearRect(-this._positionInfo.originX, -this._positionInfo.originY, this.convertLength(this._options.canvasSize.width), this.convertLength(this._options.canvasSize.height));
                    } else {
                        this._context.clearRect(-this._positionInfo.originX, -this.convertLength(this._options.canvasSize.height)/2, this.convertLength(this._options.canvasSize.width), this.convertLength(this._options.canvasSize.height));
                    }
                    // 重置shadow相关的参数，否则进度条会变粗
                    this._context.shadowColor = 'transparent';
                    this._context.shadowBlur = 0;
                }else{
                    console.log('init');
                    // 找到最大宽度的bar
                    let maxBarWidth = 0;
                    for (let j = 0; j < barStyle.length; j++) {
                        const _width = barStyle[j].width;
                        if (_width > maxBarWidth) {
                            maxBarWidth = _width;
                        }
                    }
                    // 取canvas的height计算圆圈半径取
                    let _r = 0;
                    const cosP = Math.cos(2 * Math.PI / 360 * ((100 - this._percent) / 2 / 100 * 360));
                    if (this._percent === 100) {
                        _r = ((Math.min(this._options.canvasSize.width, this._options.canvasSize.height) - 2 * maxBarWidth) / 2).toFixed(2);
                    } else {
                        _r = (Math.min(this._options.canvasSize.width / 2, (this._options.canvasSize.height - 2 * maxBarWidth) / (1 + cosP)) - maxBarWidth).toFixed(2);
                    }

                    // 更换原点
                    const originX = Math.round(this._options.canvasSize.width / 2);
                    let originY = 0;
                    if (this._percent === 100) {
                        originY = Math.round(this._options.canvasSize.height / 2);
                    } else {
                        originY = Math.round(this._options.canvasSize.height / (1 + cosP));
                    }

                    // 基础数据初始化完成
                    this.isInit = true;

                    if (this._options.needDot) {
                        // 考虑剔除进度点的宽度差以及进度点阴影的宽度查
                        if (this._options.dotStyle.length > 0) {
                            const circleR = this._options.dotStyle[0].r;
                            if (circleR*2 > maxBarWidth) {
                                const shadowDiff = this._options.dotStyle[0].shadow ? circleR / 4 : 0;
                                _r -= circleR - maxBarWidth + shadowDiff;
                                if (this._percent !== 100) {
                                    originY -= circleR + shadowDiff;
                                }
                            }
                        } else {
                            console.warn('参数dotStyle不完整，请检查');
                            return;
                        }
                    }

                    console.log(originX, originY, this.convertLength(originX), this.convertLength(originY));
                    // arc原点默认为3点钟方向，需要调整到12点
                    const rotateDeg = this._percent === 100 ? -90 : (((100 - this._percent) + (this._percent - 50) / 2) / 100).toFixed(2) * 360;

                    this._positionInfo = {originX: this.convertLength(originX), originY: this.convertLength(originY)};

                    this._context.translate(this._positionInfo.originX, this._positionInfo.originY);
                    this._context.rotate(rotateDeg * Math.PI / 180);

                    console.log('_r', _r)
                    this._r = this.convertLength(_r);
                }

                // 需要旋转的角度
                this.deg = ((this._options.percentage / 100).toFixed(2)) * 2 * Math.PI;

                (barStyle || []).forEach((item, index) => {
                    // 重置percent以免出现计算数据不归为的问题
                    item.percent = 0;
                    this._barIndex = index;
                    this.drawBar();
                });

                if (this.hasAnimateBar) {
                    console.warn('animate和dotStyle不可同时使用');
                } else {
                    if (this._options.needDot) {
                        this.drawBarCoordinateDot();
                    }
                }
            } else {
                console.warn('参数barStyle不符合要求，请检查');
            }
        } catch (err) {
            console.warn('[绘图过程出现错误]: ', err);
        }
    }
    drawBar(){
        let currentBar = this._options.barStyle[this._barIndex];
        const isLastBar = (this._options.barStyle.length - 1) === this._barIndex;
        const barDeg = (isLastBar ? this.deg : 2 * Math.PI) * this._percent / 100;
        const diff = 2;

        // let startAngle = 0;
        let endAngle = barDeg;
        if (isLastBar && currentBar.animate && currentBar.percent < 100) {
            this.hasAnimateBar = true;
            if (currentBar.percent) {
                currentBar.percent += diff;
            } else {
                currentBar.percent = diff;
            }
            // startAngle = barDeg*((currentBar.percent - diff)/100);
            endAngle = barDeg*((currentBar.percent)/100);
        }
        // console.log(`startAngle: ${startAngle}, endAngle: ${endAngle}`);
        console.log(`endAngle: ${endAngle}`);
        this._context.beginPath();
        this._context.arc(0, 0, this._r, 0, endAngle);
        this._context.lineWidth = this.convertLength(currentBar.width);
        this._context.strokeStyle = this.generateBarFillStyle(currentBar.fillStyle);
        const barLineCap = currentBar.lineCap;
        if (barLineCap) {
            this._context.lineCap = barLineCap;
        }
        this._context.stroke();
        if (isLastBar && currentBar.animate) {
            if (currentBar.percent < 100) {
                this._requestAnimationFrame(this.drawBar.bind(this));
            }
        }
    }
    compareVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        const len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
          v1.push('0');
        }
        while (v2.length < len) {
          v2.push('0');
        }

        for (let i = 0; i < len; i++) {
          const num1 = parseInt(v1[i]);
          const num2 = parseInt(v2[i]);

          if (num1 > num2) {
            return 1;
          } else if (num1 < num2) {
            return -1;
          }
        }

        return 0;
    }
    /**
     * 计算填充颜色
     * @param {config} 传入的颜色配置
     */
    generateBarFillStyle(config) {
        if (typeof config === 'string') {
            // 单一色彩
            return config;
        } else {
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
    drawCircleWithFillStyle(style) {
        console.log(style)
        this._context.beginPath();
        this._context.arc(style.x, style.y, this.convertLength(style.r), 0, 2 * Math.PI);
        this._context.fillStyle = style.fillStyle || '#ffffff';

        if (style.shadow) {
            this._context.shadowOffsetX = 0;
            this._context.shadowOffsetY = 0;
            this._context.shadowColor = style.shadow;
            this._context.shadowBlur = this.convertLength(style.r / 2);
        }
        this._context.fill();
    }
    /**
     * drawBarCoordinateDot
     * @param {percentage} Number 旋转百分比
     */
    drawBarCoordinateDot() {
        // 数学夹脚
        const mathDeg = (((this._options.percentage / 100) * this._percent / 100).toFixed(2)) * 360;
        // 计算弧度
        let radian = '';
        // 三角函数cos=y/r，sin=x/r，分别得到小点的x、y坐标
        let x = 0;
        let y = 0;
        if (mathDeg <= 90) {
            // 求弧度
            radian = 2 * Math.PI / 360 * mathDeg;
            x = (Math.cos(radian) * this._r).toFixed(2);
            y = (Math.sin(radian) * this._r).toFixed(2);
        } else if (mathDeg > 90 && mathDeg <= 180) {
            // 求弧度
            radian = 2 * Math.PI / 360 * (180 - mathDeg);
            x = -(Math.cos(radian) * this._r).toFixed(2);
            y = (Math.sin(radian) * this._r).toFixed(2);
        } else if (mathDeg > 180 && mathDeg <= 270) {
            // 求弧度
            radian = 2 * Math.PI / 360 * (mathDeg - 180);
            x = -(Math.cos(radian) * this._r).toFixed(2);
            y = -(Math.sin(radian) * this._r).toFixed(2);
        } else {
            // 求弧度
            radian = 2 * Math.PI / 360 * (360 - mathDeg);
            x = (Math.cos(radian) * this._r).toFixed(2);
            y = -(Math.sin(radian) * this._r).toFixed(2);
        }
        // console.log(x, y);

        if (this._options.dotStyle.length > 0) {
            // 画背景大点
            this.drawCircleWithFillStyle({
                x,
                y,
                ...this._options.dotStyle[0]
            });
        } else {
            console.warn('参数dotStyle不完整，请检查');
        }

        if (this._options.dotStyle.length > 1) {
            // 画前景小点
            this.drawCircleWithFillStyle({
                x,
                y,
                ...this._options.dotStyle[1]
            });
        }
    }
}

export default MpProgress;
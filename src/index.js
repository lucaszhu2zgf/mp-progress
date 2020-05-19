/**
 * 渲染函数
 * @param {context} 上下文对象
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
                width: 0,
                height: 0
            },
            percent = 100,
            barStyle = {},
            needDot = false,
            dotStyle = []
        } = options;
        if (canvasId) {
            this._context = wx.createSelectorQuery().in(options.context);
            // 定义展示圆环的百分比，百分比不少于50%
            this._percent = percent < 50 ? 50 : (percent > 100 ? 100 : percent);
            this._options = {
                canvasId,
                needDot,
                dotStyle,
                canvasSize,
                barStyle
            };
        } else {
            throw '[初始化失败]: 缺少canvasId';
        }
    }
    draw(percentage) {
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
        this._context.select(this._options.canvasId)
            .fields({
                node: true,
                size: true
            })
            .exec((res) => {
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                ctx.scale(dpr, dpr)
                this._options.percentage = +percentage || 0;
                try {
                    const {
                        barStyle
                    } = this._options;
                    if (barStyle.length > 0) {
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

                        if (this._options.needDot) {
                            // 考虑剔除进度点的宽度差以及进度点阴影的宽度查
                            if (this._options.dotStyle.length > 0) {
                                const circleR = this._options.dotStyle[0].r;
                                if (circleR > maxBarWidth) {
                                    const diff = circleR - maxBarWidth + (this._options.dotStyle[0].shadow ? circleR / 2 : 0);
                                    _r -= diff;
                                    if (this._percent !== 100) {
                                        originY -= diff;
                                    }
                                }
                            } else {
                                console.log(this._options.dotStyle)
                                console.warn('参数dotStyle不完整，请检查');
                                return;
                            }
                        }
                        ctx.translate(this.convertLength(originX), this.convertLength(originY));
                        // arc原点默认为3点钟方向，需要调整到12点
                        const rotateDeg = this._percent === 100 ? -90 : (((100 - this._percent) + (this._percent - 50) / 2) / 100).toFixed(2) * 360;
                        ctx.rotate(rotateDeg * Math.PI / 180);
                        console.log('_r', _r)
                        this._r = this.convertLength(_r);
                        // 需要旋转的角度
                        const deg = ((this._options.percentage / 100).toFixed(2)) * 2 * Math.PI;
                        for (let i = 0, len = barStyle.length; i < barStyle.length; i++) {
                            ((i) => {
                                const bar = barStyle[i];
                                ctx.beginPath();
                                ctx.arc(0, 0, this._r, 0, (i === len - 1 ? deg : 2 * Math.PI) * this._percent / 100);
                                ctx.lineWidth = this.convertLength(bar.width);
                                ctx.strokeStyle = this.generateBarFillStyle(ctx, bar.fillStyle);
                                const barLineCap = bar.lineCap;
                                if (barLineCap) {
                                    ctx.lineCap = barLineCap;
                                }
                                ctx.stroke();
                            })(i);
                        }
                    } else {
                        console.warn('参数barStyle不符合要求，请检查');
                        return;
                    }
                    if (this._options.needDot) {
                        this.drawBarCoordinateDot(ctx);
                    }
                } catch (err) {
                    console.warn('[绘图过程出现错误]: ', err);
                }
            })

    }
    /**
     * 计算填充颜色
     * @param {config} 传入的颜色配置
     */
    generateBarFillStyle(ctx, config) {
        if (typeof config === 'string') {
            // 单一色彩
            return config;
        } else {
            // 渐变色彩
            const grd = ctx.createLinearGradient(0, 0, 100, 90);
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
    drawCircleWithFillStyle(ctx, style) {
        console.log(style)
        ctx.beginPath();
        ctx.arc(style.x, style.y, this.convertLength(style.r), 0, 2 * Math.PI);
        ctx.fillStyle = style.fillStyle || '#ffffff';
        if (style.shadow) {
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
            ctx.shadowColor = style.shadow
            ctx.shadowBlur = this.convertLength(style.r / 2)
        }
        ctx.fill();
    }
    /**
     * drawBarCoordinateDot
     * @param {percentage} Number 旋转百分比
     */
    drawBarCoordinateDot(ctx) {
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
            this.drawCircleWithFillStyle(ctx, {
                x,
                y,
                ...this._options.dotStyle[0]
            });
        } else {
            console.warn('参数dotStyle不完整，请检查');
        }

        if (this._options.dotStyle.length > 1) {
            // 画前景小点
            this.drawCircleWithFillStyle(ctx, {
                x,
                y,
                ...this._options.dotStyle[1]
            });
        }
    }
}

export default MpProgress;
import MpProgress from "../progress.min.js";

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        config: {
            type: Object,
            value: {}
        },
        percentage: {
            type: Number,
            value: 0
        }
    },
    data: {
        customOptions: {
            canvasSize: {
                width: 400,
                height: 400
            },
            percent: 100
        },
        canvasId: `mp_progress_${new Date().getTime()}`
    },
    attached() {
        const customOptions = Object.assign({}, this.data.customOptions, this.data.config);
        this.setData({customOptions});
    },
    ready() {
        this._mpprogress = new MpProgress(Object.assign({}, this.data.customOptions, {canvasId: this.data.canvasId, target: this}));
        this._mpprogress.draw(this.data.percentage || 0);
    },
    observers: {
        'percentage': function (percentage) {
            if (this._mpprogress) {
                // 第一次进来的时候还没有初始化完成
                this._mpprogress.draw(percentage);
            }
        },
    }
});

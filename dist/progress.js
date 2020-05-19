/*! mp-progress.js v1.1.4 https://www.npmjs.com/package/mp-progress */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MpProgress"] = factory();
	else
		root["MpProgress"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 渲染函数
 * @param {canvasId} String canvas标签的id
 * @param {percentage} Number 旋转百分比
 * @param {needDot} Boolean 是否需要纽扣
 * @param {dotStyle} Array 进度点样式，最多支持两种颜色，如：[{r: 3, fillStyle: '#56B37F'}]，r代表半径、fillStyle代表填充颜色
 * @param {gradientList} Array 渐变颜色定义数组
 */
var MpProgress = /*#__PURE__*/function () {
  function MpProgress(options) {
    _classCallCheck(this, MpProgress);

    var canvasId = options.canvasId,
        _options$canvasSize = options.canvasSize,
        canvasSize = _options$canvasSize === void 0 ? {
      width: 0,
      height: 0
    } : _options$canvasSize,
        _options$percent = options.percent,
        percent = _options$percent === void 0 ? 100 : _options$percent,
        _options$barStyle = options.barStyle,
        barStyle = _options$barStyle === void 0 ? {} : _options$barStyle,
        _options$needDot = options.needDot,
        needDot = _options$needDot === void 0 ? false : _options$needDot,
        _options$dotStyle = options.dotStyle,
        dotStyle = _options$dotStyle === void 0 ? [] : _options$dotStyle;

    if (canvasId) {
      this._context = wx.createContext(); // 定义展示圆环的百分比，百分比不少于50%

      this._percent = percent < 50 ? 50 : percent > 100 ? 100 : percent;
      this._options = {
        canvasId: canvasId,
        needDot: needDot,
        dotStyle: dotStyle,
        canvasSize: canvasSize,
        barStyle: barStyle
      };
    } else {
      throw '[初始化失败]: 缺少canvasId';
    }
  }

  _createClass(MpProgress, [{
    key: "draw",
    value: function draw(percentage) {
      var _this = this;

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

      try {
        var _ret = function () {
          var barStyle = _this._options.barStyle;

          if (barStyle.length > 0) {
            var _ret2 = function () {
              // 找到最大宽度的bar
              var maxBarWidth = 0;

              for (var j = 0; j < barStyle.length; j++) {
                var _width = barStyle[j].width;

                if (_width > maxBarWidth) {
                  maxBarWidth = _width;
                }
              } // 取canvas的height计算圆圈半径取


              var _r = 0;
              var cosP = Math.cos(2 * Math.PI / 360 * ((100 - _this._percent) / 2 / 100 * 360));

              if (_this._percent === 100) {
                _r = ((Math.min(_this._options.canvasSize.width, _this._options.canvasSize.height) - 2 * maxBarWidth) / 2).toFixed(2);
              } else {
                _r = (Math.min(_this._options.canvasSize.width / 2, (_this._options.canvasSize.height - 2 * maxBarWidth) / (1 + cosP)) - maxBarWidth).toFixed(2);
              } // 更换原点


              var originX = Math.round(_this._options.canvasSize.width / 2);
              var originY = 0;

              if (_this._percent === 100) {
                originY = Math.round(_this._options.canvasSize.height / 2);
              } else {
                originY = Math.round(_this._options.canvasSize.height / (1 + cosP));
              }

              if (_this._options.needDot) {
                // 考虑剔除进度点的宽度差以及进度点阴影的宽度查
                if (_this._options.dotStyle.length > 0) {
                  var circleR = _this._options.dotStyle[0].r;

                  if (circleR > maxBarWidth) {
                    var diff = circleR - maxBarWidth + (_this._options.dotStyle[0].shadow ? circleR / 2 : 0);
                    _r -= diff;

                    if (_this._percent !== 100) {
                      originY -= diff;
                    }
                  }
                } else {
                  console.warn('参数dotStyle不完整，请检查');
                  return {
                    v: {
                      v: void 0
                    }
                  };
                }
              }

              console.log(originX, originY);

              _this._context.translate(_this.convertLength(originX), _this.convertLength(originY)); // arc原点默认为3点钟方向，需要调整到12点


              var rotateDeg = _this._percent === 100 ? -90 : ((100 - _this._percent + (_this._percent - 50) / 2) / 100).toFixed(2) * 360;

              _this._context.rotate(rotateDeg * Math.PI / 180);

              console.log('_r', _r);
              _this._r = _this.convertLength(_r); // 需要旋转的角度

              var deg = (_this._options.percentage / 100).toFixed(2) * 2 * Math.PI;

              var _loop = function _loop(i, len) {
                (function (i) {
                  var bar = barStyle[i];

                  _this._context.beginPath();

                  _this._context.arc(0, 0, _this._r, 0, (i === len - 1 ? deg : 2 * Math.PI) * _this._percent / 100);

                  _this._context.setLineWidth(_this.convertLength(bar.width));

                  _this._context.setStrokeStyle(_this.generateBarFillStyle(bar.fillStyle));

                  var barLineCap = bar.lineCap;

                  if (barLineCap) {
                    _this._context.setLineCap(barLineCap);
                  }

                  _this._context.stroke();
                })(i);
              };

              for (var i = 0, len = barStyle.length; i < barStyle.length; i++) {
                _loop(i, len);
              }
            }();

            if (_typeof(_ret2) === "object") return _ret2.v;
          } else {
            console.warn('参数barStyle不符合要求，请检查');
            return {
              v: void 0
            };
          }

          if (_this._options.needDot) {
            _this.drawBarCoordinateDot();
          }

          wx.drawCanvas({
            canvasId: _this._options.canvasId,
            actions: _this._context.getActions()
          });
        }();

        if (_typeof(_ret) === "object") return _ret.v;
      } catch (err) {
        console.warn('[绘图过程出现错误]: ', err);
      }
    }
    /**
     * 计算填充颜色
     * @param {config} 传入的颜色配置
     */

  }, {
    key: "generateBarFillStyle",
    value: function generateBarFillStyle(config) {
      if (typeof config === 'string') {
        // 单一色彩
        return config;
      } else {
        // 渐变色彩
        var grd = this._context.createLinearGradient(0, 0, 100, 90);

        for (var i = 0; i < config.length; i++) {
          var item = config[i];
          grd.addColorStop(item.position, item.color);
        }

        return grd;
      }
    }
    /**
     * convertLength
     * 小程序长度单位转换函数
     */

  }, {
    key: "convertLength",
    value: function convertLength(length) {
      return +Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
    }
    /**
     * drawCircleWithFillStyle
     * @param {context} Object canvas 2d context
     * @param {style} Object 圆的样式参数
     */

  }, {
    key: "drawCircleWithFillStyle",
    value: function drawCircleWithFillStyle(style) {
      console.log(style);

      this._context.beginPath();

      this._context.arc(style.x, style.y, this.convertLength(style.r), 0, 2 * Math.PI);

      this._context.setFillStyle(style.fillStyle || '#ffffff');

      if (style.shadow) {
        this._context.setShadow(0, 0, this.convertLength(style.r / 2), style.shadow);
      }

      this._context.fill();
    }
    /**
     * drawBarCoordinateDot
     * @param {percentage} Number 旋转百分比
     */

  }, {
    key: "drawBarCoordinateDot",
    value: function drawBarCoordinateDot() {
      // 数学夹脚
      var mathDeg = (this._options.percentage / 100 * this._percent / 100).toFixed(2) * 360; // 计算弧度

      var radian = ''; // 三角函数cos=y/r，sin=x/r，分别得到小点的x、y坐标

      var x = 0;
      var y = 0;

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
      } // console.log(x, y);


      if (this._options.dotStyle.length > 0) {
        // 画背景大点
        this.drawCircleWithFillStyle(_objectSpread({
          x: x,
          y: y
        }, this._options.dotStyle[0]));
      } else {
        console.warn('参数dotStyle不完整，请检查');
      }

      if (this._options.dotStyle.length > 1) {
        // 画前景小点
        this.drawCircleWithFillStyle(_objectSpread({
          x: x,
          y: y
        }, this._options.dotStyle[1]));
      }
    }
  }]);

  return MpProgress;
}();

/* harmony default export */ __webpack_exports__["default"] = (MpProgress);

/***/ })
/******/ ])["default"];
});
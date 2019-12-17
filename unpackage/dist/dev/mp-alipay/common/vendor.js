(my["webpackJsonp"] = my["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _my$getSystemInfoSync =




  my.getSystemInfoSync(),platform = _my$getSystemInfoSync.platform,pixelRatio = _my$getSystemInfoSync.pixelRatio,windowWidth = _my$getSystemInfoSync.windowWidth; // uni=>my runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


// 不支持的 API 列表
var todos = [
'saveImageToPhotosAlbum',
'getRecorderManager',
'getBackgroundAudioManager',
'createInnerAudioContext',
'createVideoContext',
'createCameraContext',
'createLivePlayerContext',
'openDocument',
'onMemoryWarning',
'startAccelerometer',
'startCompass',
'addPhoneContact',
'authorize',
'chooseAddress',
'chooseInvoiceTitle',
'addTemplate',
'deleteTemplate',
'getTemplateLibraryById',
'getTemplateLibraryList',
'getTemplateList',
'sendTemplateMessage',
'setEnableDebug',
'getExtConfig',
'getExtConfigSync',
'onWindowResize',
'offWindowResize',
'saveVideoToPhotosAlbum'];


// 存在兼容性的 API 列表
var canIUses = [
'startPullDownRefresh',
'setTabBarItem',
'setTabBarStyle',
'hideTabBar',
'showTabBar',
'setTabBarBadge',
'removeTabBarBadge',
'showTabBarRedDot',
'hideTabBarRedDot',
'openSetting',
'getSetting',
'createIntersectionObserver',
'getUpdateManager',
'setBackgroundColor',
'setBackgroundTextStyle'];


function _handleNetworkInfo(result) {
  switch (result.networkType) {
    case 'NOTREACHABLE':
      result.networkType = 'none';
      break;
    case 'WWAN':
      // TODO ?
      result.networkType = '3g';
      break;
    default:
      result.networkType = result.networkType.toLowerCase();
      break;}

  return {};
}

function _handleSystemInfo(result) {
  var platform = result.platform ? result.platform.toLowerCase() : 'devtools';
  if (!~['android', 'ios'].indexOf(platform)) {
    platform = 'devtools';
  }
  result.platform = platform;
}

var protocols = { // 需要做转换的 API 列表
  returnValue: function returnValue(methodName) {var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}; // 通用 returnValue 解析
    if (res.error || res.errorMessage) {
      res.errMsg = "".concat(methodName, ":fail ").concat(res.errorMessage || res.error);
      delete res.error;
      delete res.errorMessage;
    } else {
      res.errMsg = "".concat(methodName, ":ok");
    }
    return res;
  },
  request: {
    name: my.canIUse('request') ? 'request' : 'httpRequest',
    args: function args(fromArgs) {
      if (!fromArgs.header) {// 默认增加 header 参数，方便格式化 content-type
        fromArgs.header = {};
      }
      return {
        header: function header() {var _header = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var toArgs = arguments.length > 1 ? arguments[1] : undefined;
          var headers = {
            'content-type': 'application/json' };

          Object.keys(_header).forEach(function (key) {
            headers[key.toLocaleLowerCase()] = _header[key];
          });
          return {
            name: 'headers',
            value: headers };

        },
        method: 'method', // TODO 支付宝小程序仅支持 get,post
        responseType: false };

    },
    returnValue: {
      status: 'statusCode',
      headers: 'header' } },


  setNavigationBarColor: {
    name: 'setNavigationBar',
    args: {
      frontColor: false,
      animation: false } },


  setNavigationBarTitle: {
    name: 'setNavigationBar' },

  showModal: function showModal()

  {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$showCancel = _ref.showCancel,showCancel = _ref$showCancel === void 0 ? true : _ref$showCancel;
    if (showCancel) {
      return {
        name: 'confirm',
        args: {
          cancelColor: false,
          confirmColor: false,
          cancelText: 'cancelButtonText',
          confirmText: 'confirmButtonText' },

        returnValue: function returnValue(fromRes, toRes) {
          toRes.confirm = fromRes.confirm;
          toRes.cancel = !fromRes.confirm;
        } };

    }
    return {
      name: 'alert',
      args: {
        confirmColor: false,
        confirmText: 'buttonText' },

      returnValue: function returnValue(fromRes, toRes) {
        toRes.confirm = true;
        toRes.cancel = false;
      } };

  },
  showToast: function showToast()

  {var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref2$icon = _ref2.icon,icon = _ref2$icon === void 0 ? 'success' : _ref2$icon;
    var args = {
      title: 'content',
      icon: 'type',
      duration: false,
      image: false,
      mask: false };

    if (icon === 'loading') {
      return {
        name: 'showLoading',
        args: args };

    }
    return {
      name: 'showToast',
      args: args };

  },
  showActionSheet: {
    name: 'showActionSheet',
    args: {
      itemList: 'items',
      itemColor: false },

    returnValue: {
      index: 'tapIndex' } },


  showLoading: {
    args: {
      title: 'content',
      mask: false } },


  uploadFile: {
    args: {
      name: 'fileName'

      // 从测试结果看，是有返回对象的，文档上没有说明。
    } },
  downloadFile: {
    returnValue: {
      apFilePath: 'tempFilePath' } },


  chooseVideo: {
    // 支付宝小程序文档中未找到（仅在getSetting处提及），但实际可用
    returnValue: {
      apFilePath: 'tempFilePath' } },


  connectSocket: {
    args: {
      method: false,
      protocols: false

      // TODO 有没有返回值还需要测试下
    } },
  chooseImage: {
    returnValue: {
      apFilePaths: 'tempFilePaths' } },


  previewImage: {
    args: function args(fromArgs) {
      // 支付宝小程序的 current 是索引值，而非图片地址。
      var currentIndex = Number(fromArgs.current);
      if (isNaN(currentIndex)) {
        if (fromArgs.current && Array.isArray(fromArgs.urls)) {
          var index = fromArgs.urls.indexOf(fromArgs.current);
          fromArgs.current = ~index ? index : 0;
        }
      } else {
        fromArgs.current = currentIndex;
      }
      return {
        indicator: false,
        loop: false };

    } },

  saveFile: {
    args: {
      tempFilePath: 'apFilePath' },

    returnValue: {
      apFilePath: 'savedFilePath' } },


  getSavedFileInfo: {
    args: {
      filePath: 'apFilePath' },

    returnValue: function returnValue(result) {
      if (result.fileList && result.fileList.length) {
        result.fileList.forEach(function (file) {
          file.filePath = file.apFilePath;
          delete file.apFilePath;
        });
      }
      return {};
    } },

  removeSavedFile: {
    args: {
      filePath: 'apFilePath' } },


  getLocation: {
    args: {
      type: false,
      altitude: false } },


  openLocation: {
    args: {
      // TODO address 参数在阿里上是必传的
    } },

  getNetworkType: {
    returnValue: _handleNetworkInfo },

  onNetworkStatusChange: {
    returnValue: _handleNetworkInfo },

  stopAccelerometer: {
    name: 'offAccelerometerChange' },

  stopCompass: {
    name: 'offCompassChange' },

  scanCode: {
    name: 'scan',
    args: function args(fromArgs) {
      if (fromArgs.scanType === 'qrCode') {
        fromArgs.type = 'qr';
        return {
          onlyFromCamera: 'hideAlbum' };

      } else if (fromArgs.scanType === 'barCode') {
        fromArgs.type = 'bar';
        return {
          onlyFromCamera: 'hideAlbum' };

      } else {
        return {
          scanType: false,
          onlyFromCamera: 'hideAlbum' };

      }
    },
    returnValue: {
      code: 'result' } },


  setClipboardData: {
    name: 'setClipboard',
    args: {
      data: 'text' } },


  getClipboardData: {
    name: 'getClipboard',
    returnValue: {
      text: 'data' } },


  pageScrollTo: {
    args: {
      duration: false } },


  login: {
    name: 'getAuthCode',
    returnValue: function returnValue(result) {
      result.code = result.authCode;
    } },

  getUserInfo: {
    name: 'getAuthUserInfo',
    returnValue: function returnValue(result) {
      result.userInfo = {
        nickName: result.nickName,
        avatarUrl: result.avatar };

    } },

  requestPayment: {
    name: 'tradePay',
    args: {
      orderInfo: 'tradeNO' } },


  getBLEDeviceServices: {
    returnValue: function returnValue(result) {
      result.services.forEach(function (item) {
        item.uuid = item.serviceId;
      });
    } },

  createBLEConnection: {
    name: 'connectBLEDevice',
    args: {
      timeout: false } },


  closeBLEConnection: {
    name: 'disconnectBLEDevice' },

  onBLEConnectionStateChange: {
    name: 'onBLEConnectionStateChanged' },

  makePhoneCall: {
    args: {
      phoneNumber: 'number' } },


  stopGyroscope: {
    name: 'offGyroscopeChange' },

  getSystemInfo: {
    returnValue: _handleSystemInfo },

  getSystemInfoSync: {
    returnValue: _handleSystemInfo },

  // 文档没提到，但是实测可用。
  canvasToTempFilePath: {
    returnValue: function returnValue(result) {
      // 真机的情况下会有 tempFilePath 这个值，因此需要主动修改。
      result.tempFilePath = result.apFilePath;
    } },

  setScreenBrightness: {
    args: {
      value: 'brightness' } },


  getScreenBrightness: {
    returnValue: {
      brightness: 'value' } },


  showShareMenu: {
    name: 'showSharePanel' } };



var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = my[options.name || methodName].apply(my, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref3)


  {var fail = _ref3.fail,complete = _ref3.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['alipay'],
  share: ['alipay'],
  payment: ['alipay'],
  push: ['alipay'] };


function getProvider(_ref4)




{var service = _ref4.service,success = _ref4.success,fail = _ref4.fail,complete = _ref4.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });


function setStorageSync(key, data) {
  return my.setStorageSync({
    key: key,
    data: data });

}
function getStorageSync(key) {
  var result = my.getStorageSync({
    key: key });

  // 支付宝平台会返回一个 success 值，但是目前测试的结果这个始终是 true。当没有存储数据的时候，其它平台会返回空字符串。
  return result.data !== null ? result.data : '';
}
function removeStorageSync(key) {
  return my.removeStorageSync({
    key: key });

}

function startGyroscope(params) {
  if (hasOwn(params, 'interval')) {
    console.warn('支付宝小程序 startGyroscope暂不支持interval');
  }
  params.success && params.success({
    errMsg: 'startGyroscope:ok' });

  params.complete && params.complete({
    errMsg: 'startGyroscope:ok' });

}

function createExecCallback(execCallback) {
  return function wrapperExecCallback(res) {
    this.actions.forEach(function (action, index) {
      (action._$callbacks || []).forEach(function (callback) {
        callback(res[index]);
      });
    });
    if (isFn(execCallback)) {
      execCallback(res);
    }
  };
}

function addCallback(callback) {
  if (isFn(callback)) {
    var action = this.actions[this.actions.length - 1];
    if (action) {
      (action._$callbacks || (action._$callbacks = [])).push(callback);
    }
  }
}

function createSelectorQuery() {
  var query = my.createSelectorQuery();

  var oldExec = query.exec;
  var oldScrollOffset = query.scrollOffset;
  var oldBoundingClientRect = query.boundingClientRect;
  query.exec = function exec(callback) {
    return oldExec.call(this, createExecCallback(callback).bind(this));
  };
  query.scrollOffset = function scrollOffset(callback) {
    var ret = oldScrollOffset.call(this);
    addCallback.call(this, callback);
    return ret;
  };
  query.boundingClientRect = function boundingClientRect(callback) {
    var ret = oldBoundingClientRect.call(this);
    addCallback.call(this, callback);
    return ret;
  };

  if (!query.fields) {
    query.fields = function () {var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},rect = _ref5.rect,size = _ref5.size,scrollOffset = _ref5.scrollOffset;var callback = arguments.length > 1 ? arguments[1] : undefined;
      if (rect || size) {
        this.boundingClientRect();
      }
      if (scrollOffset) {
        this.scrollOffset();
      }
      addCallback.call(this, callback);
      return this;
    };
  }
  return query;
}

var api = /*#__PURE__*/Object.freeze({
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  removeStorageSync: removeStorageSync,
  startGyroscope: startGyroscope,
  createSelectorQuery: createSelectorQuery });


var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-alipay","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "my".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref6)


{var mocks = _ref6.mocks,initRefs = _ref6.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-alipay";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function handleLink(event) {var _ref7 =



  event.detail || event.value,vuePid = _ref7.vuePid,vueOptions = _ref7.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

var isArray = Array.isArray;
var keyList = Object.keys;

function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    var arrA = isArray(a);
    var arrB = isArray(b);
    var i, length, key;
    if (arrA && arrB) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!equal(a[i], b[i])) return false;
      }
      return true;
    }
    if (arrA !== arrB) return false;

    var dateA = a instanceof Date;
    var dateB = b instanceof Date;
    if (dateA !== dateB) return false;
    if (dateA && dateB) return a.getTime() === b.getTime();

    var regexpA = a instanceof RegExp;
    var regexpB = b instanceof RegExp;
    if (regexpA !== regexpB) return false;
    if (regexpA && regexpB) return a.toString() === b.toString();

    var keys = keyList(a);
    length = keys.length;
    if (length !== keyList(b).length) {
      return false;
    }
    for (i = length; i-- !== 0;) {
      if (!hasOwn.call(b, keys[i])) return false;
    }
    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
}

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

var isComponent2 = my.canIUse('component2');

var mocks = ['$id'];

function initRefs() {

}

function initBehavior(_ref8)

{var properties = _ref8.properties;
  var props = {};

  Object.keys(properties).forEach(function (key) {
    props[key] = properties[key].value;
  });

  return {
    props: props };

}

function initRelation(detail) {
  this.props.onVueInit(detail);
}

function initSpecialMethods(mpInstance) {
  if (!mpInstance.$vm) {
    return;
  }
  var path = mpInstance.is || mpInstance.route;
  if (!path) {
    return;
  }
  if (path.indexOf('/') === 0) {
    path = path.substr(1);
  }
  var specialMethods = my.specialMethods && my.specialMethods[path];
  if (specialMethods) {
    specialMethods.forEach(function (method) {
      if (isFn(mpInstance.$vm[method])) {
        mpInstance[method] = function (event) {
          // TODO normalizeEvent
          mpInstance.$vm[method](event);
        };
      }
    });
  }
}

function initChildVues(mpInstance) {
  // 此时需保证当前 mpInstance 已经存在 $vm
  if (!mpInstance.$vm) {
    return;
  }
  mpInstance._$childVues && mpInstance._$childVues.forEach(function (_ref9)




  {var vuePid = _ref9.vuePid,vueOptions = _ref9.vueOptions,VueComponent = _ref9.VueComponent,childMPInstance = _ref9.mpInstance;
    // 父子关系
    handleLink.call(mpInstance, {
      detail: {
        vuePid: vuePid,
        vueOptions: vueOptions } });



    childMPInstance.$vm = new VueComponent(vueOptions);

    initSpecialMethods(childMPInstance);

    handleRef.call(vueOptions.parent.$scope, childMPInstance);

    childMPInstance.$vm.$mount();

    initChildVues(childMPInstance);

    childMPInstance.$vm._isMounted = true;
    childMPInstance.$vm.__call_hook('mounted');
    childMPInstance.$vm.__call_hook('onReady');
  });

  delete mpInstance._$childVues;
}

function handleRef(ref) {
  if (!ref) {
    return;
  }
  var refName = ref.props['data-ref'];
  var refInForName = ref.props['data-ref-in-for'];
  if (refName) {
    this.$vm.$refs[refName] = ref.$vm || ref;
  } else if (refInForName) {
    this.$vm.$refs[refInForName] = [ref.$vm || ref];
  }
}

function triggerEvent(type, detail, options) {
  var handler = this.props[customize('on-' + type)];
  if (!handler) {
    return;
  }

  var eventOpts = this.props['data-event-opts'];

  var target = {
    dataset: {
      eventOpts: eventOpts } };



  handler({
    type: customize(type),
    target: target,
    currentTarget: target,
    detail: detail });

}

var IGNORES = ['$slots', '$scopedSlots'];

function createObserver$1(isDidUpdate) {
  return function observe(props) {var _this2 = this;
    var prevProps = isDidUpdate ? props : this.props;
    var nextProps = isDidUpdate ? this.props : props;
    if (equal(prevProps, nextProps)) {
      return;
    }
    Object.keys(prevProps).forEach(function (name) {
      if (IGNORES.indexOf(name) === -1) {
        var prevValue = prevProps[name];
        var nextValue = nextProps[name];
        if (!isFn(prevValue) && !isFn(nextValue) && !equal(prevValue, nextValue)) {
          _this2.$vm[name] = nextProps[name];
        }
      }
    });
  };
}

var handleLink$1 = function () {
  if (isComponent2) {
    return function handleLink$1(detail) {
      return handleLink.call(this, {
        detail: detail });

    };
  }
  return function handleLink$1(detail) {
    if (this.$vm && this.$vm._isMounted) {// 父已初始化
      return handleLink.call(this, {
        detail: {
          vuePid: detail.vuePid,
          vueOptions: detail.vueOptions } });


    }
    // 支付宝通过 didMount 来实现，先子后父，故等父 ready 之后，统一初始化
    (this._$childVues || (this._$childVues = [])).unshift(detail);
  };
}();

function parseApp(vm) {
  Object.defineProperty(_vue.default.prototype, '$slots', {
    get: function get() {
      return this.$scope && this.$scope.props.$slots;
    },
    set: function set() {

    } });

  Object.defineProperty(_vue.default.prototype, '$scopedSlots', {
    get: function get() {
      return this.$scope && this.$scope.props.$scopedSlots;
    },
    set: function set() {

    } });


  _vue.default.prototype.$onAliGetAuthorize = function onAliGetAuthorize(method, $event) {var _this3 = this;
    my.getPhoneNumber({
      success: function success(res) {
        $event.type = 'getphonenumber';
        var response = JSON.parse(res.response).response;
        if (response.code === '10000') {// success
          $event.detail.errMsg = 'getPhoneNumber:ok';
          $event.detail.encryptedData = res.response;
        } else {
          $event.detail.errMsg = 'getPhoneNumber:fail Error: ' + res.response;
        }
        _this3[method]($event);
      },
      fail: function fail(res) {
        $event.type = 'getphonenumber';
        $event.detail.errMsg = 'getPhoneNumber:fail';
        _this3[method]($event);
      } });

  };

  _vue.default.prototype.$onAliAuthError = function $onAliAuthError(method, $event) {
    $event.type = 'getphonenumber';
    $event.detail.errMsg = 'getPhoneNumber:fail Error: ' + $event.detail.errorMessage;
    this[method]($event);
  };

  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

var hooks$1 = [
'onShow',
'onHide',
// mp-alipay 特有
'onTitleClick',
'onOptionMenuClick',
'onPopMenuClick',
'onPullIntercept'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parsePage(vuePageOptions) {var _initVueComponent =
  initVueComponent(_vue.default, vuePageOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var pageOptions = {
    mixins: initBehaviors(vueOptions, initBehavior),
    data: initData(vueOptions, _vue.default.prototype),
    onLoad: function onLoad(args) {
      var properties = this.props;

      var options = {
        mpType: 'page',
        mpInstance: this,
        propsData: properties };


      // 初始化 vue 实例
      this.$vm = new VueComponent(options);

      initSpecialMethods(this);

      // 触发首次 setData
      this.$vm.$mount();

      this.$vm.$mp.query = args; // 兼容 mpvue
      this.$vm.__call_hook('onLoad', args);
    },
    onReady: function onReady() {
      initChildVues(this);
      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted');
      this.$vm.__call_hook('onReady');
    },
    onUnload: function onUnload() {
      this.$vm.__call_hook('onUnload');
      this.$vm.$destroy();
    },
    __r: handleRef,
    __e: handleEvent,
    __l: handleLink$1 };


  initHooks(pageOptions, hooks$1, vuePageOptions);

  return pageOptions;
}

function createPage(vuePageOptions) {
  {
    return Page(parsePage(vuePageOptions));
  }
}

function initVm(VueComponent) {
  if (this.$vm) {
    return;
  }
  var properties = this.props;

  var options = {
    mpType: 'component',
    mpInstance: this,
    propsData: properties };


  initVueIds(properties.vueId, this);

  if (isComponent2) {
    // 处理父子关系
    initRelation.call(this, {
      vuePid: this._$vuePid,
      vueOptions: options });


    // 初始化 vue 实例
    this.$vm = new VueComponent(options);

    // 触发首次 setData
    this.$vm.$mount();
  } else {
    // 处理父子关系
    initRelation.call(this, {
      vuePid: this._$vuePid,
      vueOptions: options,
      VueComponent: VueComponent,
      mpInstance: this });


    if (options.parent) {// 父组件已经初始化，直接初始化子，否则放到父组件的 didMount 中处理
      // 初始化 vue 实例
      this.$vm = new VueComponent(options);
      handleRef.call(options.parent.$scope, this);
      // 触发首次 setData
      this.$vm.$mount();

      initChildVues(this);

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted');
      this.$vm.__call_hook('onReady');
    }
  }
}

function parseComponent(vueComponentOptions) {var _initVueComponent3 =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent4 = _slicedToArray(_initVueComponent3, 2),VueComponent = _initVueComponent4[0],vueOptions = _initVueComponent4[1];

  var properties = initProperties(vueOptions.props, false, vueOptions.__file);

  var props = {
    onVueInit: function onVueInit() {} };


  Object.keys(properties).forEach(function (key) {
    if (key !== 'vueSlots') {
      props[key] = properties[key].value;
    }
  });

  var componentOptions = {
    mixins: initBehaviors(vueOptions, initBehavior),
    data: initData(vueOptions, _vue.default.prototype),
    props: props,
    didMount: function didMount() {
      initVm.call(this, VueComponent);

      initSpecialMethods(this);

      if (isComponent2) {
        this.$vm._isMounted = true;
        this.$vm.__call_hook('mounted');
        this.$vm.__call_hook('onReady');
      }
    },
    didUnmount: function didUnmount() {
      this.$vm.$destroy();
    },
    methods: {
      __r: handleRef,
      __e: handleEvent,
      __l: handleLink$1,
      triggerEvent: triggerEvent } };



  if (isComponent2) {
    componentOptions.onInit = function onInit() {
      initVm.call(this, VueComponent);
    };
    componentOptions.deriveDataFromProps = createObserver$1();
  } else {
    componentOptions.didUpdate = createObserver$1(true);
  }

  return componentOptions;
}

function createComponent(vueOptions) {
  {
    return my.defineComponent(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!my.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-alipay" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(my, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, my[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(my).forEach(function (name) {
    if (hasOwn(my, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, my[name]));
    }
  });
}

my.createApp = createApp;
my.createPage = createPage;
my.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-alipay","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-alipay","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-alipay","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-alipay","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!***********************************!*\
  !*** E:/work/app/cwtx/pages.json ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-alipay"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23720191024001","_inBundle":false,"_integrity":"sha512-vJEk493Vdb8KueNzR2otzDi23rfyRcQBo/t1R41MwNGPk+AUB94gh10+HVLo98DRcvMzkuVofz3KXTAfEx24iw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23720191024001.tgz","_shasum":"18272814446a9bc6053bc92666ec7064a1767588","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a725c04ef762e5df78a9a69d140c2666e0de05fc","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23720191024001"};

/***/ }),
/* 7 */
/*!****************************************************!*\
  !*** E:/work/app/cwtx/pages.json?{"type":"style"} ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/user": { "defaultTitle": "个人中心", "pullRefresh": false, "usingComponents": {} }, "pages/change": { "defaultTitle": "切换卡号", "pullRefresh": false, "usingComponents": { "uni-popup": "/components/uni-popup/uni-popup" } }, "pages/confirm": { "defaultTitle": "余额充值", "pullRefresh": false, "usingComponents": { "uni-popup": "/components/uni-popup/uni-popup" } }, "pages/recorder": { "defaultTitle": "消费记录", "pullRefresh": false, "usingComponents": { "order-list": "/components/order-list/OrderList" } }, "pages/flow": { "defaultTitle": "流量查询", "pullRefresh": false, "usingComponents": {} }, "pages/diacrisis": { "defaultTitle": "智能诊断", "pullRefresh": false, "usingComponents": {} }, "pages/set-meals": { "defaultTitle": "选择套餐", "pullRefresh": false, "usingComponents": { "uni-popup": "/components/uni-popup/uni-popup" } }, "pages/recharge": { "defaultTitle": "套餐充值", "pullRefresh": true, "usingComponents": { "uni-popup": "/components/uni-popup/uni-popup" } }, "pages/set-password": { "defaultTitle": "设置密码", "pullRefresh": false, "usingComponents": {} }, "pages/change-pwd": { "defaultTitle": "重置密码", "pullRefresh": false, "usingComponents": {} }, "pages/web-view": { "defaultTitle": "帮助文档", "pullRefresh": false, "usingComponents": {} }, "pages/help": { "defaultTitle": "客服", "pullRefresh": false, "usingComponents": {} }, "pages/more": { "defaultTitle": "更多", "pullRefresh": false, "usingComponents": {} }, "pages/more-web": { "defaultTitle": "领卡", "pullRefresh": false, "usingComponents": {} }, "pages/login": { "defaultTitle": "登录", "pullRefresh": false, "usingComponents": {} }, "pages/certification": { "defaultTitle": "实名认证", "pullRefresh": false, "usingComponents": {} }, "pages/activity": { "defaultTitle": "推广", "pullRefresh": false, "usingComponents": { "uni-popup": "/components/uni-popup/uni-popup" } } }, "globalStyle": { "defaultTitle": "创网通讯", "titleBarColor": "#FFFFFF", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),
/* 8 */
/*!***************************************************!*\
  !*** E:/work/app/cwtx/pages.json?{"type":"stat"} ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__9FCCC78" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/*!*************************************!*\
  !*** E:/work/app/cwtx/utils/url.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = 'http://cwtx.10010123.com/';exports.default = _default;

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 16 */
/*!***************************************!*\
  !*** E:/work/app/cwtx/store/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _regenerator = _interopRequireDefault(__webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ 17));var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 20));
var _url = _interopRequireDefault(__webpack_require__(/*! @/utils/url */ 12));
var _UserData = _interopRequireDefault(__webpack_require__(/*! ./UserData.js */ 21));

var _RechargeData = _interopRequireDefault(__webpack_require__(/*! ./RechargeData */ 43));
var _SetMealList = _interopRequireDefault(__webpack_require__(/*! ./SetMealList */ 44));
var _ConfirmData = _interopRequireDefault(__webpack_require__(/*! ./ConfirmData.js */ 47));

var _flowData = _interopRequireDefault(__webpack_require__(/*! ./flowData */ 48));
var _RecorderData = _interopRequireDefault(__webpack_require__(/*! ./RecorderData.js */ 49));
var _Activity = _interopRequireDefault(__webpack_require__(/*! ./Activity.js */ 50));
var _HomeData = _interopRequireDefault(__webpack_require__(/*! ./HomeData */ 51));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    // cardId: '',									//window.localStorage.getItem('CARD_ID')||'',
    openID: '',
    unionId: '',
    nickName: '',
    headImgUrl: '',
    helpUrl: '',
    isPasswordExsit: 0,
    ispName: '',
    docUrl: '',
    passwordExist: false,
    account: '123',
    isBind: 0, //微信绑定
    needAuth: '是', //是否实名认证
    needUnbind: '有', //是否否已机卡绑定
    supportRecover: '支持', //是否支持恢复上网功能
    payMode: '直付模式', //支付方式
    hasLogin: false,
    loginProvider: null,
    canTg: '不能推广' },

  getters: {
    getHeadImgUrl: function getHeadImgUrl(state) {
      return state.userData.avatar ? state.userData.avatar : '';
    },
    getNickName: function getNickName(state) {
      return state.userData.name ? state.userData.name : '';
    } },

  mutations: {
    login: function login(state, provider) {
      state.hasLogin = true;
      state.loginProvider = provider;
    },
    logout: function logout(state) {
      state.hasLogin = false;
      state.openid = null;
    },
    setOpenid: function setOpenid(state, openid) {
      state.openid = openid;
    },
    setUnionId: function setUnionId(state, unionId) {
      state.unionId = unionId;
    },
    syncSetting: function syncSetting(state, obj) {
      Object.assign(state, obj);
    },
    syncIsPayAuth: function syncIsPayAuth(state) {
      state.isPayAuth = true;
    } },

  actions: {
    asyncSetting: function asyncSetting(_ref, data) {var commit = _ref.commit,state = _ref.state;
      commit('syncSetting', data);
    },
    // lazy loading openid
    getUserOpenId: function () {var _getUserOpenId = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref2) {var commit, state;return _regenerator.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                commit = _ref2.commit,
                state = _ref2.state;_context.next = 3;return (

                  new Promise(function (resolve, reject) {
                    uni.getStorage({
                      key: 'UNIONID',
                      success: function success(res) {
                        commit('syncSetting', {
                          unionId: res.data,
                          openID: uni.getStorageSync('OPENID'),
                          headImgUrl: uni.getStorageSync('AVATARURL'),
                          nickName: uni.getStorageSync('NICKNAME') });

                        uni.getStorage({
                          key: 'CARDID',
                          complete: function complete(resData) {
                            resolve({
                              unionid: res.data,
                              openId: uni.getStorageSync('OPENID'),
                              avatarUrl: uni.getStorageSync('AVATARURL'),
                              nickName: uni.getStorageSync('NICKNAME'),
                              cardId: resData.data ? resData.data : '' });

                          } });


                      },
                      fail: function fail() {
                        uni.getProvider({
                          service: 'oauth',
                          success: function success(res) {
                            if (~res.provider.indexOf('weixin')) {
                              uni.login({
                                provider: 'weixin',
                                success: function success(data) {
                                  commit('login');
                                  uni.getUserInfo({
                                    provider: 'weixin',
                                    success: function success(infoRes) {
                                      commit('syncSetting', {
                                        openID: infoRes.userInfo.openId,
                                        nickName: infoRes.userInfo.nickName,
                                        headImgUrl: infoRes.userInfo.avatarUrl });

                                      uni.setStorage({
                                        key: 'OPENID',
                                        data: infoRes.userInfo.openId,
                                        success: function success() {
                                          uni.request({
                                            url: _url.default + 'wx/app_user_info',
                                            method: 'POST',
                                            data: {
                                              open_id: infoRes.userInfo.openId,
                                              union_id: infoRes.userInfo.unionId,
                                              nike_name: infoRes.userInfo.nickName,
                                              sex: infoRes.userInfo.gender,
                                              city: infoRes.userInfo.city,
                                              province: infoRes.userInfo.province,
                                              country: infoRes.userInfo.country,
                                              head_img_url: infoRes.userInfo.avatarUrl },

                                            success: function success(resData) {
                                              console.log(resData);
                                              if (typeof resData.data.data.card_no != 'undefined' && resData.data.data.card_no != '') {
                                                resolve({
                                                  unionid: infoRes.userInfo.unionid,
                                                  openId: infoRes.userInfo.openId,
                                                  avatarUrl: infoRes.userInfo.avatarUrl,
                                                  nickName: infoRes.userInfo.nickName,
                                                  cardId: resData.data.data.card_no });

                                              } else {
                                                resolve({
                                                  unionid: infoRes.userInfo.unionid,
                                                  openId: infoRes.userInfo.openId,
                                                  avatarUrl: infoRes.userInfo.avatarUrl,
                                                  nickName: infoRes.userInfo.nickName });

                                              }
                                            },
                                            fail: function fail(err) {
                                              console.log(err);
                                            } });

                                        } });

                                      uni.setStorage({
                                        key: 'NICKNAME',
                                        data: infoRes.userInfo.nickName });

                                      uni.setStorage({
                                        key: 'AVATARURL',
                                        data: infoRes.userInfo.avatarUrl });

                                      uni.setStorage({
                                        key: 'UNIONID',
                                        data: infoRes.userInfo.unionId });

                                    } });

                                },
                                fail: function fail(err) {
                                  console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err);
                                  reject(err);
                                } });

                            }
                          } });

                      } });

                  }));case 3:return _context.abrupt("return", _context.sent);case 4:case "end":return _context.stop();}}}, _callee, this);}));function getUserOpenId(_x) {return _getUserOpenId.apply(this, arguments);}return getUserOpenId;}() },


  modules: {
    userData: _UserData.default,
    confirmData: _ConfirmData.default,
    recorderData: _RecorderData.default,
    flowData: _flowData.default,
    setMealList: _SetMealList.default,
    rechargeData: _RechargeData.default,
    activityData: _Activity.default,
    homeData: _HomeData.default } });var _default =



store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 17 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 18);


/***/ }),
/* 18 */
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 19);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 19 */
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),
/* 20 */
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),
/* 21 */
/*!******************************************!*\
  !*** E:/work/app/cwtx/store/UserData.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _imagePath = _interopRequireDefault(__webpack_require__(/*! ../utils/image-path */ 22));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  namespaced: true,
  state: {
    bgTop: _imagePath.default.userBgTop,
    avatar: _imagePath.default.avatar,
    name: '蘧蘧然',
    icons: _imagePath.default.icons,
    menuList: [/*{
               id: 1,
               text: '我的钱包',
               path:'/wallet'
               } ,*/{
      id: 2,
      text: '余额充值',
      path: '/pages/confirm',
      isShow: true },
    {
      id: 3,
      text: '套餐订购',
      path: '/pages/set-meals',
      isShow: true },
    {
      id: 4,
      text: '流量查询',
      path: '/pages/flow',
      isShow: true },
    {
      id: 5,
      text: '消费记录',
      path: '/pages/recorder',
      isShow: true },
    {
      id: 7,
      text: '智能诊断',
      path: '/pages/diacrisis',
      isShow: true },
    {
      id: 8,
      text: '恢复上网',
      path: '/pages/recover',
      isShow: false },
    {
      id: 9,
      text: '免费流量',
      path: '/pages/activity'
      // },{
      //   id: 10,
      //   text: '客服',
      //   path: '/pages/help'
    }, {
      id: 6,
      text: '实名认证',
      path: '/pages/certification' }],

    balance: 0.00,
    cert_status: 0 },

  mutations: {
    balanceStatus: function balanceStatus(state, data1, data2) {
      state.balance = data1;
      state.cert_status = data2;
    } },

  getters: {
    menuListFilter: function menuListFilter(state, getters, rootState) {//测出用到了rootState 注意区分和state区别
      var arr = new Array();
      state.menuList.forEach(function (element) {
        switch (element.text) {
          case '恢复上网':
            arr.push(
            Object.assign(element, {
              isShow: rootState.supportRecover == '支持' }));


            break;
          case '免费流量':
            arr.push(
            Object.assign(element, {
              isShow: rootState.can_tg == '能推广' }));


            break;
          case '余额充值':
            arr.push(
            Object.assign(element, {
              isShow: rootState.payMode != '直付模式' }));


            break;
          case '实名认证':
            arr.push(
            Object.assign(element, {
              isShow: rootState.needAuth == '是' && certStatus == '未认证' //,true,
            }));

            break;
          default:
            arr.push(
            Object.assign(element, {
              isShow: true }));


            break;}

      });
      return arr;
    } },

  actions: {
    updateBalanceBy: function updateBalanceBy(_ref, data) {var commit = _ref.commit,state = _ref.state;
      var obj = {
        balance: state.balance,
        cert_status: state.cert_status };

      Object.assign(obj, data);
      commit('balanceStatus', obj.balance, obj.cert_status);
    } } };exports.default = _default;

/***/ }),
/* 22 */
/*!********************************************!*\
  !*** E:/work/app/cwtx/utils/image-path.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  logoImg: __webpack_require__(/*! @/static/cwtx/logo.png */ 23), //卡号查询页面
  loginBg: __webpack_require__(/*! @/static/cwtx/bj.png */ 24), //切换卡号页面背景图
  indexTopBg: __webpack_require__(/*! @/static/cwtx/headerbj.jpg */ 25), //首页顶部背景图   
  indexIdCardBgFront: __webpack_require__(/*! @/static/cwtx/sfz1.png */ 26), //身份证正面 
  indexIdCardBgBack: __webpack_require__(/*! @/static/cwtx/sfz2.png */ 27), //身份证反面  
  indexIdCardBghHold: __webpack_require__(/*! @/static/cwtx/sfz3.png */ 28), //手持身份证 
  userBgTop: __webpack_require__(/*! @/static/cwtx/userbj.png */ 29), //个人中心顶部背景图
  avatar: __webpack_require__(/*! @/static/cwtx/head.png */ 30), //个人中心个人头像默认图
  icons: __webpack_require__(/*! @/static/cwtx/sprite.png */ 31), //icon
  rachargeBg: __webpack_require__(/*! @/static/cwtx/inquire.png */ 32), //充值页面背景图
  yidongImage: __webpack_require__(/*! @/static/cwtx/yidong.png */ 33), //确认订单服务商logo移动
  liantongImage: __webpack_require__(/*! @/static/cwtx/liantong.png */ 34), //确认订单服务商logo联通
  dianxinImage: __webpack_require__(/*! @/static/cwtx/dianxin.png */ 35), //确认订单服务商logo电信
  chongzhiImage: __webpack_require__(/*! @/static/cwtx/chongzhi.png */ 36), //确认订单logo---充值订单
  confirmTopBg: __webpack_require__(/*! @/static/cwtx/flowboxbj.png */ 37), //确认订单title背景
  confirmBottomBg: __webpack_require__(/*! @/static/cwtx/footerbanner.png */ 38), //确认订单bottom背景
  flowBottomImg: __webpack_require__(/*! @/static/cwtx/inquire-footer.png */ 39), //确认订单bottom背景
  wxIcon: __webpack_require__(/*! @/static/cwtx/wechat-icon.png */ 40), //微信icon
  balanceIcon: __webpack_require__(/*! @/static/cwtx/balace-icon.png */ 41), //零钱icon
  clockIcon: __webpack_require__(/*! @/static/cwtx/sprite-time.png */ 42) //时钟图标
};exports.default = _default;

/***/ }),
/* 23 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/logo.png ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 24 */
/*!*******************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/bj.png ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/bj.cfa119ba.png";

/***/ }),
/* 25 */
/*!*************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/headerbj.jpg ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),
/* 26 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/sfz1.png ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 27 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/sfz2.png ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 28 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/sfz3.png ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 29 */
/*!***********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/userbj.png ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 30 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/head.png ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 31 */
/*!***********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/sprite.png ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/sprite.37d6ebed.png";

/***/ }),
/* 32 */
/*!************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/inquire.png ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/inquire.dac14fa5.png";

/***/ }),
/* 33 */
/*!***********************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/yidong.png ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAACPCAYAAADdqrggAABmPUlEQVR42u19B3xd1ZH+keRKJ0CoCYbQA8RJSHZJWzZ9s/lv2CTEuMu2JMuW5N676R1TAgnV9BJsjLstS1bvvRfLkovcZFmy6mv3zv+bOefe9yQMIYlZnID5XSS9css5c6Z8880cRUTtn6fDtm05Pm/P/XGHos/BPxuHZdtk2yGvmT/sfn9/Hv+pz8uD2vIfhCHkONG0fx6FQX0+tIA5QgTAZ/52Jt45vtAE/yqzbv+dH/pCCP4v/1mYAh8F5D8zHWZe+EfAHFYfVW5suu3Ml17Tzn/kKvtAnyt14KWK40QZe4i2VHbRewUt9FbBUXqjqJ3eKWyj7TW9lL2faLeXyG9/rD5x74j/77eMzPB92IE+omV/IQSfZLH6MVXt1EseHGbazMyz2u7B0W3rgeYR9eHz/A3bmQtR3fibvFDrPhGn0KFv7+qijSX7aNYbuXTbIxl01aIiunB6AZ0Zk0EREzNIRRfgKMdRTOHRefSlhFK6cXkB/fapnfT4plIq23PMFUB9w5AQu1eu58elevCmBzcawGFbHnmP7ykQIsBfCMFf+8ej1GvJjLtr151g1g5+Wd38riw0v1l1Ytj9eE2rDFEGgeB0bW04SOPWHqCvL6+ks6dgssdkkrozjdSEVFKxKaSm4udUFoJ8Cp8AIYjCMbGY1PgcfHYbqZHr8XcKnTO3nn7+3BFaU30wVPWwGMq1bQuTHujEgXu1nUnnz0EgIChfmINPLARavfvZSXOMAM+2FdDqld+0jToIeOV1P0bcxyvQ5tXXI6dirfFKkY/ueLqevhy1mdRonnSs9Ml5pKZgshOKKWxqKSa/An/X4KiEQJRSWCwmPw6vx5XhPXw2zhz4jorJJTV2J507aQuN/XMVbWz0BzUDCyBrJqOBfKIfnNiDVZn1T2cPPhtzwOPk0zbYi+H14D8eSnmRV3YfNx46wd8FefCRl82EMSf8r6ixhaL+lIVJx0q+ExMYi4me2qAne2oxRUzNwpFNEbElmPRaaIDd+Ew9JhuCEA9BSciXIywui8IgLCoewjG5iIbE5tAA/FSTcb4RKXR6XDItf7eMjrQHn4GjCw8exAfBZWGwnJkXbRX4Qgg+iSJgm98jU9+DAcQkU4+edTv4GcdCHLe0g+c173V7O+nBxEo6fybU/Xio+Bj8nIJJm1pPg2PKadCkCgqfjEmPZWGoxuSWYLLz9MTHFeJ1NgV4PwqaILpQmwV8R0VWUVhUE46DFBHVSKdNrqSh0TjveHxuTCHduDSXXi1qDNp8b0CE1PFLtS7owNHyhRB8EuBGu3pQpqLaPcZZtNlKiIB4xCFkl9CDcQ46fgUHe+gnDzZQxJ3pmDio+vgiGjA1nwbG4Sev+PgcmIBMCseED+DXpmLVx1RhVUMgInlCYS4ikzH5yRQGJzFiElR/FB/wFSbhvXH4OQFCMwWCMbWIIiA8YWw2ElhQUmhIZApFv7KLDvV2u0LLystjIgULz2KJb/CFEHwiMRCPwO8XB4tf4YHsFA1BMvF+x/OGMIjjV95BN0/fAdWPSYrahxXdILZ9wBSo/snFNGgqVvJ0VvGZFDatEAJQ4Nr30zDx183Nol8+Xkrx7+2h+1Jb6ImsXnoy3UOrMnvpoSwPzd16hG5/voy+e28aXRD3AQRmC64DYZtSok0I+xMT4UPcuZX++64tlLKrgxzw2QP/xQ9/wGLH8Z8sPPhswSJ2CvwauuMfveIj2NrDDkAAvF4zxD30p8QyHd6xV8/OHE/I5Eq9wvl3XvFxjRSG38PjoNqjsOqj8mlAQhb974sV9FpBHe1rbe0XxWthdHwM1957jlFGdR3NeL+JLp0HP2IcTMbYUgqPrKDT2HzEQCgiS2nI9Ex6LrvC/R6HjgGWV4/9hRD8dahIT7oT9QVcGBcOFsfkPPnGHT8Cybjjrf00cAxW5URogZlw4KblYaJz4PRhQqbA5sPpC0uopCHTEAbG1chq/eq0VJq5upAqDnhPOCe8Wh013uOEeXxNr9XHeznYbdGLaXV0w7JMEQQVXUZDprDzmCumY1BkGiWs2U8+OK8BOoATt0nY+IUQ/FVjwNPt1SvREQaZAax+q8eEYURlnX7636ew6kbz6iumIfF5sPPw5KewnYY/MKUQPkApDUYIOIBDvrEZdO7oD2j009WU2GSFII7a5JDJJDISYWHJ2lZArusX/e3Xf1vmnjhSsbpc97QGfy7dcoSumraR1CiEonBA1RRoiagKCgPGMOnP+bRLfBufNnOfTyGwQ4Dej8LqbaOM2Qfo1qGUm87jSerA0S2fSNxL9J17sPonvA9VXyfh32mw/afDxg+cUqrVP5y1cMT4p02GIzgyiS6e3kCvJu93fQgXwLF15BEgJywNSFRin2CybHN3roaQF7r1/eKdrINH6RePwdyMQWgaVaM10RSYp5Ep9ONHSgSiJvcZ+2UrP4Qpnxogszp5ItCNBz4mD2+FwKc8FBwFWAy54j+fcQP8fqzEgFfe95rwj0MrDhc3VbfQBXP2YmDTaFBcKpy9bKj5csTwVXRWJELAmDJogCwKn56lw71RhfSNZSVU3HDEnQCBnXmAeTUHOsTP8J1gvI/5emlvZyft7+ik1q4OjVd8yH6xA9vr/tkNtHPeu3BGo2B+JiDUjNsDgQD+MDabfnR/FjUcOSrPwRBTlxM5OKlLn+3OvSWAUxfZH7l4/uk0QcCoQtsF++SAx2wzEsgunx1wky4WTw7H2QwSWnrF8gQ8VdBG50Plq1EpFAEHLxyrnYGcIUD5BsMeR8RVIyJIo4gZRTrOj0ynuOdyqanHhO4y9AHB9XnAfT5EGXJ97bIfAvj/Vn0vzfvgIN3xxyr63n0ldNPSCrppWQ19E3Dz/3usiuJe30NPZRynnJZO6umDblgCapLx/d4sOAjzsB3CinuZ0oBohO97B10/r44y93m1psFECwhqaWJLwLaMhsDU83hYgc88e3nShMAKNQYu4mcbGNUKQsHyA5iA3UkWL3+DAPHKfWDHPqyuVIkABkH1h/Mqj6+Dyi8BaAMhiC2TyCBsWoHE9WdMSqep7++B6HlE+Hox6L0BY5Khx22v300ttOLnW7n76fZHdtCZU5EnmIDQbxSOsZhAaBc1rkw8fjUKWmdUBg2clEVXzk2lmJdKaX3lcToWdDBk4rQpsWh7XQfdsghA1MhUHZJCW6mRpXTLgiwqPGgkBs/LeIhfcA/bNTkBMx6ftUVQJ08PhKRi+wuAgwQaO+GHeu3hqXM/b1HMe3Ds2ONGGHbW+CoaElOHFV8lkz54SgFwANjhuCqAQMABJlTh73z6U25tMGfn5ZV3CKvfr5epPyiW2VXN9IuHMVETkzQghNBRQkvja4QBFBoEkCliMkxPHO4hjiMOmKMYHGPx98Qs+n9PF1Jq9b5gGCmn1r7G0WMtdOuDuNdxu3DeEjoL51Ejsum6+TlUsP+YcYURNeDzThTiREWngAycTHMgfraJu3lCPMYb0GbQa4dkC3k1mTjqKFbI2NexAuHYqYnlgvuHJRQB/s0C+KOh3rBpxTQY6d4BUYgUxtfRV2el0/qyFhdr8AcYw2cT4zO4vVdME9/LvTv20FkzEN5NQjgXk0eDJxdKfoCFYACbGKCNYUAa1WROJDEGYRJLU8vMUSEpZzUmjc6J20ax65uptfu4nN+PazmewmFPO014AeZgbKKErOGcwxhTQLeszIepOqY1B9+fzyS+be0m+2Sc/qV8Aq8clvG/ORRzNL7f2EBtVPVD18IH++0TmIBRWwSqjYiu1OgcsICIaWnQAAgJORSbjslIYPw+hX44N5vS9gX6OP+WOX9A/q/9kr24TMLrFcAXEM5NyBcQaSAmNQLnD0d0MRDCMBDmZSBMThiEIWJqqeAOA+IAME3NxU8ORwvwPu5lCgQhhoEpCM/YbfTLlVsptSkIDQcs7Q8dxf+jXq3S+YypwC44kTUqkX78YA7t7XY/LG6y4CIQXL/V9q8oBNox8xmr6YPI+8Qk6KSxhoGJSg9ZUKFQy6Ng+yfU0BmxwOkx6WoaBprTvzNzMAFA5Sbt0kmfsTvo+w9XUevRVqNtLFmFNqt9vxYuy7hxu7ts+vVTUOPjk8VrHxRdRacBQQyLh0BNqxQhGDolHT85P8AoYxkSTjk0KBbaAlnHIQCiBsdmAhTKwZFPQyAcAyUVjZwFJ6rGZ9P50dm0OqnJfXqPG216KeHdWvFZBkSn0VD2a0bU052Pl1GbiVx78JleEQAej2MfE1r/swmBIXkEQtBg24Hm/B59mH/lR4/SVXfBNt+BFR7TAPSvVDxrTgap+GIZ6KET6zGIyA9EN8nKinwygzq6LXIssU+MKotBuwF19L+8Q+30jbu1gxfO4ST8DNYqoknYxsc2Sbip4rN1djG+Sl+XJ5eFYjJCvSgI3kT4CxMx8RNgCqKKRcWryY1IMedDUKAVxuC1kbU0/a1mXN9rYj4yIXIXLV9bLoKrJsK8RcM0/KGUfvtqHRRBl/6YDUCBtcApkGc4qUJAJqvqNUKgHUGvAOrsCfNrKQ1H6Yezof5HZiLPDy2ASWDnLBy2eBBnBBEVsEPIKlpFFYgtnvJaLbVZ2u/wQZP0miyjX0zPcWMCiNbAU79yFiYPGcYzp2TTwPhiPckJ1Vq44PSFQ8XrXAM+F1+rzc+kLJmwM0Ai+cbCnfS7JwpoKiDnuJfzacTT+XTTwhQ6Y+JWfCZVmwRkJ8MTCsQJDB+9k371VAXt6ha9hGcPEE8z3+PStZj8Udt0mpoBpfFbKe6d/SZAxN0LQvkvFB0YUECDv64QWDoRZOkV/P4uH904ExSuP6RARTcBCEK2LwGqPg6RALz/wTAJQxgNTMBKjE1H5m8dLVjbLIwD8bCZwIGDM3aStePQC0aB3327sJUuSID9H1cHP6KazmQ62XSYhOkcYtZD9RcL8DRoajo0DZuB3TADjPxtpy9P3k6jn6uj18qPU1lHNx0TYIiNeC+1Y5WXdfbQWxVtFPXiLjqfnczxm/HdnRAEnD+hSrCKn96TRFUtWhiPG9IkG8dZ7++liNEQoMm5OqWN8PP5xBq5Z2HY+f2fOcn5JCKGHlGDLAYe46jZEr9rfbe2ZA8Nm5EoxA1m/4TxikwokRXKK3MAQsJBcAIjppbo/D68+ce37TXhFUAbgC4eE/UFGAa2gzDOU8CYwzGRKoYZQsgrTIMgTeNMY6HY+oGIACKAMg6NKgPsXASmEIeI2WJm/gsQ8EbhEn6yf2l1B+jnz0CIxkMYIjMldyFMphENdPPscipvOGzGo9e19bPWQCOMZtMCjTQuiwZGp9I7ZQbdZLPwr+MTmDxqwC8hencIj3x99nE6h0kb45Jh+/OglllN14jTJQygyXsADGHy4svEBn8pKo3WpO4KasmAX0IAja1osqkTYN2zdR8NRijGgM8AsIiGToLHD2BJ8bmgtocg13BaTJ7xA2ACEjg1nI7PbaCH15RSuz/0EQLmMPCGwB0Bobv4deQp/xgKfnpzM50fk2ZS29BcMTjuTKHrZu+gt+qOmfBVcyZ4LOa8X2XCx0Zonyq6ZFouFRzp1E4lGVjDZ1ADh3IpSwlMJZhAj0tvt09hTYCbswKaZhMQPqBO2LxVdoyum4zBGl0qGmAAVCgzfxgEGggiyGDY1YEco3MiZkIeXQQ077X8Y8F8v1n9Xj/7FZiggEYHW3Dyue/U0pDxyOpNgmDBex8I521wdDXi/3IRgAhom0EI9zjMY1yAzYKKyqaLpmyhJ3YeCPFodSyjYW3osoAluH7A9krgya4ew70c4xPnPCT51E1ry7vpm/MLBQ/gZBITW9SYZPrK9DSYJ6OpbE1F5fAx7vVagcPVRDi8o7PpP+7PoeYek1KDYPv9GuQKWCZxxT4PEmpMq++1dXh5SguBwwnQIIjm6L+QikFnbJ1BoPi9UNUHdPgXB+wf4RfH7kNBDT8rAUIyspoumFFDf6k6IGcTTmFAp/FsyegxwqiXYhdeGPsyzMY4qPWJhTRkZgqEK0mTTMAuUgmVwhweAOETphH8ggEToQH+kEaXz9lBa3Ydc+ffknXebQJORwC8MtECbdsmH8LaB8BWQBy/Vnxjn5i7Xa1d9LOHkEAaCeeSqWrAB1RkNQ0B/L22sDXENAREq/zmGdzPnZz4qpLUd8wrZe4IithgtlkheI0A+e1g3umUFwKSlQ/VJ5661qW/eXgnqd/jmMU2GhoA8bqKrpBVGzElkwYmpGhiSGQNnT0tn3ZWtZvhaBGoibWpLULgdX2LIz1d9Otn9omDFQ5WMBNMwqaXSAgof8eXiVmJYBx/FtjG0DgDJu4Ssug3F2dSgZNpxKpmf9VyUG3jplvWxztqARP1cvLLyTgeQ2Qw5Vlcb2KODkXnQLNFZ9GlcE7XFh9yUob6/rva6Lv347Pj2JdgPyGDXspqNhqpV/wef8hcO5EQOeaATmEh8MpqxbrikNCrcwV5YPV8ax4GZhwEASEVk0DOgKoeFF2i7T976ePSaPjCDErbS8FVY/Vo2MkF1vXD12Kp/ODRehGsiPHMK8SEI5uoCSZ8vlJBASOQa1AzkG/gVQm8QY1KpV8/kkM1HQ7C7RUIl4kjlm25fllIHYsAT61WMdV2vE+lh9+hquPvU3MgC68e6oOL8LlsY/eXr9tPQyZu1rUL/HzjE2lY7CaUvHUF/SYmy7R30E3zkLwaz5B0CV06PYXK92kktZfNj2274bbfkR/XxzqFHUM2bV3iuXn71GKl1HfQ15juPSFFVPTpsM9Dp1TpOH10Hg1flkVZLY4P4JNlZls6yxywbXfgdkGz/vQhqNHxyCsgh3Aawq0BsMOC9gH7HwiBCkfiZ3AME04hIDOQch6L9+/MpNufq6EDXlPbIHY2IGZAqGzCeNZpXvHlgDvUHc+iNcX30KrU/6b7k79D9yTdRCt33kwP4e838mdT0eENEIZjruRIKZpJBT2SfJDOBiNZTWKtAC03PgU+SD6lVnjdcWKHlrOPF3A1FBjT7C/95t5ycTil/or9CFPWFszJ/1PAxk6RqC8ELtT/NlV0ARTiIpEsgW3Fmx7bQDetyKcDLUcM1Ix4H6k5DjDE/vmDrJvdB9roupU1Qhc/O3abUMEVBGlgVCUNntQEh68aAlCCMJPBJziJSOeG37lXcgZRb5cbna/VN/+fJ0Ji9IBTKKIFrStwlD6oXkhLUr9Mc3eeTfNTL6GlaTfRvOxzaF7mOfj7apqVegHNS76UXiqKpZb2sqAmDCGjrE1qpkHIPHK5m5iH0Vk0LD6NshsPulpTPpfJmUcIy/jD8Cnyafn2WqNkevT5bKO1bN+nqQhOohBYPiFa1rftoPcqngTC16xtra1LuP5SdIzOm7nB5Ovz6ccP5NNeA6Zzapknih1BiZIEfNO1CDtAzhi+AJM8bh0NnpGKFQ4VOo1JpnmAhBERABgKY7UfXyGQbng8oowooISjk+jBdY3UKWq1S9Y4r3a/KXr1CcO5CwLXpm119356pTiK5m+/kBanXUZLMr5BSzO/SwuzbqB5uVfSkryv0bLMq2hJ9o20BD8Xbv8KPZh2G1UeXeMOQYcky3Ru5I3sFqCe2YJ6DuEVH5lBX5tXhLqJDoOfeGVc5rzHDCrOc4A1hWdIb/JJ5BGgVidGDWqCU14IbEbIDtF7dQso7oOv0fY9K8zg2y6X78XKI3QDkjS/XFlE5Z3aTgYM24YTQH5ONllBYkJKQyd9fT7CyXEwAVNRGjYNq2tOlajZCAaAhHCKA7h/OJNNoQ24DvGs6CR6KGmvibN75T70dTTfVFc/eyTbySKyr7eEnsuIQt3BJbQw51xalH0pjutpSdY3aEHmdTQ381panHUtrcz4GgTjOlqUcw00w8U0b+cF9FDyDymv+U1R8bzCezmfYWtT8WReJ32J4WYmsEyHRhifS99fmke727tce8mh7q8fhrCMhKCMKKefPFoOlJIEIHPot8Fq7FPcMZSV4O+k+3P/m+alKLo78QLK3/OKUW8aNOHbb2jpps5OLv1ulXwAl5gFAoZ4Ko6lPldWbTPdMHObqHTJ88fWSQFIWEK6gD5hiDDExIBbED41jYZwASrqA85EFvC5wmYzgJ2QTc0u6nb6GBhJ0INMVHWggh5O+RHNTRmC1Y7Jz7qS5udcQvNzL6AFOZdi9X8dWuF6WpZ2Da1MvQo/h9G8rOtgIuAnZFxB89POp7k7rqatNc+78HgntZmsqYVi2UMAr3D/Mds0VwGJpJ9BC7Z5glhrxfF2umk+nusPhWLyHkndb97xkUuME1/b+6mgiyc1gcSAx+sVM2kq1OnUlEtpZfJNdKglS6v8gEbEnHy/ng+mnoJjhGjA47ddHl9izRG6gMPK0ZhgePthyOVzTp9BoNPx+yCo2AgmfkyDaWCu4TSsoompdB6ig6SyZjeUY7XCAsZIQK8DwNg9pu6RKOfQK5jYG2nBFlb1V9ByVvuZ19Di1Jsx8Tz5l+P1S+i+lGtpRdr1EIyraUn6DbQSv69Mv5YWZF1DC7KvornpEIakr9JbNfFwMfwmceZzh+bNHKSgmaoO1tTASQ2S4Br1ar1u0WHrkOWNyhYk1JiRVEnD5uRQ9bF2NycTzMoGYfj/MyH4KDNkG4/VphCiua31bLu/gZ7JHEkzd15EM9LPowdSbqPaziTj/NuyMsUrh0PG6WChgQgQoz+yobyTrohnllGerPyIyUwAgfc/ixNNqDCeXI4cQA0IJxAKripmuhk88O/MyaCMht4QooeBXgMG+rU0E0gcQAA9yU2P0vLE70BrXUwrsbJXQN0vwWQuSR9Gy9JZ7V8Lp/AGWp72dfy8jpanX08rUq+nu9KughBcRYszroamgFBkX0PLoT0WpZ1Hs3d8hV4pnwc+YlNIyKkfbHV+O32JYeaJMGdTELbemUiL39tt+jBoFvaD63ZpbQAwacKb9W4PFk3R8WjB+r8Giz5WCELohH5TPeSQrQ63Z9J9O26hhIzzKTZjMD2c9xM62FsZRFsYIgX868V5xBm0nCiimS6dAoRxbJk4egrJpAimgHEYCNp5GMAfLh8fMKkO7GPkCuLYs06i65cXUkGjJwhfO9cJBLObtt1r0lzHad3u+2hu8kU0P+NiWpx5tUwoq/vl6VD3GcMwqV+FFrgSf38DAvFt8QuWZFxL96XdCA0wjBYnfo3mbrmRZm+6kRYl3kArIDTLsr5Ci3O+SvE7LqKXS+OoJ7A/OEABLXxPZB0CjpCky9gmVtNpoxPp2YzG4MB6fPQ/j0NT3JEmGdaUA3tl/Nlx9kFj2D7fp8I/+LuEIFQQHMelxecV79j5V3DwLVqEQWVPe07il+j5ktup3as9Xp70Y+ILdop65udav2svfXkGeAajUEiCjGIE1H64NJcoEaw9IrpOO3688oE+cqMJNbKSht9bStVtbW7oZRl2k+0yX3tc+98LBbS2/G5asOMyWpx0LVT91bSUBSCd1f81MvFL4PwtASawLP3rtCwHaj7rS/KZxTk3UHwuhBqO49OlP6dt5StoW+kqeq5iPM3NvoKmQaMsTrsZWuNymr5jAD1ZOoI8PU6PI6/rHD+7s0LQRAU2VfgoBrfyaJ0DY+NfEzCTC+fgGX+fRFHvFoWoNY8gh58GB+UfMAfBz/C/Z7YcoPu3tLnSz155UuO9lJB8Fgb1Wlq+6d/o5ZrJyInVuD6CRQeFhbv7gIcui+cwaZvQywdynG9In8wDGCjMY3AB4wt1YwnuOTAmg25/rIiaOskNM3sNwdTpFmJxnyFzg63+JnqtNIYWb4RDlzYcGuArtDwDq5jtP/yBxVnDRCMsxmsL5SciAmgHFuQlcBBnp55BD6X/GOzhzUgGNeJKXSJcvYiIGo6n08uFMbRsw3XQKF+jRblX0ezEy+nZ4jtpv99gCeIj6Hj/7sR63UZnInIOkYVgJedRdWuQefV8zn4I+Ct0+aIG2u/AD/CnGEzy2Z+ZEISUkZ2w359N456opfNRoFlwuDMEZz9I79RNpwVboUYzhtO8rZfSu/UJkGnDFAa9yoKa6wBAPumFZhocuUV6CoVL+xgQNWMYASyV9HMYUEBJDMVCCMYl0S+fqAaL1xuMpdnHsI0AGDNgGd+6OVBOL+TH0ILtDP5cIat8cfZl+P1aVwgWQggWZl0FZ+9ahIBXQiiuhGn4OgTm25jQr9BTOT+BwCW5o9HtVNOaoeikXbSj5h5auRl+RhrjChfSzJTz6dncKXTUW2kKbiwHF6XoN/aCBGtK2UYn0/88li6hIRlRiX6lSHgVeXsDbja917Y/lSrHTyAE/fuAGhVnhbaJ7aHbnwRgczswAPD7u3pDhASi+3LNOIpLOpvu3/41mp98Cb1Tv9T1D/jh/CbzOBvOkIoGoDRrJwRgD50+tonOACqoZuzQ5eiTKqUZ1SgUhBz3GPou60jLFIEGXAfF/dfYnUOP5t1Ks5JPp+WpUPEI9xZnfhUr/UodEWClL5XX4OhlX4nQ76sQhMvFFCxHpLBoyzfomfw7qaWnIiTc7dWcBlNS5reDtY8Z+56k5SnXwCk+hxZC2OZuvZkeL/pPau1pcgElwQQBNY95EoL9ewgCqHBqzA6atyZIXD0EifjKgxm0OcN8z3LQw8CpIARBjRD8nI9GPlchIR17vdFvNRnbZRn84CC9mjueFiYNhI29jGYlXkGbdy93n8cZQ/5TyBfcfgYkkSGgmw2MQ/g3vUBInur3pTT5hapg0QomnKlcPmEadQV5beb9+s7NEIDv0JzkszHJl8DzR7wPJJDDv0WZw2hp9iVyLE5n34CRwBtwf1fCEcRrWYCOEy+klwojAeg0kMP+kArmgFTQyMRwkCul9CDBHg3o8ao5tBPmA2hjyvV0NzTg3G2X06rC/6YDniKjuPQNtoIV/ZP7wYiOhBAgCgqblE9/yTkcDC1LmymxyEDJtt/FIU4pc2BZboaUXsttpjMn7RAK+UCwiB5Fw8g+vQW9pfTHrFE0e+dXaHbOOTRrxyW0ru5eTHyb/phPCw3DvCvXNdHQyESddGICCkgj6o5EmvznRjrqN+tRCj844u/mUlMdn3sdLWBTaevb9EDyv9NCRAFLMOEM9Yrdz0IYmMHe/o0IA40gwAwsgee/mM0Efl+cfhkt2HwlYOQ4tEWvdRx3uYaF67EgcLlbjwngHHnv5fy/maeS7o30UNqPgEEMo7shDDOgAZ/O+y3yE5XGh9Gfq+zoom/OgzYYjUhnYj5dCae36oijX/3U5TM9/GBwPiUZ+MeiAysE0mayRdwbu6QOj8kdQ6evofTdBw2irM+yt7uRHsn5H0rYeS5NzzudZqVdRJtqHsD4dZhz+ow0eOiRrKN09nRogVHr6AwUp8x5ZzdWvQZ5ONznRd8lMXYrA7ZwoC2TfvVS+p636Z6Um7ESz0a4dwNs/3BZ/Qsx4QuzvwytgPAv9RaYA0DAGV/BTw4Pb6QVmTeJKl+27eu0tnoRFvdBA22zBrCkWojvlWP2bh3da2KpX+f9pdkl1LyDelZ0vITC1l/QCpiEBdnDaDru55W8O+ED7ROtd9yYhsTqNmQU83TCCXS1/3msEOZCQ966Wovhrk6B161TBScIDRHtEAxrf0cv3bisRJMwweO7fD6o2G3aCew1Z2psL6J7M35JCRCAKXCeOGGTXjVPOnzYbqpV/1tXc4DGvJlNj6TUuOaF191xp9zbr51AS0raO+S15EMvII6/iZYkAwDKhgBAxTPsyyEga4FFHM/DJ1iWOlwAoYWAfpclfxexPjRDMnyBrVfRhuqVIliOwAmJFgBXIKBVOUcFOi9C9GrGQfrhA3n025cL6NCRVrOCvW6qsLk9FUjk92lB8mXAJfDMyWfSa8WjqMU+rCNY4+7/MeuwUN/CxoN7MX4Tzdvc6AqgJLvkd49Q4E4psEhrA7vPZ1J3H6KLp8IsTIAjNyaHfnF/GXV06gkM2C3ys6Ejn+5OvQ3x+oUSqs1LuhKZx9l40H0OUmqmm/qgkgJIscoNWC4i6Ay2Hxph3Z7HcK4bMbFXiqO3BM4d2/7F6dfQUp5kIwxLeOKBDi4CErgw6yYIxyX4/QJagigmZc9TbgZPtIs01AyYaIM1s8+tSH5oyyE6cywEfgzg3pHb6caFebSzvsNkqAwbDJ9t6iqhx3N+QwmpgwE9n0cLN3+d1hXPxuQ2uU07+DGWvFtpClaK6QxwI9+taTcJWp9oH3+wW+KpIQS2yQDyz2PICB4ycS4/9MM7Dgh/Tvh+I3Jo3gv7JVkUQITtnLCsZT09sfU/aEnK12h6/qU0Y/tXaW3pTKjZRuM86eJNnfg3eR8xij06v85NLi29VDwIRTfW3k8LoMbnZnwZqvcryABeo/MADP5kshBch+N6gYKXCQJ4uZiKxRCKeekX0tLtwynj4J/cFa4bCugLW44GsHSJPT/Cqi17UCW1XVcnxddoKBjJrhtnJtL2yl43cnXYSjXdyGxm/AxRCjQCm58Nl9DG8hl4mhZ3sLuABfzPM9XaP0Dm9BoQTdo7NFuhF0hnwP/ptDL45AmkkBbe0qM82FqAmtGZ47E3dlKN4W/zwv/NSwgZJ4BQCgaxGptCM7bU9z0Xm4bDG9GT4Ac0O+VKmpl7EcXvPIeezr+DDnTvdbLTWuuYOm5tG9t080tzjg5wGN6onkALdyBhBaBmecZVgvzxyr8r5d+R+PkWNACngoESpuN1+AZLM2AustgRhAZIOZeWpvyA8g5vcu/ND5Ap4DfkmIDpqxjSQf2xzdXSA1lNLkCKO41Oi0vXRJeEWrHpA5DhfCV3t4MFS8aU/x1s2013Zf4KybULaFbeUFqQdBptr10RrNbmsTzeQ1ctKRMwjJtwpJfqXgjdzGTyWJ8KZPi3CUEITiC9RyxHM3jR1w+ZsZcPue/vQ/x0yyIMTmSBtJMbFJlEq7L2BINKWxNSKw9shzYYTgm5Z0B1Y6Vuvp7+lP1D+A7BSdGn5HqGXqlCciKSNt9+ZN+m0vwdX0ZMfhkm/N8QAvJEIxqAMLCpWQwsgM3A0lQ2B9eJICzOgE+QczGynUPonowf077mbAfkx8LXKe2AxaQPxupBlvH1uuHx1PcPUzjKyTiMPR3spgGxu5De5j4KXIiCZhqofA4fBex/QhGtKmgnpxlBm5nlfa1F9FA2NNZ2aKGUH9LM5Ospaf/TOkNoxvPt8nY6bxJyDOOqKL3OECMFlmgVFPSzMwcOv0m4+TpM9Ac5mvTbp8EA/n0aqnmOuDOXjtrzCxMyhEypJhbROWhB905xj3F4uslQ7qmq9X16MPmnNBPJmYV5cM4Sz6WndvwIrJ33pE3sif4d8hfTK/lTac4mqH6QQJbmAelDsmdp+pWSBGIUcBFW/0IkgxZlclYQgBAEg7OFK9KupnnbzqPHcn9NVd079ERBtVnc2YT05Av/QXoqaeHg0HUWik/VOAgA10syYxql9GFsBrhimWlkqGscEpMPToNulTsoahu9kt6s6eS2140a9ndvpQeS/pcSdlxDs9K/SisTvw1NtFruw7a1lr1ny266eHIWVbeYEDTgF6g6QL5TQAhC+mvIDZtluXyzl9TvcunGxam0r7PDVZ1PZR6giMiduvl0ZB1dEp9CydWascutG3xmYPYcTEe8/j2KybiAVuRhInecTXdtu542VjyOqGMXwrAWTMQxNJo6Qrl736PH0/8LGuAiTPCltBA2dgFj/rDxbA6WciIIE78Y2ACTROZBEBbjWArBWAGoeMnGm+mZvP+hgz1FLrmUa8t5kQUEhIQ5ELKjNm/sz8x5hfkNqbp8LcF0OeHC1jjTyILrKSXjya10C6UFbnhkKv0xpU0IM8JhsExiC0NW1bsJ2ugmmp8IwU+7mFakfBeMozR3jPd5fSC5HkB04SNd6dwrmtf67B3DD6OHjmouae6my9BAUt1ZTKNfru/zrflvV0p1sYreJbDvV2flUPn+XtPPoN0leTQcLUW8/gOKyh0E/P5SWr4Tahyw7cqUq+mx/Fvo6eLbgB/cilAOcO7OS6Hy8RmEgYuQvVsAsgfDvsuA/nHuf2n6DQIIcT5gPmBgyQ6mfgUh6Zfo5YIx1Np7xI1EyOqWLmK90jeAKWK6Ra2Etj1+uuN5mLQJm6VzySCsdu50wi1uBiakanq5CEQNGM8ZUufAzzkI6vztrGoXSGKQyQNvySP9evSgVbdtpPuBZ0zPuphmpFxIL2b8lPydB12stQXC6QtoOFzqOT4dYtHfKwShG9TYDoJLCW9iRYzKRc68ACFRl1syzomRO5/BQI5O0Z40ijRuAXm05IDm/3FRpnOd3d259Bio3TMS2YvmFYxQD6p8ASZwTgpsP1b+YjiAywAArUj/Lrz9m3UUADRwUSY8foSDyxAJLOGfWdcLS2hpJthDGWfSnG1n0luFC7Cym1woVoiwTEHnxlI4vCFdhGq6fPTrR6v0fSNxNTTepLClpQ3K2wyFfkgMl6uD/DozX5I+FyLWfz31kJxJOrnzJhkemAN/QBrW+axukybqATq4gebg/ufASb13/XB6K2cKpr7ZJJJ8Qrhl5nGHk3kKnBJCYH8oenf+rmz10SUzmEeXT18CMzhvX6v7zV3He+nWuzN1l3FWnwiBfrQ0m+qPORQgv3utQ+25aDo9hmYDP5iDGH5B5rVC7pwP0sY8ZP8WQTAWp34TqN+/w/7fpOHfzMvAAhomPsFyhn5ZUJgKlvEtWrYT2gKp3fcbpkPVt5knsXVHMcsruAPHgbY/2KG8AoriZw/q5thcbBqBsrHTY1H1zJwG7qaCXgrhKKc/Hf2MzkS1U1gCwjo01TxzaiI9l9ri8hvaJD7o0e2aMYk9srBZFLrceC/x2JO0KOmbtCLxRpqz/VJaX/8A5tv4QrhHVCKKrrQD1qmgCT5aHmzTRu7hzYeFXq3GpdLwu8uotzu4U0Te4Ta6evZOKb3SPYga6Ja7q9H9qyOYSTLFJi2de+iZghHQCOch9ofjB2LnYiRjFmDS5wP2XZytVz47gBwRrEQ2cGUqzEQms4UuwuRfR3fvRBIHNQJLki+m1D1Pu8/iB15hgdfoN421dTNtvzvAJU2H6ebFmNTRWNmxoLhxI022/zFMbdelb9K5JLoRwoFogNvpoJo6LDqXnsvdQ07FNPcmsmzX79QFpx7bTbrpeiPDqmp4iGanf5mmpYPtnDycyls2hDCxLFME23uKVyWTrubpRiz7nXvqNHSMpk2jXy93yX58+5urWmkYVySNqpdeQNzJ45v3l9Cunk6XRCOsI5yrzVeJ3csW0extYAGnX6rtOjN/M7+JhM/XNQyMyGBx1qUSEbDXvyTzcgGDlqXABCR9ie5L/jYVNK9zi0KZesL9DWxbl7p53NYqut5xDWrVhs0uFTLoaSCyDInBKmcaG5e2S6ubUtlVhfdWYIZzONPg0Ink9Ikgluzca+w5shpyDb/bHtfZAqEdGufPKLqt1yiQptbZ2mdYXbWQ4nYi07rjq1R2eJ0LvsnYWjbZp3oZmiRYDK69qbKbzpoItT8JkxydSI+j0DAQZF7S6/m99CWUaoWhsZNEDRCYnzyYSlWGmNRrkdvRq9c+RGtqF9OirTABaUgH82RnfktYv4uADC7IvlSgYAaHlmd+XXyDhRxqbr2eHk79KZW3/yXIh5RiU6/mHDLuwL0UAgFT8wDqWQVIrrOgpcYWC1AzeCrXO+TqnkbcpwjhIDuE3OuQ6x4GxFZKWfpl6KryeqluNiHCxrUHiCx4zwapJbK047sXim7sKwwNv0s/uCuTnC58ooUYTIKv8mjez+ip1D9QW6DR+C2WgdC9n1olmvrkK/3ERwh3RCOIpln1jDcO6NLxmBw6LWE7bak1cKypMn0kYzcNnpCkN5GIb5RO5reuyKCqQ90u5Oo0iuCh3NqwglZsRygI1S7QbzZQQBaCLAaGhkP9/5v4BwtTrqA5Wy+mVXn/j3Z15Rj1bzqnmX02xHyxWuUQ0LTUezJ7F50bze3sq6Rppu6ilq0LabnwlSd8iq52lv4KzHNE6/sv47PvFraZUjqQQS2TPIIc9ATY+rdLwqkLL494rlJQVKlGnpRN31uRS0d1bhy3oRdQbWsiVR7KCZJuBCT0CV7yae3gehLNgU+vMhM0HAXW+q278qTqhlu+3bQ8h/YdOxxCNQHXbhNCRjR+kkaSaCqhxmXTDYuLKP/gUZegxgq803yhdv9G+mPurygOUO+M1AtpISKGWVnn0dT8s2hG1um0dNu5dE/it2hN+Xza7yklxzuzubrV1px9t8GqFRzQxTtgvibvlHuVLqrTEfrNTJFGmuHwA7iKOoJpbVO5zB1s4Bj0OohOp4vnbkCXU0MCQQTAFVReW2v+HhEKjYoewD6Nv2QBALFU4ftnTeJqKQhS1Ba69eF6OthhEMneLlH9HKZ2BozmlJ4IvmB5+qksBAHhzvt0SZlXS3USsmBn8uBNYWr4u3TbA5D8ENSTH3bF+nqASZs0dYxjbHjjV6JXwbrqXjcC8YVsl9pODZR68HWUe8+j55JH09M7f0ePpf0vPZE5jjbXPkYNXUkuVu9MuPYAeUIQbVteF+5mnTMLmbvwMeswsWWyY9pQrnGINfsesUaYyqznfGmnE8Hl73Ga4vbthdm0Y48nqCe5qsnuEXdQureaGoc94JP95HGOhjZqMIk36uIK6ikgkjCairzK/zxRRY0OeVCiAS1Mjjp09ob6JxAC3b5NikvJ4drbtHjzfkzyZk0VH5NH8S+WSULGdgO1AM1dhzY23B4uOscMchldjG4m7xQdJSsEqAzdac7rbyevr558vTV0vKsWzKVDFEptlHCKy8aNd257OfJo12008BpTweL/zMmt93UdwFT0TQKxdSjg7cHRKGlHToAxjTDZSQ2OIDe+wG6qavJWbL6ZSel7e/rYSZ3n6hKH0zKt0OsP2/QbtKSRWsQ4bs3LXVRzhTDLoNNA3p+Jd2gD92L083XU7vGbjrA+XS1lnMYA0T+HJtBbGFqmqZQ0bnVcOxRcwqv+XZ1uyhC5nZatK/zQ9xPeLdCZM96xlDepHN8otfvPpNa4T++VotdWiZtP9E/YPWLzOzHZewVk8VvBNvO6/iBAjV2d9JNns6SXolQETa8TOz0QtQ4DormRFiqFE9D2DlHAQIR9YXH10s1UjUmibz20E40rDMm1xxZhC+j1b7b11X0QDqL6+MblRZoah8kfGpuvm2fMqZHaytMBoZ+BIhpupiHO8R82oVPLvpBQOZi0c7pGE/0TCIHf1v1+xP4aj5v/FaIN0dXziqTBhIrhbqWp9GjmMVfUA4ZR9MDaPNCw10Ij7Nd7GYFpc86YD2jy27Vg6XZpz9vvFRHwOxtmifcc0BPgtYUC0C0umu4prj/d41YBpR/qom8sh1YasQ1p7npZ8WHTEeqhfc4AmIIB3E1NcgG4F25xKxtq7RIn9xersqjpmLP82yWjZxluq1h/AzXn7eml6xbiO+BJhmHvxjCUzymJKljY0L8RzbVORxp64OQCvXfj+PW0cAMY1L0+YU5bJjmnr+QxldWfXnn6SW1cpZGAbnFkpA2M7YR6Nr1X3ooGEymykZRCMclpaFP3dtFhF3J2YuK71u+iIaPgpE0q0N1OeSWhzuD3z6ZQSYfHVcG+gMPx6xVuYoCzbNyEEqPnCQj5V/oqSwGK0Rybqyy6cQ40wB8ysAEmdzlpEBg4HHyAgdxVLbZQ9lgYFFsg/Q8GAATiDbV5I4vb/9iEdjlOXzu/bNMjSR08tSeE8pWLOPCWWdAwIyFI09FRHS11Zb/G2GpJMnFzjQEQgkGxnGnkfRihGddXC3PZNuxdyw1i/AYkMuFhwD71hUA3sOzQkZixaeKYG5z8geQGnUhCQQmHSkPRqyfRUGtD7fldG7DHAYNNvEkldzedvEt+v3RpMr2dt7tPWGrBzlMvPGhAvm3MNZTWXywBvSEYBqE6qkKAH676HcI9B7mxBSY5AqtUWupzPmAaJgtO4FkgfA6aXCo0cDVhG41/vQpwr9+xADq56NUkl15oKI9JgO2sPEpXTgfbKLJYb8nLFVPcMX1SLTbz4C6tRdJgQ7qgoo/CQDTgnrO9Luj1Sos+l9lgmoNqLWA7OMup3sJOT7x2CHlSRbo5bvZ4XQke/wrvMPIBDeJYGxtKXDCrgLY3HnMn1fn3THKtpm5N2o8eRbt1TSJ2Pz9jHJpKv9RM5c37T5hSs4MV/fL7xvo99INnq6VBFsPZvKWOmlYj6j6CG1/EGQxgGrfULxY0MIxrHFhQIrfRdDSqdhhUekNvx8eA12OZiidc6U30RBgyp0KuwU7fkGloe8v+BUrNuImGYk0DJzOc7T+zilGh/GjSvr4DSME51g5il/y/x93DIwirn6I4geF9ygB5JR/vM9y8AOy4L6AdxYN47Y4nS3QDSG4HCy7i1dOTadMuk2MIaSH2emE7XT0zVYNObKu57zFve49K5Munb6MRoLA9md1KKYcDVA7+NuNROcCcN+0J0KqUDvr9qlK6IBYVTRO26ugEFc1sYqS5FdTxgBjd+4CbYPP7sqsKw8PQOqdjku5KOqTLzUAuYTDHY9SK1+9oLj1jz+5AX+UpSYZrUKmbaSHM5SadAyfzHk7IOMZDALmUDtvtfGlqCr2cfciEgVqrsMsSIKc3ibOXvEdMrNvB7LPoT/D3CEKPzKNHJ2UChotIuli00/Ri24OJum5xg96DiNvYjc+iy2ZtobR6LQi6h3GnrIYtjUg6LUcoNSIJIRxW1MxcjebJ95i6lkxXzkukf4Op+A+0z+duaJfOzNDIHHojKXQJCefwbjocs4Qy6aI+BLucch/lgTE1ogXCpfAVUDDDw2PT0a42G61mjpqkMiYDmow5h92k2956zHPx+09+UAUG0U5JNIWz88eV1LylThyHgeioytvpTMnXJge+xfkwD88Kuyqg4WUscTvgTLveG9rp4maaPoWEih7jRp/CQqB7AXhdFlJAgBNbkDTtRns1g5gJJM2tdNOsXL2d7cxaaTd/LiZvXZlpN2t3u80iG8Hn/9njmRrTh0d/LlbUGZzWlWbYjXpbOi7lmpioy765QbbsnVAi3v9gfOYM7F8wFG1nJePHO6nwPkdYtRHxhXKucOYJwDwNQ+eTlJKjJuI5riucTL+gALhQHifFCylY+g7OEY02NAmpuncS0MZB8HfY9xjCziWHhGxqoppk254vzyqm1Ko9bpq5w8mRmFXObGw/t9gxO8rpAMh2K6u6xRU+xXsW9aESu2BQfyEJxjmpdT66gnv5oFW8bG2P8rVzozNofW6Ly1XQXHsPHcICmP5WHZpZJ+sNJzi1K5tkcsl6LVY4Ns+abKheUr1cLAhdOCN+aHgdARMwELaZO54PQMMrRgAHxuud1hUXvY5Oo1uhSfIO+AwZplcEmAtdpBDFcgo/UFAPh3DMi0A6USMQjtb5vAsa79kYhg28eU+l0+MTcQ10VeESet5E4848ug6lZtvr3TpziVzE55cdYS0KNvgKfGQ+3/qU8oif0YbZlltdu7H4GH01mlvg85b3ddKr+Ap0AX0h7bAZjoCAP06H4Oey0DB7pu6YLhtWcKv52EJx+AZMrpF2NtzdhO1yRHyFLmnnFRnHex8VSYd1dtwGTOZd1YtkH4IwpLxvf7qByo45KhiETuQCPEIQ9Uuja2fXVbRkpP99jLUSyuhjcA5pplmu93AE4BQeq01ABEcCnIdANPTdZUW0c58vZCFosi7XUXhEuP5l9kD6G7WFeNp6mt9DI+hBXKfPziKv5Nm5ktB5YkNJCAwcXBFNx1rpjmcwwQCTpMgFThzvc8AO3mDJ8+vmFrJ3Eu+nkGCaXPFGm5M5GVRpKqSwRQ6aXs1cV4fCD5Ne9PslHGfMQe+q0uYKQMm+Y3TFslLZkZW36j2DhYB3PWPK3DQGhdIhfDBNMQc0Eom9En/0RD41Hu9yMFU3qSTd4AN6v8bPegecz0QIHCw8YAW93e3Fe8DZS5Rm14N586uJGNTxG2jam9j3IHDcTQg5IRR/K6lsD/3+cfQ5nmh2NJ9UJRMt4R63u5cdTqpFVUsHdAZsuJ3caPYbSuiWxwpoa2WwFDwQ4L4BtpSb9sD291CvWwa/Mf8o2sjApIzYKEmgcGyNKxteSFjJAFgTTE61zkLG1steypF/ysdWeY5Odxw+3WOAPf5e+7Pe7uIzFAK/+Lle2SXNZ/vcfj7vICTkzuDcm4B3Qmfu/oARmfTbJ0uxBY2TcuruYze5GeS6Cj/NfqWWvo0NJ4ZCcNS4bUJv411G1DhOZefJdnqDsaP616a+j13VC+nZIj/t9oX4LraQwYTpw1vSOALKQvBAyjG6DFC3GpuvHb7p1bqxFkLKCDiVg5BxZDAonGsQkO8YNG49TcPeBq1m3yay2nW7PtvsmyBOpkdHArb9+RQCZvd64f33GixRt7TTa+KV4jY6fWamQMURjLpNAmdxLFbtXTvRuuW4m2/oDHCDCrsPva2utYX+UneYlm46RNGr99Lo1Yfpdy/iQGVU7LtH6Jncg5R/6Ah53AIOy8Tjlkw6Vx3pMmB93i4I2KK3YaJitkuqeRDj/JxehonhfRTC4fydhvb6Q9FOdyAzj1CLOASMquVb98gUO6lhDndZADxu23qnsrnzUyOKnPo+gaVxYp9TZxswjCMzHu8W1Wt4dUKJ7lvMCN7oIkCymfRaVkPIeXwmNxHcu7j/hWwKapq+b1myqbbfIUtL8WmwPXs9tqb51aparU1iErH60zW/EP4FU8x4277B8DtOQzQg6eFI/plJL+Xs+XA+xdJ7NwYsCtka2Cc5iF77X2qb3L8xivTb4uyx5+2X+j9bc7Itr0n2eGjY3E2aucyJHkYXI7OQgs3AdrR7UKLWHULCDEhTpx5pjukNdk3tw463g4fetULCNDHZAZ+LX/CeDU8iw3nl7GyBjSNAJR/ApokJL7xxFzOPORrg3VU5NyCoZzXdNCcXlVUHXa2kF7ylw0qH0yDle7qwzWPZcv1AyIZZnz8hsHXePCCs327TcIxb3Xt0bxh8YMueNvoWaGm8r5D0N2YvHCgfbzj1o2XJ9CL2FtjnDSGamBjcNjk4Z7sEbrKlD8PZszUHwDL9RJ28RdpeL417FmhiNNPic2XiI7jOYDK31a2SfRbDeDf3uCoRBMV7HoGV/J0VTZSy1zJC6dFMY6edqm0Fi3klNAyYDUJ0rMCg2OdTCJzFCQSOK3+cQWHVzGngXjs4pe3tTABhMAeRw6RMyfQJ2hfJjbJq6d9XltHq5EpqO97+MTkNTdGyToS8QyOl1R6h0W9g5c/FNSan6NIyDiMnwyeJ2iMTPhS5/zPQUzlcso24dixXVBXTnU81UMdxXX0saIJtk1NdpDWBKXQRJ1BHBT220+jeZ9LS9udRCMymBrr/i0yPJdTMY5r9w02hpC+R1ghHsUxnvJItWUTZVCuBm10iKcM8PVDWwgD3Xr2smuLW7qUNVU1Ud/gICledmDzgipwt/rifmru7qHDffno8cy/951O76Wze5HIMEz/zBfwZjCTVENQbDhHUsUTa1IdhM42B3GourknIouEwS/PfzjOK35LJ7wn1McxT+R2UTybab2oSPKb9rmu4Po9CYDJlIQOmHbhus2K0VvAJa8jnquvncjvpqhlYqeN3CC8wjNPC3A2FcX8mn2DfwbPG/YW+jhX980eKadwLNTT7L020dEMzLV63F7WSu+iOP5XTD+7JoMtj11DYmDWY+BShxUusDw8/jG09VH8EwtPBwBckExiN3D/jD+wYgh19JXZafTLluBEvvWeTo2UsCnLltXiHtn61TD7EH7r94edVCP5WYCHgppgzDxyjXzxeImicmlCoawMTDDLIeyuy38A5exBGZbNrzjTyEekc+XrfId4n2eyhzAwg5heEoSJKb6jF2cU6AX8GI0dxJvIOYeMyZa/k791XSIkNTkfWgHYoA1bITAbcQtx/ln+nvhDYOvvYgdV13A6O/cuJpUDwoBHGc3x+UO88OiNfbDWXjg9AfiAiulD4B2HswEUXaxRREL1qmejB+P00VBoNwBHBvZP5OxAE2VEFnEOpO5RKZFQcwxQ88k4R7fWE9Ha0Okl3MwyIH+M1O7japwQO+C+lCTgV3SObV/j8tmkjpOP+siMWKOwV4C5ulf7AahJPfnVwoidXCKdP8vtI7kiTbGD+4RCSQTiY5BHOrfNhToZEc2cRJLB4m3ums0EwmCh60eQ1NP6ZItqxO7jS/cIo1lEAh7jOxqDuDjWW/YUQnOx/0kSSi0cs0+rSDhhuubbJ7za00++eqqYvoT+w5AWg9nmXFM7uhXE6lwWB8wiSXcRKRxp5aCyTSEpMnqFUbP+ASeXCKVAjk1H3kE4jnqmizTXHpdUMmZQ25wCkpB3X9dleebXPvAfos88I/euZAz2ofmdHIIGYOZS0JMHDmT7H13y/bB/96uUmOhf1gwMmJOteCLwN34QcfbDzyLuYcmk8WsmIfzCuSHYs40ZUEdiu90dwKO/ZWEbFu/eH3AJXFnVK7wKfySc4O5fawXj3xEWaXwjBSQwmArZb2OKXUMtyMYBQUJhJIIUtNr2W3UjzXs+g367aTt+7aztdM38HXY7u6ZfNzqDL5qBlzoJc+u6KbPrDI6k0/dVsejGtmnL2H6VjfrtvJOt3WulZLinGb+y/3w71+v167xc7BBr+QghOnioQ4MXiAhONyYkAWNokWLbjJxBRyJ5DzhxylpHLGnNRnpgGVDcVR/pBizJbbWzLpzuT++3+Esf1jwB/EKf6nQ2VLdttzGKH5AVs23Lha8Eh7f7n+0IITooaCEDl+4XlY0rNBHfxa6Km5Xd6XZoeCKYVvfXR59PYfo/LYXQ9O5/eO5Gvc1xaajHr31QXWx8+r0Yi/QbjMGSRT2frws+3EPB4cml6t9vF3u7bM8t2qGp+bRgstweus0Hbh+2105nVNI+WDTwwyRYOnmd+zTmCiI5thCf08PWFe9yuJ19EByc/OrDJtHn3aLjZDsgEeWwil/0nwuCTvL002eQ+PyEq3Nmxy7HtnOBxkkq2CIFpsy+bVfsl0WMbKbJt7YV4jSkKqUBxG18HyJE9v5ThfSEEn4pKEFIa6aZweh9BxwlzO6QwKdRdn/16/DgOnO2UePiDGT47BMo23UzJ3dVVaxj+f5/dyPqVjjsbWGr30PuFEHzx75/PJ/ji+JwfXwzCF8cXQvDF8SkLwU8WHl2FI4V//qsMGJ7ldhwrcAz7lK8zzFwn8p9dCFgAiH/+nd8fjuO2k3n8Ddc+p//nzWvt5pkiP+Wxu+0fGbt/JSFwvn/SjhMMNK+21eZafDT1+87wfprNeX3Fxxy3fcR1/tox7Ash+Jjvf8JB/LjjREIw468ITQmrf/PZyL9B2Fb0u86KT/i9274Qgo/+/oqTcC8nEgLH7t4eMuj0EWbJMQOrPsLU3B7ymRmfC01gVsZfeyhHtTZ9gs9GfpwQ/A0DecLzftQEfwJBCRWA1Y5mOMF3S0Ke9Zx/0JEONUvtIa/1OU4FITjZ9jrlrwjBin/kvH+PEBjBaw8xDatDhOGcEGdxXciEDf+/GtOTIwT2SRGClH9QE7jnAQavQo9PqAlW/5VrRCK3EJxg21bA+xVw/xNFH65t7qfi1znRQj+hGB6iAUIiBr9Cqlqh0FZfy1wPmSUcAbzvw/s+hX4lCmQ1hSypQqu//vezOuQ6t53oPrvwvV4+r2XL+ZHAUn6+vs+Ha/M98DX5+n5c01LIbShkY3Fdwnv6O0iYnxQhMPYaD0y9uDgu4sdDWYE+ghLgAfB7FIpA5WbRDlaOkBWe4rwW8p57DeTqlBx2yEFWH9uJ1I1+cD4w2UjwQZhwPf05Vwj4MwH7E6+8SLAGcA4eVL8zUf0jiHZx6nx+hSabqocnhQceYyADbQ6LD7m+hfct/G7hPmwFOgrGBZ/1WvI98Bf6jEuAhcTWz8Rj7FwXqTQIkRYqPh8vHB9/DoKGfCoEQk80iUBAMPC3n4WF/CKoyMLhtZMpBEbakVhTyLYpvsE+jqEfN+Q1K4IfBpNM/YTAeS3kveA1bD1wLNHO0V8ILJ4oEQ4KrkAeCAr0EQIeDN+H/Zp1HxH+DZMBM6vXXC+lXwQxrI2fq8envL6A6rD1GNl/W2Sg78/yyST1WRy21oz63r3usyCzKdrE5gVoB2Tsnc/55D1eLLwY/PozInx8Xx685sGi5PnqPXlCYNshAx9Ut64Q8ID4ba2GbFmdrspf8UnMQcj5+h8lf8WBGm6H2HtLru8Tda0Fi5yV56hfJoxgFXkxiF5ZMcYURPZT/Xy9GQFbC748G2s7y0yKCM7fIwR6NYd8b50W5A8JvTZt/F7AqH0reFhGCyLpjoO1S8AsHv2al00RL1abTp4QoLgUFz38CULEgDk+FEOn/LVr/J2O4W2o/A0RAksmiVeDIwRmkkO/M8O8NqyfhqAQn0DCRVsWgKN2fTLQR1q71G331KsRL+1Xr9T3qD3d8A8sPwbdFxpFrLD9lkyOLeMBwbF65Dx+fU+rg89uiVD5+4aOTLcPPgebEzugXJ/HLKRe1swyP7Z+z+Ln7zI+izYNJ1EI2lSn76ja1mCrTbs61M6a7j5CkFhtq8Rqv9pe26W21XWprbUeHL19hID/Dj1Cr7G9xlXF/Y8Z/RyoGeZw3j8HW5+q4MBp8yADb0zMR4BGJSdwBCNDNYYJ6T4y5kdjTHXGhJfUfW/lyoAboXK+O4wdRW2fLa2iqVM0ql9rnxB/yC8T3Gt/WAhAdTEr3dh52zIm0Jg9o1lEUwe0c4qm32JWUN4n3z0ZQtD0UXFsyAC2f8xnHCcrBe3mVOgROhARU0oVKoYUOoQoNKTE+wVyhPoExmlzQ7WJL1eK5/2h8M/YWEtWmLzXdAIBcM4jE7q9ZtffihrepqIL1Jdj1qpNVe39YefVIeHljCCuYBtfQgTeGbvb+W+OAHr6CkGTMxf23zF/rG1A1hXBOqVwAmx4oUKPUCFQk0qVmlSCo1j/jMLPmNI+QoCt6ULVKA/iOZYMUk+IYxj0WzrtQOjEhtr7c0L+XnX+ovwTgUYn0kqhQjI8PCpZXbOyQD2Rd0T9pag5dGJvezG/uY9peKmoUb1cVq8eytj3IY1hOdFEPyTxsNej+GjBcQRHm6dHdeA47ulWbd5eddzbrbo97arL2yG/t3t65fVGj1cdCcCMUAfMhe+kCMHqj8nalXxMrNs/Hk4JH5uoQo9QIRg4OkkNHJOoBo7ergaN2i4/B4xO7DMoAyflKPQXdgaXV/dw8Zb1ytI+gdhM7ST1zwo6nxkQud55bwULWz8BWKf+UKJuu28XwkHtkYOp7ISPJa5AxpWpiIRCNXBanho8dkcfYRswcqMaMnJD6GvtA8duVhGjXlfqV2tCzVOTzzie2tb3jYb+854K9bOHytR/PZKpfvxwkfrZg6XqVw8UqV89nKF++WCB+vkDxeqXj+SpXzySrX7+aI76+SP5+HyB+v69GeqJ1EbxjTr/QbAosm/GLKBKWn3q7NlNSkXmYiWX9fEJVu48oJYkH1b37jis7ks6rFYmtai7ko+E4uqR/Hfo0Q8sivwbwKJV/ey1u7J8onI9jsp11HOTmrTbFRQ1JVNhrwOlpuxS/XICJWaCIqOeLlcdvb2uCu/nKwxHfSPOAY01pVKhODbU5ESizY2SI7YoVDtEoimWUneWhArTaq8RArHpWtCCmm9UFcYa15i4E0eRUhNwrfE4x8R0vF6A3/H+BBwTC6E986A98/EaXr8zVU18rUnuG/2VT24CqeaIX503rxYPmKpUdPJJTSD9g+bHdaa8JkQ0msC1u2r8LlcIBk9NUQNjs/s7jCUhPodGB2VirP4CgEnGQE/AoI/noyj0/SaZjEl4fxJPWkmoIJaET09T/ZFLPr8AcMaEhTrS2GYYk41Jj0qCaYQATMTf4zH+Udn4vUr/HVmnhSA6TxamiqxXamSZSnj5SDB3sKaxW21o7FIb8fP9ph61Hj834u8NTcfVB03d6r3dXvV2vUeVHw1o79Pya4iSdCyqoUd9sl2H/er8OSz50AR6EENwglCgx8S3fX43au+jhSDyH0gju5pAg0leuaaZnHW/fShDLXqr3BWCGev3qfAJaaFCsNrqqwFDQ8mUPgIwJk/dujBNvZxWq17MPtJfkFJCBDqlnx9C/YCoJg77fALzWqK9jMC5QnDrwu3q1qU71K3LtqgfLNmh/nNxkvrxku3qR0s3q1uXJOH1Her7Kzaob6/YrG65a5O6dflm9f2FKerb8zarx7fWBIXgnIQd6qL4reriqdvUeXE71QVxW9Ul0zer8+M3qgvi31dfnpaqhozapOa+WaQny9ZCwDcXsDVureNcWzUeDKgvz4YQTM0RQQgVgtS6FrXs/Wx1/4ZGddcHe9SS9Q3qoXXV6pH369RDa5vUcry2cFO9umvDLvXouw34+2AfIbh3fbW694Mqdc+6XWrJxl3q3vW16sG3i9W9Ww+qw736Yd7IOgBph8qLwuoYl6cmv1yrValWowaMMUJg244Dds4xselBJO71shalRu1E9CGCEfl23n7loqIaczhRlBCJNvvq/Jh0tRUh8AlSwh93tJ/AOY3ksfUJbsDwskeimRAhWL3X26Pq4OTVdntVk8ejmuEUHsBr+7xetRuOIh974BBWIZdQ4/OqRjiFe/BaI46KYx3qjZQ96s/JB5Vij1pNLNVqZQJUyQT+HaoqhtV6mgqPgX38XZKa9Eqem3Vy0L8A2Qau7BIp3d1M6sLZUDexO8UkhArBvVv2QA1txLn5etVQW5VaTbGKYrs1Dq9PYDWWgvfwM6b8kzqfn/QIyR34jQbza+Aq0DeM/FMuhGnETjWQVer4avWnlKOqX0jX1N9MqAn4/PhU9ULFMVV07Lh6Zm2lsn22o3HWhWglh7sw/JbFMAuj8h2/IxSUSkG1lXO94aiOczCCYSHX/oc4FqWHPIqFFl3YIQTjoLrHYuWOwTEOTsY4rKSxuLnYJhUWz/E6Jmd0sRr3WqlJYpg4UxApnbywBIHyq4ojpC6YDeGJ3oHJzOwrBNt34zxwWCZASCbWYLUW6lXLAshCwKHflFQ1MD5JnRkLnyKh+FOhl3F0gCohMWW2yQk4kKvzmdVZzRCCXBU2aU8oZNwfOeTJiER7exFYdD5VzybVq2ofqRvuxlj+Jlf9dNVBVdPmlfHyIhfiF4SvW9UjVLv5Hoz16BR1dnSJ6heS6nS0jgSGf8yzDJecgM1IooVQD4ikZCW98reYaDbdvm4cliSLOH/Ta7CR/L0BpeLhM0zGIpz4UqmKeblMRb9cpcY+X6PGv1Chot7ao/79vioVFgtnIhYTNrJITXqjwiQnHLDF1mCLaAKfDGjZMa+6gH0CXs2R+X2E4NWsSvX1uTvUd+flqH+fX6C+tTBHfXtJirplSbL6zuKd6tZF6eq6hRnqrPhMNRiec9i0ik+FXqaFQHvbrM289of5BK8WHIYQpH6UEApyOOaFGhUxHpptVIY6HaHrg9taMcBeNeahrZhcrC6EiGiSob63JE/taPC41yhp6VX/8QgWAMJGbO6lwqNzHE3gmoGAFwigX2cDP0IAZtg8wSbRxjmLgGQRA3JYBsbmTKwvAHQQZoUzmOj/pbrNfVQ0dqozxm3A/WOuNFzpMUkVv/GcA+pPW4DKjcONTq6VVTH19VIVmi20nbDFOIn8nUpg5hfMwaqYADUzvqQP5fyYtxMhZLtqamtX+1s7VENLl6qE2qw53qZ2tx9VLcfa1ZrydnXxNAaDGiXECfl+ZF17u6qVz7biO62qqu24qmw5rhrbOk2OntTTmUegYdjzdnyCGuNsuhnJFMvJyGHg1pYcUUu3VMNJKlePbKtxPzPmedZMqaFOXYr5fdiqxDL14o5i9UFZs1qW0qyumZOt7t54wGToetXDWw+pwVNh7qLWQ5ChZcfnqPPnJqtNJY0qpXyvumU+PPkxxWpAXI1oSxW1VS1ad8Cx9ZE+wO/o/K4CLAT+IOvZOVCKa3wxCiaO/Haf5JEceI3T9z1GY/Oi9ZoML99rd5dHrU5vwjO0KJNM8X/IZjy2BQM5ZhuEAOpuZIZKeKNEOYQJ7QwGBcJjVtMe7PVw8Ww8XHS+TMbXltaqg72hUUDfa9hO6tMcRYe96tLpGLiY/WI6ZqzZ/YnsmxZcUq/lwu+IwsBCxfLgB4WA06kBFy4VyBRq9Dd/xOfG7FBDx2BixrF54mvDn8HqHBCfryJwYIs8mCltugay2WQ7Cjt+/cPHVDuevbO9xXApgs+ypXi/+tJMFoBMFRHH/lWuCo+vVmdNhfYYlaWGsgoeA7M4rkbNhbPrQrmS0/AID4B9AJ+lx5h/dgknwXtCZlD/KOtE4xOc50AwrezSywz5QYgPTjoSbzyygZ0iDMgU/ByVo2LeKjGhYMBAmAFDjrBNCEOq4QD7BPVmNeapq5aVqOZeczELKtHbJipKS7AmPficDBd+piFEvXwGO4fQBGNS1by/lAQfVFScrdk5mFDbkEbY/nnN99dkN6gBk9J1dCBCUOtqAjmMStTP4VH/tQpabjQ+OwqTPL5OO8aAotXUBuQpSlX4FJjD+Bodg0ey84oVPgFCMTZf3XBvHVZauzuQHQFjWiwtbHWIWL63olJ8LOyOKgsjDMIVEVMoAnB2VKp6OumIMH30vVlGjVuSFMLea2LjeRW7gotJXJ3apiLfPKYSPjiq4j44rKYiikp4/7CasfaomrXmmJr27hGV8N5hlbAe779/TM34S4eav7ZZzVrXrKavaVML3ulUs9cdVHFr92F8u9TuYywEbFOMzdD0Jz1pD67nQWHbxgOVrya8XWYkXUteaI46ICvRVpWHbXXO7Lo+QrC3V79n+yF93nY31alNT9/Ucsb+HvXVGRnaeRydrOa9V/yxGiAgK6bXdXbWZzbAo8/4kBDYhhUk3AE7uDomPFutzhyXrS6NSleXxmaoC6ZmqbORnBoc34QVXAYIGs5hQqU6F4J1Cd47B6HveQgBz564Xf3msTxldR2R83vF1gZcYebX9reT+s3Tu0XDhEVVQ/0X4ZysRTar6+ZXq9cqunUaWGy4Rxw8GRcxtb1C+/LC4WaGUMA2KxzC/+N7YG5vz9IRVCS03gRGB7PF/KkxhdqpZ5BqQo528keVaod8XIaYITVCO7Hy2h2VKnO3X8lgsLT12s6E9MgF71pfoy9ghCASYEqgzwRYyklsOAhcfqulzlhQoSFKqM+rFter/b2GBcTxuYdUKwbsOPsRZuC84CFY1CKCkt4QUJdMwwNFaQGMfbPeTFgv6Gpe2Emcy8shnSZE8OrT4WmvfG5d+h4VPhEPGFPiCoFthMASCpbO/QunAPdQ0tSq1pc1qR1Ve1Q6soS5u3arP2UeVV9BZBIxKU0NwsSHwzw8uLZO5dc1IRu4S22talabKvervKajygeP22eECj2Z5Tkzaw6oKa+Wqosn5qmw8RkqfFqZHsMprGGK1B2v7FHH21rMc3kEd/BLbt/vcgkCzEuwuuTZWAiwG7077r94DFrl91mIXGBiGBmclK3NL2uwGLw3uVJ7/LIQCzUEwGhhTI5+jeHlqCJBMln75Tb2aiGQEMMmk1jplout3AAhGL9D+wR3ZqspH+UYBoIpUIaNz56Hm4hKEdj0ikV71NFuj0trWvbeIfX1+xANPFqh/uP+ferWh3er7z7SqP7toSb1n4/uUTffV6OGxmerCL4mPOfLFpapXz5Wp370SJX6xmN71DceOqC+/0ADvOt89b37y9R/P1ivMpuOmRw6qVcR2oXxwEQXy0qJeak6RNv4DePGEsaQ2NsQu+gcz+Y1GW3CoBcmL7JcvVViqdBUb19726Nq246opzOOqv98skWdC/uvRmDcEhDmxhfo8HFSlboRq39jSRBE8gkRxBBPYSr9GHs2DR4Hf3FMHwQfDbvE1LDQ/OxRTN6IbI2pRGbpFc+TyhMfzwJXCP8jX/wQjtBUJAQhMsc4oXiuqbivSfjc2Go1dMI6VbJ3v3YMWQg8xlliD1drgnqxyyoGtnBEjpryhhEC4wcITcsIgQMbNx6wdIg4Gb4EJPXKRU2qo8djCA5Qj6vYyXxH34zcYKZONnHSgw88DDasxgrETU+v1Q82NlMnQ9hpi8rVjhkL2dhsOXaUH3IH9vVc3HM0tFd0uajHKS/VhAiBV5s9gxP4Da3MpZmxVsJrv3o4W0wRtriHLd8t1/zZ43WqqM0Rmm6x29WHLfVCXo+a8XK5+u7cjRjQRNwPJmNiub7v2HR1OlLJl0EQBkWXARfYpxYjCnhic6UqaNhn/CTbXXg8D7120MkWAUB8z6EiC6yX9P2urzyuVqZ0qSczutQzqd3qj+nd6qkcv7r9nTatERjXwRjdtCRLPYH3/pjpUY+m96gn07vUUxnH1cO5rerRDL96FG0cX8zerw53dyhRpQEzANpJ1J72PR/sghBgQGIxGXfmqZg3S43k+40fYLm5A8dMNDVzdMArCBMxOUdduXiXOt7hMZKP/SGexE3+dqOWzAkQsPGb9TGWJzVXgCNsYK1Oj0/Vq5DV2WgI1GiW+gwVNhnRStwG+V2NZuFJVlnFe10heDevXIXF4LtR0GJjClTCC7XuPTOTRti24kzahluomch2QN9jFvIk57K6jOMM326cqwaAGVY1/IYrFpeo5PqDLkXu5UKPtr2/K9PZuukcReQJAheGCOVG0MueKTqupr3arIYwMsr5FLbFON7M3XcCD58+nD8B1IsteZXOJAaEKawR2w9Hcwu3QmBHGVOK8X1wY9NH+FKBD0VorjnoEXVjGWcFqvsDnGwSBh2oIYMfUyR3QNpx9NshXPrgiRtgDi6YixUNJ4vDtIuXHFTNXUEmy1NJjeq/H89VdzxXrkb9uUT94fkSdcfzsJMvFKixrwBcerxSXQS7edoEXvl16rqlxWrSqxlq0gslKuq5/eqOJ3epqNfTVfyzJWrCk7kq6qU0VbmvzY1oXshu1moQK481wdQXa90Ht4wjaotW8pv7Z1vcCe6+Hthlb+GZR8ORi0V4OIWjgxKEifDokUNgv2jwrAL1UuE+N9KIfpU1TrK2uVgwp8duVbc/manezNwv41rV26ZuWoyxGFcLFBTnQXZx0NzdavnmZvVOZrN6MWW/ejKrST2fuUc9lblXPZyzT72Stls9nFGvXq9t1pGXIYOyGSPkBNgfIgMG+Q3c3eHrUd96KEeTcaIA8mEMshqcsPW4oq4e5fdYBijySjTltXR9AlndSkIavoDfKWIw9vXuD7CaxiF+ngwpH5mrYl8vC6ows/qFaQvt4RVnEiqyBeZgHiZgcro4IZct3i9CYDDvGaFVu0zRPhJwM4Ur2B5uOWCry+diJUWzXU1XsWsOOIDR6qXpFrJhe5Dl1KuGP8/fdwsw8NrqHISWnOsQIchXsS/WuSGi7a4Ay80dkK6NkHsqa/Ooa3FtJpGEY9LDgVoOiC103w9j5HRitjp/zCZ177t7Ffb8lnv4yaM74e1vVEvfaFIpIJW2B+HnFT+8h/0pOHCxZaLhGAUNTyh3zrnurDEbQZRx4fWU08ZtUeeOeQ+O3zvqx/dnuZrB4RQwHYz8WgjYsbbNc6fublWnzUzRTuD4YvhYZarTXZzHXd+nV7RIt9Q5eI0pZ19Er2zLrOwQnODBDTjhWKjiKNjZEYUq5rUKFyCyjXr3SfzKeHWPXJBzBxfOZZuUKgN2xaLdfdgzobxDm3qd5EqKkwzJbu5Wl82H+o2DJhidpeat2e0KwVmwsdhvSP1wfrKqb+4xqow1GEc2WjDeymnS/oZkEfNVDITAbzsq1AoRAq9xvPowmCOxn4EawJoEdnXAlIo+GcDBkeAY4LWISJipP6So8S8VqU7Y6/qAV2Uf7zhROdsKdSc7yfsAPJWI0zYAzxUWnekKgZqKe53c6ApBRLQxRdBitz3YEMI51KEtw8MSZfHYBxxHntT899mBhUaKQS5gdJ5avrW6b7Koza82lh0EDU1XRvlJQ+c8Fj7NMTwxyvT4ZkYMmawAFXlngYp6o9zF2Z26AMvAk7rMCXg0tjC8aBZDphCCCRmhmLjU7skKDEh2bLiYnUBfIUhq8qgL58F+TsE5xlaqBW8fUa2dHnX5PRgsMHfVdAhYbIr6/pJidaDFY2w9Mnw+LRTvZbSIQ6p4MMfnIjroJwQmAhJnUO6ljxCUsI0/F5MkHvaUBtUnafRwgXZeGc3khfH7jeoPT5Sbyp72oJ0O0QThMBMD4hg9hVAhy3julJ3QLhw1VGkUcirMSFyJKwQDovF8M+okIvkv0NccbCPovwQXn6addaoOTOy3V+J8EGA1plKdAQEuOqqFcve+o2rm2lp1/vI0dVb0+yq5qjsEqeX77hAnF46HB2AHPFMkJLrgFHZbOodw/wZWqUiGxEAyR4Iy91ahlkhcmMENUTViV0w4w6QS7D1xETuG4pxlu1w/LXGWVt2OajOOZUhyKNJk5oQbyIK34PUaRxOsumHmDskJmL8jjYA1GQGTItC3M5uczNsq8167bpWjYWONMgaEci2rKDhhTgbvtvBJNeqsGemhZE9J3e4FAvirezBx43Y6wl0Smubm50FfbTXqjWrVjwjTZO5n2JZK5EfKuhztuGpLWatKq9jrCkEY0MjwWKzmcUUqpNhFcicCeLH6tpxaQo3PJFW1qkFjyjVOMDJf/XpVo+tcPrIGQvabHZp2Bp8m6rkDOqOJBdgJM8EUdzSDxHvw2Mc9nadGP1GsRjxZqu58Kl+NheN2y0qEa5M5OuCwDjjBmw5O0G0iCMtFuHzGhDQeCiBZggsKRy9Xhea9uZ6um/MMlkbILFMBE2IiVpsHb5dVOapEzXmr2h2gLeVHQNhI/KjPr+NrvJKzz1G1To3AqmC3Ee3MWQH2sj26YCREdZvJWnfJvEb1+5d2Oawjh7coVPXao3aodivpxyxacecz0EBjN4Vql9X9BPKckIKblH4MKrCtKxFZ7A59xhUhzzCDTD1jQDgR7OD51fS3oTVHlEoUhz2j1UuZx1xtnryrXQ2JY0Rxt0Dx7HRXNqIeFN/tYSCKE1VIfWt0b3yWjsWFUMLhG36fii9Or9M/RyK9jFSyDls09m8b34ClrtOELrtaetRZDBZxqBSb30cIxGxIxguAiXUMD9AtmsGpPcC+BSp1f4fLnFGjq1T827tUsBbfBiCz3/08ts5Vo9budz7Pe9KpF3MOYhBzJTIJqfANVvEENGvX75izvkLgZAyHhbCQV4QKQciEtYunHnytSQQXPlQEQjSHlXwBmFprClpD/aLbeBwcIbCDdQ9aE0zeG8ohWNGv90GKA9Zx5RKb06LObnX5AnaEOTdRoa5fnKn2d3T1Cf9GvpQpvpSEjgghZ79bY97TKLEQTQVqnKBRLRUF7zq6Vp+U7R5n0OIrxCcYs7pUqxknVemEiP6AKXj0q6pWjzprLidcYAejC5zBWNU/Nj0Bj1C6mxUcDFYkqREFavZbzX2EIPTza8uP9Clj4983ZpepEO1AfVk4OvsZMOXZknAq6AwVAmfiVxmBaHdo5875jflyNY/H06keeL/FJYsOBUN5aFSFc87IgqaG0EYXcp0eTWMzmsBSBwJupVbKkKg9H0dHS2GQK2BZblRwT+pBjbcwVAyfadZ7IQ6h+cwHFYcFuBKTgNzBpUvy1d42n+vbdXPdwfVzt6tvzN2kvjFnk7p+9k5105zt6ubZm9XN87arb85dq26ct00Ni9qs7lqbZ+LrXlGlXodjyB6r4SNUHfWp8ziLyIyhCfmOBMtgFh7qVZv3WSqp2VLpzbbK2Iej2c3zr0hvsdVjRcFqXGbE3vFCiztASc0BlXUo+PlkZL+yDtt9hCCkpnB1SC2hEQKfKcHSD9/c2qpumb0z6MkDsDKT2e74Ghxqhp7f1sUq4uesrvKp2x6qUYNGJrqvYQtdDHSKK/zvVvpU8SF/H03gDbSFaALsvvOX2qA50FSz24IcQ3L7DvRK3sNnFhxMsNenbrk/VzOXx5Wp8wDQpe/TobrMi6ChHpmnXz5cpZFZhKcKybIXknWK3rZMiFgGkkdte5uqw8G/V/PvbW3yc/cxEDhajqnCw23gBfDk9+DEHeKp9jg0aFEtOlddcySgU8lsWiLzQ+2ns8KGO/V81yakqaunu7T0FV+Zk6TOnVEUFILJu9TZ8XnuAF0yM0ldPj3D/fy1iIsvnZ7SXwiGhdQIntOnqNP2uZqAAaNdexvVsJiNrhCcPyPpQ5U/YdE1fYWgb98Ah8XsTPCqiImb1E+fd+sXmvoV4WifwH/UFYKXsw+pQePTg9HB+I2hBTFOwY6DsQxnuphtIrF1OUh3AzHlcWJNfTt8Ox1KovmFZbvkIP7snwp8SDhBY8yAZp9QqH5xT6Lq9vtdquBJrTuox8o8d069JnUgD3D90uL+6tll1+rcgUtBWyFpT609tBDEFAkR1V0lkcWSKnU/zx7x+Oo+k/RuQVUoj789dMLcVWVZUprNQvtO6QFXCOZvanb6GKyT642ELY2tV319goAKMRFN/ajk5/xpc4n4RyGvNYX8fls/QUoZmgA1HetyKVNGPp8Cx9nvLJ6UfnzG4V7jh/Vi9f4M6KoaWWNC1lL1bs3xPnOBTbpU8b5DanVujbp9dQFAKr5WlTzT6RN3qPXFLS6aelKFoLgloC6cn6cTSEjkXLGsUvm9WHVdFFpRPFyNzdBZMKah9TlMZgyMHDkindeyNfOHq2cYg4hK12TWmO3IrSerBasL5fob8hqQtHFX9LBY8CZtk4omu0diYu3L+MRRZR/ntbQmdcdjBareF2Tg/DkHNLURWTp5BkF9ItcMWK/lAlMdlvtMwyaDl1nREvR7Esv2qitmrlcsuPK8o3PUFbOL1c5GzcG4K7lZncs5kKgcNXT8XrnWt1dkgT5HBtkLQBhcSvww5g96DfFHfJnCA+occBo4URWGMfrfp2tVbY9X7dzTqu7NOq5+90Kd+u7KCnXZjFw1aFKKRHfav8NCi2PCb5ka+WiZPG/pkW71/wGyxfXsTihcMQAAAABJRU5ErkJggg=="

/***/ }),
/* 34 */
/*!*************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/liantong.png ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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eWNfG3vNH/b6h11H/jkL/d3KzrWy963KuT+2YPMX3Ft0798rBSTGEX6h93mfyxsTp9Mf+tkru05mS+n0BxYu/xyFNup4gi50vfmfi3vF5n/G2NcLnW9VX/9ENTb/wsnQd19sZETvrDo4KENDQzzG08yxn/cfgzDdda3upij0vcezWKvyGR9lrT+C1fp4GlvoC3v/fuyxx2THHXfkcdhhh0lbW9tKzU/+46yzzpLdd9+dx9NPPy0PPfSQ//vqHN/73vfk1VdfHXWN7e3tcuGFF8qll14ql1xyiVx22WX+v3H86U9/oobjcd999/FzXnzxxVFWZ/78+fL973+f14YNnP89uru7uaG9x7x58/hefM43vvEN/vzmN7/Jw7tO73nvNfz8xS9+wc/6iBv/owv2wx733nuvFGlZDMfWWs7q0ZsuraoVwJfz/vbmm2+W3/3ud/7vq3uUlJTI22+/7X92fX39St8/Wbvs/va3v/G9RxxxBJ/7zGc+I3PmzPE/4+c//7n//scff9x//uWXX5YddthB9tprL1m40AaWNDQ0fKTr3mqrrWTJkiUfsIr/UcFiR0IjH3nkEf7El3j33XflgQce4O9PPvmknHjiif5FbrbZZjJz5kx54okn+DoWA8ejjz7KRRwr9O985zv+395666387GuuuWaVj6uuuko23XRT/zNuueUW/7Ohsddee63cdNNNPPD+K6+8Ug4++GD//X/8o92XtampSWborTzxHLRq2bJl1N5iHbOL5772ta/J4sWL/UX/85//zI2B17785S9zM3R1dckf/vAHXhOOiy66SE455RS58cYb5brrrpPrr7+e1/PFL35xlGAPOeQQ6evr++QEiwd2Er7AJB0GMnXqVHn22WflBz/4wWrvylAoJNOmTeOieTscj/32289/Dxbgozyw6N5nQHj5ViEWi9EKYKE9rbjnnnv43kAgIHfddZf/Oeeffz6vc88995RwOEzXgvdtu+22Eo/HP2Btzj777FHCGfvAeT73uc/xc/F3OP8xxxzjb6Camhq5/PLLR232/7gp9k6AXZovIGgodj1MKBbg29/+Nk2Jt1Dl5eXy1a9+lc9/61vf4nu+8pWv0EwW0qp8wWK3v/DCC3LsscfKz372s1HHcccdx5/HH3+8/xNmcu7cufRT3mdAI/IfV199NZ/HxvzXv/41ynXgeqF577zz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"

/***/ }),
/* 35 */
/*!************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/dianxin.png ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 36 */
/*!*************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/chongzhi.png ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACRCAMAAAASL2FVAAAAM1BMVEX/PT3/SEj/VVX/YWH/bW3/eXn/hYX/kZH/np7/qqr/trb/wsL/zs7/2tr/5+f/8/P///+KS3PnAAAEqklEQVR42u2cWYKDIAxABVRAWbz/aadVsICAQe10I38WyzwpCdmcZnpDaSpUhapQFapCVag3ghKzBJc30Y9b2F2G4WKosblL18XG8DymlP2+FYdzvu77i6H6eVrO02PrOkSg2Hw9jr8Ahc0PwKw4Y4P/40SgWgMldkUVQMkmFGdQzR9gnITSDVxaKaFQNAdllrFRjqbdRflaApbhg6FGlIXq05O541BBCgBFaeSbN+OzLklntgPzRSU35I5QAFTbmntdNbF6npF5oyvOl2Xu9lVvGMjydHAoov2PYVDrXRJijvQXQBESzloGxWCWuy2Awkzr6QQUpdPFUFLqvVVflh1Hhu5QRIDPODDUMLCtBPcQ13x6ztYwqIm3WeHqS6CsnUpa9PUcitt0TXZtuHwK1JgyxRCNcHbjpVDLTidT2hfLi3VYzkIJb48tZ0n07IMcdzbw+Gwod25WajztF3HCQVfdC6HalLlkFapCpSZnQbDnf/FqKHP2+X54JM2Ron4KFMSir+7LnAKRWztVoTbuy8NngP189LlQy/Tjbc2QN/XinSR8qYvPvkQWpJNkWTI+FZx9xksIHue0SVh9lOVoRkgXQGGzLfvmN6DcRIaTdQVAjY/U2j3/dhWUpBQn0jnZjX6XXk4elLgC6pbE8F1eP5rOm4Qg5itImqWhlOIkeRQfgWJs+kKoDZAxUVgfgaJ+XHoISpGAqBu01nibNspEX6drM6G2ihDI/RRvTMLwY1CNtS0OFOFKRbxkHKg6bktElkA5wej8l/hma/bhmc2bAyJgUDiEwphGE5l970PtZ12OQ4k91yUsBkxnqD4ZahIECjVpjnHjXvIWPQeqUNRLC9v/IRWqQlWoClWhKlSFqlAV6pehtA47J484zXPKXVwGZQofwE6I0W+S82Mk9iIoajpFpR+ek3hILz8SSsp4DxZfkgQ81aOlI1E/5+JI2AesOJROLG1l4Z2gqE0PvRMUtjm3CpWdeBydcscldspon+n2BHQlb7XPPBdyLLmpTPdOafqmmrrQeOJUMQdg0cJKkE42ybZCfDiUaQFAh45f4u8ynU/tgQtGGqGSds0gM+tvfU0IoPoHgGJhuTMlcttc2Qf6uJvCxjAotSl3JqUNuvZdgyKcOxCioSKPY+c3w30gVJ/seE1oWhsqngOVe0DidSlkoVRyAyaXyj5sEopFpYVD0dAe7/u99o2VJBSkbTALRaDFzQcUQg5Ub95I+H4oe0owiGCvUCLmbkqvDe0iqEO+izGms5Y9A+pAGdEP8LZQJBGMfDjUVF6w89+b20K1OdMLg9I9KqrXhW81bKESDTkFFn0x60IYsujCmw4O//3RNNT5je6dNm185XNjPwfFMy+OvgyqSzg7L4VCOV+hEOoCk+C4312F2oVifqPrOaiLjKc5a+Q1UBdtdJUPHl4DRfO5hAoVpL3EG0HZBEc6ePDChX8xCQNqdhZqwjhjMX4E6tFDnXtz17YHttv/AuBASWnTnznjSchuS+WaN+kBlZp4dniFEgLoUAsg1F66s/93KIx3cy66q1C3fmVQbmPwUqxPhVJFzZEyVnFQ6mS5ubYAVKgKVaEq1AH5A+NT1ekQktDeAAAAAElFTkSuQmCC"

/***/ }),
/* 37 */
/*!**************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/flowboxbj.png ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArEAAADWCAMAAADxairUAAAA/FBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAADb29sAAAC/v78AAACZmZnR0dFmZmaAgID5+fnz8/P09PTp6enc3Nz////9/f39/f36+vr4+Pj////9/f38/Pz4+Pj9/f34+Pj////+/v7+/v78/Pz9/f3////////+/v7////////////////////////////q8P3r8P3r8f3s8f3s8v3t8v3u8v3u8/3v8/3v9P3w9P3w9P7w9f7x9f7y9f7y9v7z9v7z9/709/70+P71+P72+P72+f73+f73+v74+v75+v75+/76+/76+//6/P/7/P/8/f/9/f/9/v/+/v/+//////8aOG63AAAALnRSTlMBAgMEBQYHBwgICQoLDxIrLC0vM46PkJOUlJWWmZmcu7y+v9bW19nz9Pj5+vz9cRm/0QAADadJREFUeNrtnYl248YRReXYSZTJHmdx9sVxEieejAUQBEGKi0lqIJAESIr//y8BRY2GS6P3xjhH932ABufwnjevq6urrq6ufvrLL77cIXSqRZ7nb+/2ms/ns9ls+qhvJo8a1xqNRsNH3Q6e1e9ntSYBPufLv//qZx99dFXr+799za+DLrTJFcSO3hF7e0Ts4JHYrAzySa//+KOPamj/zI+DBFpJiZ2Iie0fPDaIye711x/UxPLbIIG2+aN0UsHtSSo4IFsF+qzfQSwSq8xz3Rx7e5Fjs2wa6LO++jnEIqHF3ufaOXYoIDbbBPqwX38HYlGjxUpTwUiWCrJ5oA/7AmKRQA9FnmufvEQe2+sHMtl/fwyx6FJVYZ0K3iF7F+jTIBYJVBTWqeApx/YGW4hF7VmsiceKiU3zMN/2CcSiCy0KVY5VVbdqYgcQi1rSuihcT15Zr5cWQT7uuxCLzrUqdDxWlQrSIcSiVrSpgXWvFaRpuoJY1IbKQisVHOXYW2EqSEchvu57EItOtS30PFZx8tqbbAmxqCWL9VDdqjWBWNSSxXqobu0VoOnwGmLRiSotYicqYg/ITiEWBdbD4pjY3Lrb8OCxvQ3EosAWu/CUCg7IziAWhdXqidj73Oad17nHptkWYlFIrRfaHisltvfksan3psNXEIuOVC70cqziLe1zKkj7DxCLAlrs0s1j3xObpU/KIRYFtNhnYu9dO7qfgO0OIBYF02Zl47FDgcc+59jUd9MhxKJji106n7z6px7rvekQYtGztqtzj82dawV1LlhALAqj6ohYL50we17T7ghiURiLLVerpad67FEq6HZLiEVBLLb0lwqOiE27E4hFQSy2vEgFDp0wxyZbQSwKYbGlXY5VENvtdqcQi7zrodQidmrWu/WE7BpikW+tT4n1efLqJjOIRb5VlrY5VniDkB0RmyTpFmKRX23K0jDHjuW9W+kJsnOIRR6rBNvNPhMEIzapTXYyy1cbiEWux60a1mqv0g+xDbWC5KA0G07zZbWBWGTF6nazWa+rI2ANcuzE7OR1onQwmearNcQiE1r3vNbAPhF76bG5J2K7hxx7pk6nk9SGe7coNxCLFLgeeH0kVuKxueukuF6jxz4SGz+pOxhP3y7XEIt0iF27EDvWv/OSEHvQPincFVqGC7F4rA2xE/1agYDYTnxG7EFR0h/VSaGCWBTCYxUd3QpiRchGB8XJYDJvNFyIxWOPiF0adBuOZTn2hNhEmQpOiL2JbvbqZMM6KVQQC7FaqcC1HpulMmTjWEJsdCD25ubrWnEnG58YLsSSCiSpIPfwMlHn5HUK7DGxB72J0n1SWEMsxMrrsaa7Zvp69diOgtjoDNga2Tf/rXWTjAuIhdgQJy95daupVnDqsZfE7gWx5Fi/Nwgu1a2TTHBzAizEQqwrsWPtvoLLWkFslwogllSwPo2xHuYVCAqyiWmOFZksxEJsmByr01fQ0anH4rGo1VTQk6QCY499DyzE4rHtdXTrnrxEHguxEHvssQGINT95xbIcC7EvF1iTG4TcnNi+8GWiDbHkWGSQYx1ff/csbmnPUwEeiwxybNgbhI5xKsBjIVZe3bq36ivQrBUksbxYgMciRY71+GpGsx5rRuybryEWjw17g5DJPVYWCsixKOzJ67TbsG/zMvGsE4a+AiROBRuXHOtyg8DJC7l5rM0NwlEquJW/TEyobqHgqSB32/0tJ9b45AWxEKvyWJ/9scapIIJYJK8VVJ5OXvovEzuyVBA1x1iIxWPDTDF6h2xXSGwsaiyg2xCpagV+bmlvRWOMVDnWrFYAsSArJnYZYHNH6qW6BbGkArs7r6nx3K3UtqObeiwyINbgBkF850VHNwqYY0uXGwTzWkEn5s4L2RC7cXmD4H3uFndeSLu65UTsUGOflwmxvJpBSo/9VswroNsQBa3HjuW1Anm3YUwqQK3WClTvvHoeZsJw8kIe6rFepnFS3UKOxDr2x0qJTT3M6IZYiG1vfmyq39EdNzYbQizE+nyDYOqxqloB/bFIUd3yVY/V7OiWTzyGWHRK7EPQXTP2HsstLXLw2Hvbd16B+mMhlhwborrVF0yKM5gqHzelAk5eEBv8llbx+rujrhUIPTaFWIi1ybETtxsE0z0Iz8QmW4h9yTl2HWwmjNv82MZUkGzZ8snJK1CtwLyjW33nFa/ZS8vJK9DrbxWxHSOPPRBbOyzEvmCTvewrWAW680rsZsKc75qJqx3EQmyw3i37HNvwBmEfCSCWVHBK7NLVYwdOm5Rl9dio3EEstQIvHd2+J8XdiOqxUbWDWIjduBA7tp8JI381I4gFb25WO4glFQTdpKzo3eoY3SDclDuIhdjWiNXcjiSpxxY7iIXYQH0FmbfX3++BXewgFmL9eezQfJOy2cmr2EEsxAZ7NdP31tEtBBZi8Vift7R9nzcIT8jmO4iF2IAd3fbERsJb2jNgIZZ6rPMUo2HIW9q7HcSCrB9ivfcViGoFF8BC7Iv2WElfgU9iLWd018DOdxALsoFnwrxD1r2vQAgsxHLy8rkHwe80zukOYpGn/tiJW47VSgVCYCGWVCDz2DzMPi+tOy8xsBALsWFyrMUGutO5W5MdxCIlsct2UkFHPT+2CViI5eQVZKp8ZjXF6H0qGO8gFhkR6+ixPYdXM7VGO4hFNicvU2L72hvoOrJJccMdxCIpsVW7Wz4VnTAyYCEWYp1TgYjYnsOrmcEDxCJFjq18v6VVrJqR3SDIgYVYPPZ4itHSPce6dhv2tzuIRXq1gpVz71Zf+wahKciqgIXYF0hsO30FPYtaQRRlKmAh9kUTe1ErWPqb0W31lra32UEsEgMbpB47EG7u0L5BSNXAQiwnL8/VLUEq0PXYtNpBLDI4ebkT29frNhSfvLo6wEIsxAbaS2vcV5BoAQuxEBtm7lZmOndLE1iIhdhji119sLe0SbmDWOR88jpUt+5sTl7veNU7eWkDC7EQ6zxhY+jhnddqB7GoreqW+1tafYeF2JdI7MO3YA/CKbHzHcQiR4+9N6nH3hoSe14rmEIs+mCpQKt36ywV3EIs+sDVrd5xrUCZYzOIRVo5dh3MY+Vzt849NllDLPKSCnLnicddMbHWxS2IJRXI+gryluqxOcSisCcvo+1I6r6CGcQiVYwNvUm5J7XYM2JHEIscPdZuwkZfMPFY5w1C9gCxqDViLfpjz3u3OhuIRW6pIPc08bir1x9bQixyqxWEnlcQ2xYLIJZUILzzuvc2jTPV6Y+dQixqrbrl453XEGKRRo4NcfKym8bZh1j0f+WxyRZikQdi8zAd3YK3tLzzQqGJlU/jzMxOXnEBscgpx7a9uWMOsUiBrHzisWM9tme6SXkCsUidCkLMhLHc3DGAWPRhagV9jYnHgj0I2sUCiMVjJVs+8/YmxVUQi1pKBUPhyct0UlwBsUg/FVS+bxDkxIr2ec0hFpnWCsyIdZkJIyB2DLHI/eSV275BML7z0i4WQCzESjzW4vW3zbyCxyUIW4hFDievoL1bwqnyzOhG7qnAoVZgvK2+gFjk7LG5/SblnqQTRrhr5g5iUTseazHxWJQKvoFY5HzyClSPFW6rH0IsCuexE0WtQLlJObYtFkDsiwPWi8dOfL9BqLWGWCRDNmi3oeEUo0ctIBbpeqxTrWAo3/2tMaPbpFgAseRYS2KFHntRkO3q7/6eQCxSELv+cDcIAmIHEItaIdZTPTbuQSyyP3ndu+5BUNx5CYjV298BseRYyR4Ei1Sg9c5LSKze/g6IhVjXGwTlBjrNk1eUQywyqm6tgmxSTnVzrN5ITojl5GXUHzs13Oelt7nj4LEjiEXyk1crvVvivbQiZLX2d0AsOdad2FvzzR0CYqN4A7Eo3MnLYQNdQ46NSohFLXiseV9BQ3VLq1gAsZy8XOcVDD11G8bRFGKRrcfeu1a3ehapYAixqLFU4NxXMNZ+/Z3oemwGsShcjh077f4WFmSTDcQiJ4/N260V6OzvgFg8NswtrUUnTBQVEItkHhty97cVsXOIRVoeWwXb/W2UY3VGckIsxHr02L7DpLjaYnUezkAsJ68Qd1529Vid/R0Qi8fapIKaWZcbhLjBZKMKYpGdx8pTQb7dvh2LZ3Rbbkc6AKtRLIBYPFZY3ZK9TLx7dMLqTi8VGPQVxBrFAoh9ycRa5di75/+5q6lerSDR7OiuPXYMsUiSCiwmxc1PrqXKqcdOmH0q6EMs8lndmp1foz4U47MpRjoe21QriKLuFmKRQ3XrNMfOVgKetsXQuHersboVqfd3QCzEaubYWdHgf5t8KDt4CU9ecWxbLIBYiNUjtpB0AlZzw76CxupWdAexyEcqKBSdq9VUMndLv68giiYQizRqBQqPzTW2w5WTRo9N9GsF0QBikVWt4IjYXHOb4WLsgVhVseCfEAuxcmLzUv9v3w8vbhC6BpPiHqUYyfk5xEKs7AYhLx9M/vg2H2i+muk0EbuU/wufQexLJlZ58lptTf/8Zq43xaipuqWYsvHVp9cQC7FNxJrzeigbKOuxzXdeqoczf3h1ffUXfkRSgWhG93Jj+0+UE8XJqyPJsTPZX/7bj2tif/j71/yMnLzOibXnda/VKEst6rEKj339p5+8ur6++viTX/zmH//hl4TYI2IXles/U9wa98dG0hz7r88/+/RVDez1/wCk44VQ6a+04AAAAABJRU5ErkJggg=="

/***/ }),
/* 38 */
/*!*****************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/footerbanner.png ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/footerbanner.618a44e6.png";

/***/ }),
/* 39 */
/*!*******************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/inquire-footer.png ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/inquire-footer.fcb4497b.png";

/***/ }),
/* 40 */
/*!****************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/wechat-icon.png ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA4LTI3VDE0OjI0OjQzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wOC0yN1QxNDoyOToyNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wOC0yN1QxNDoyOToyNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3YTIwMTM0MC02ZDg2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"

/***/ }),
/* 41 */
/*!****************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/balace-icon.png ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA4LTI3VDE0OjI5OjQ1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wOC0yN1QxNDozNDowMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wOC0yN1QxNDozNDowMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMjgyZTMzNi1hYzhj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"

/***/ }),
/* 42 */
/*!****************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/sprite-time.png ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAYAAABXXxDfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA4LTA4VDEyOjEwOjI3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wOS0wOVQxNjowODozMiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wOS0wOVQxNjowODozMiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjNDA2NmI1ZS1jM2E4LTUzNGYtOGQ4Mi00MTdjNTgxMjFlY2IiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiNzhmMTBjZS1kNjcwLWJlNDYtYTBmOS1kMTRjNTIxNmE5OGEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ZjYzMWU5OC0zODY4LTNkNDYtYTVhOC0yNzhhMmIwYTI4MTMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhmNjMxZTk4LTM4NjgtM2Q0Ni1hNWE4LTI3OGEyYjBhMjgxMyIgc3RFdnQ6d2hlbj0iMjAxOS0wOC0wOFQxMjoxMDoyNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNDA2NmI1ZS1jM2E4LTUzNGYtOGQ4Mi00MTdjNTgxMjFlY2IiIHN0RXZ0OndoZW49IjIwMTktMDktMDlUMTY6MDg6MzIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4y8wPjAAAJFElEQVRo3uXb6VcTVx8HcP4Sz3n+Fm2r1qqgoFAQEURAwQq4UIhsIRuQBAgEBBQQI5tCVVQQCI9iqYdVqmwuVHysUklmz2QBpvcSwgnhTghkEsXnxff4JpL5ZObeucvvBkz+b+E/IDEgsf7IKQ0xGCTGuGAJZgmV43hEIf4ppoiYOF9NdSpamBpdL5vXN279xYfXELNiDgjwJxwmuoh4AfGH8uw5LLEnWIJzIVJ7fs7H6fhSckzSSOva+s0iH/0AOwL8CYeJLSGG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"

/***/ }),
/* 43 */
/*!**********************************************!*\
  !*** E:/work/app/cwtx/store/RechargeData.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _imagePath = _interopRequireDefault(__webpack_require__(/*! @/utils/image-path */ 22));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  namespaced: true,
  state: {
    bgTop: _imagePath.default.rachargeBg,
    payStatus: 0,
    wxIcon: _imagePath.default.wxIcon,
    balanceIcon: _imagePath.default.balanceIcon,
    amountList: [{
      id: 1,
      value: 30,
      extra: 0 },
    {
      id: 2,
      value: 50,
      extra: 0 },
    {
      id: 3,
      value: 100,
      extra: 5 },
    {
      id: 4,
      value: 200,
      extra: 10 }] },


  mutations: {},


  actions: {} };exports.default = _default;

/***/ }),
/* 44 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/store/SetMealList.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _ApiList = __webpack_require__(/*! @/utils/ApiList */ 45);
var _imagePath = _interopRequireDefault(__webpack_require__(/*! @/utils/image-path */ 22));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  namespaced: true,
  state: {
    clockIcon: _imagePath.default.clockIcon,
    productList: [] },

  mutations: {
    creatProductList: function creatProductList(state, list) {
      state.productList = list;
    } },

  actions: {
    updateProductListBy: function updateProductListBy(_ref, cardNumer) {var commit = _ref.commit,state = _ref.state;
      (0, _ApiList.getProductListByNumber)(cardNumer).then(function (res) {
        if (res.statusCode == 200) {
          commit('creatProductList', res.data.product_list);
        }
      });
    } } };exports.default = _default;

/***/ }),
/* 45 */
/*!*****************************************!*\
  !*** E:/work/app/cwtx/utils/ApiList.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getOpenIdBy = getOpenIdBy;exports.getOpenIdByCode = getOpenIdByCode;exports.getCheckCardByNumber = getCheckCardByNumber;exports.getProductListByNumber = getProductListByNumber;exports.getPayDataByWx = getPayDataByWx;exports.getRechargePayBy = getRechargePayBy;exports.setPayPassWord = setPayPassWord;exports.validPassWord = validPassWord;exports.postPayDataBy = postPayDataBy;exports.postAccountDataBy = postAccountDataBy;exports.postBindDataBy = postBindDataBy;exports.postUnbindDataBy = postUnbindDataBy;exports.getRemainBy = getRemainBy;exports.getCodeByPhone = getCodeByPhone;exports.getRecorderBy = getRecorderBy;exports.resetPayPassWord = resetPayPassWord;exports.getSiutStatus = getSiutStatus;exports.postCardToUnbind = postCardToUnbind;exports.getCardBindStatus = getCardBindStatus;exports.getQiniuToken = getQiniuToken;exports.postAuthInfo = postAuthInfo;exports.getDiacrisisResult = getDiacrisisResult;exports.getInviteDate = getInviteDate;exports.getExchangeDate = getExchangeDate;exports.getInvitePrePay = getInvitePrePay;var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request.js */ 46));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * api地址
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */

// export function getIndexData() {
//   return api({url:'api/api/index',method:'get'})
// }
//获取openid api
function getOpenIdBy(data) {
  return (0, _request.default)({ url: 'wx/access_token_openid', method: 'get', data: data });
}
//获取openid （静默授权）
function getOpenIdByCode(data) {
  return (0, _request.default)({ url: '/wx/get_open_id_by_code', method: 'get', data: data });
}
//查询卡号是否正确
function getCheckCardByNumber(number) {
  return (0, _request.default)({ url: 'wx/card_info', method: 'get', data: { card_no: number } });
}
//卡号可以购买的套餐列表
function getProductListByNumber(number) {
  return (0, _request.default)({ url: 'wx/product_list', method: 'get', data: { card_no: number } });
}
//支付 api--(APP直接支付用)
function getPayDataByWx(data) {
  return (0, _request.default)({ url: 'wx/product_pre_pay_app', method: 'get', data: data });
}
//支付 api--(充值余额用)
function getRechargePayBy(data) {
  return (0, _request.default)({ url: 'wx/balance_pre_pay_app', method: 'get', data: data });
}
//设置支付密码 (已绑定卡号)
function setPayPassWord(data) {
  return (0, _request.default)({ url: 'wx/set_pay_password', method: 'post', data: data });
}
//验证支付密码 (已绑定卡号)
function validPassWord(data) {
  return (0, _request.default)({ url: 'wx/valid__pay_password', method: 'get', data: data });
}
//余额支付 (已绑定卡号)
function postPayDataBy(data) {
  return (0, _request.default)({ url: 'wx/charge_with_balance', method: 'post', data: data });
}
//验证登录 (已绑定卡号)
function postAccountDataBy(data) {
  return (0, _request.default)({ url: 'wx/valid_login', method: 'post', data: data });
}
//绑定微信 (未绑定卡号)
function postBindDataBy(data) {
  return (0, _request.default)({ url: 'wx/bind_open_id', method: 'post', data: data });
}
//绑定微信 (未绑定卡号)
function postUnbindDataBy(data) {
  return (0, _request.default)({ url: 'wx/unbind_open_id', method: 'post', data: data });
}
//流量查询
function getRemainBy(data) {
  return (0, _request.default)({ url: 'wx/data_query?', method: 'get', data: data });
}
//发送验证码
function getCodeByPhone(data) {
  return (0, _request.default)({ url: 'wx/send_sms_code', method: 'post', data: data });
}
//订单记录
function getRecorderBy(data) {
  return (0, _request.default)({ url: 'wx/consume_orders', method: 'get', data: data });
}
//重置支付密码 (已绑定卡号)
function resetPayPassWord(data) {
  return (0, _request.default)({ url: 'wx/modify_pay_password', method: 'post', data: data });
}
//check 购买状态 (已购买基础套餐在有效期内无法再次购买)
function getSiutStatus(data) {
  return (0, _request.default)({ url: 'wx/check_basic_product', method: 'get', data: data });
}
//机卡解绑 
function postCardToUnbind(data) {
  return (0, _request.default)({ url: 'wx/unbind_device', method: 'post', data: data });
}
//机卡解绑状态 
function getCardBindStatus(data) {
  return (0, _request.default)({ url: 'wx/unbind_status', method: 'get', data: data });
}
//七牛 token
function getQiniuToken() {
  return (0, _request.default)({ url: 'wx/get_qiniu_token', method: 'get' });
}
//提交认证信息
function postAuthInfo(data) {
  return (0, _request.default)({ url: 'wx/identity_auth', method: 'post', data: data });
}
//智能诊断
function getDiacrisisResult(data) {
  return (0, _request.default)({ url: 'wx/intelligent_diagnosis', method: 'get', data: data });
}
//卡片邀请数据
function getInviteDate(number) {
  return (0, _request.default)({ url: 'wx/invite_detail', method: 'get', data: { card_no: number } });
}
//可兑换产品列表
function getExchangeDate(number) {
  return (0, _request.default)({ url: 'wx/exchange_products', method: 'get', data: { card_no: number } });
}
//兑换产品    (名称不一样)
function getInvitePrePay(data) {
  return (0, _request.default)({ url: 'wx/invite_pre_pay', method: 'get', data: data });
}

/***/ }),
/* 46 */
/*!*****************************************!*\
  !*** E:/work/app/cwtx/utils/request.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = api;var _url = _interopRequireDefault(__webpack_require__(/*! ./url.js */ 12));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}
function api(param) {
  var option = {
    method: 'get',
    header: {
      'content-type': 'application/x-www-form-urlencoded' } };


  Object.assign(option, param);
  switch (option.method) {
    case 'post':
      return PostRequest(option);
      break;
    case 'get':
      return getRequest(option);
      break;
    default:return postRequest(option.url, option.data);}

}
function postRequest(option) {
  return new Promise(function (resolve, reject) {
    uni.request({
      method: 'POST',
      url: _url.default + option.url,
      data: option.data,
      header: option.header }).
    then(function (data) {var _data = _slicedToArray(
      data, 2),error = _data[0],res = _data[1];
      if (res) {
        resolve(res);
      }
      if (error) {
        reject(error);
      }
    });
  });
}
function PostRequest(option) {
  return new Promise(function (resolve, reject) {
    uni.request({
      method: 'post',
      url: _url.default + option.url,
      data: option.data,
      header: option.header || { 'content-type': 'multipart/form-data' } }).
    then(function (data) {var _data2 = _slicedToArray(
      data, 2),error = _data2[0],res = _data2[1];
      if (res) {
        resolve(res);
      }
      if (error) {
        reject(error);
      }
    });
  });
}

// function uploadFileRequest (url, datas) {
//     return axios({
//       method: 'post',
//       url: `$baseUrl${url}`,
//       params: datas,
//       headers: {
//         'Content-Type': 'multipart/form-data; boundary=converge'
//       }
//     })
//   }

//function putRequest (url, params) {
//   return axios({
//     method: 'put',
//     url: `${url}`,
//     data: params,
//     transformRequest: [function (data) {
//       let ret = ''
//       for (let it in data) {
//         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//       }
//       return ret
//     }],
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   })
// }

//function deleteRequest (url) {
//   return axios({
//     method: 'delete',
//     url: `${url}`
//   })
// }

function getRequest(option) {
  if (option.data) {
    return new Promise(function (resolve, reject) {
      uni.request({
        method: 'GET',
        url: _url.default + option.url,
        data: option.data,
        headers: option.header }).
      then(function (data) {var _data3 = _slicedToArray(
        data, 2),error = _data3[0],res = _data3[1];
        if (res) {
          resolve(res);
        }
        if (error) {
          reject(error);
        }
      });
    });
  } else {
    return new Promise(function (resolve, reject) {
      uni.request({
        url: _url.default + option.url,
        method: 'GET',
        headers: option.header }).
      then(function (data) {var _data4 = _slicedToArray(
        data, 2),error = _data4[0],res = _data4[1];
        if (res) {
          resolve(res);
        }
        if (error) {
          reject(error);
        }
      });
    });
  }

}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 47 */
/*!*********************************************!*\
  !*** E:/work/app/cwtx/store/ConfirmData.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _imagePath = _interopRequireDefault(__webpack_require__(/*! @/utils/image-path */ 22));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  namespaced: true,
  state: {
    navaInfo: {
      navaTitle: '余额充值',
      haveJump: false,
      rightLink: '',
      linkText: '' },

    bgTop: _imagePath.default.rachargeBg,
    logoImage: _imagePath.default.yidongImage,
    confirmTopBg: _imagePath.default.confirmTopBg,
    confirmBottomBg: _imagePath.default.confirmBottomBg,
    amountList: [{
      id: 1,
      value: 30,
      extra: 0 },
    {
      id: 2,
      value: 50,
      extra: 0 },
    {
      id: 3,
      value: 100,
      extra: 5 },
    {
      id: 4,
      value: 200,
      extra: 10 }] },


  mutations: {},


  actions: {} };exports.default = _default;

/***/ }),
/* 48 */
/*!******************************************!*\
  !*** E:/work/app/cwtx/store/flowData.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _imagePath = _interopRequireDefault(__webpack_require__(/*! @/utils/image-path */ 22));
var _ApiList = __webpack_require__(/*! @/utils/ApiList */ 45);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  namespaced: true,
  state: {
    bgTop: _imagePath.default.rachargeBg,
    logoImage: _imagePath.default.yidongImage,
    flowTopBg: _imagePath.default.confirmTopBg,
    flowBottomImg: _imagePath.default.flowBottomImg,
    remainData: {
      end_time: "",
      remain: 0,
      status: "已停用",
      total: 0,
      used: 0 } },


  mutations: {
    syncRemainData: function syncRemainData(state, data) {
      state.remainData = data;
    } },

  actions: {
    updateRemainData: function updateRemainData(_ref, card_num) {var commit = _ref.commit,state = _ref.state;
      (0, _ApiList.getRemainBy)({ card_no: card_num }).then(function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          commit('syncRemainData', res.data);
        }
      });
    } } };exports.default = _default;

/***/ }),
/* 49 */
/*!**********************************************!*\
  !*** E:/work/app/cwtx/store/RecorderData.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _imagePath = _interopRequireDefault(__webpack_require__(/*! @/utils/image-path */ 22));
var _ApiList = __webpack_require__(/*! @/utils/ApiList */ 45);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  namespaced: true,
  state: {
    navaInfo: {
      navaTitle: '消费订单',
      haveJump: false,
      rightLink: '',
      linkText: '' },

    chongzhiImage: _imagePath.default.chongzhiImage,
    orderList: [
      // {
      //   order_no:'2100068501190609173823222',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '移动扬天卡10G流量包',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00,
      //   operator: '移动'
      // },{
      //   order_no:'2100068501190609173823223',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '移动扬天卡10G流量包',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00,
      //   operator: '联通'
      // }
    ],
    rechargeList: [
      // {
      //   order_no:'2100068501190609173823224',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '余额充值',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00
      // },{
      //   order_no:'2100068501190609173823225',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '余额充值',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00
      // }
    ],
    orderType: 1 },

  mutations: {
    syncOrderList: function syncOrderList(state, obj) {
      state.orderList = obj.product_orders;
      state.rechargeList = obj.balance_orders;
      // },
      // syncOrderType (state,val) {
      //   state.orderType = val
    } },

  actions: {
    asyncOrderLisBy: function asyncOrderLisBy(_ref, card_num) {var commit = _ref.commit,state = _ref.state;
      (0, _ApiList.getRecorderBy)({
        card_no: card_num }).
      then(function (res) {
        if (res.statusCode == 200) {
          commit('syncOrderList', res.data);
          uni.hideLoading();
        }
      }).catch(function (err) {
        uni.hideLoading();
      });
    } } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 50 */
/*!******************************************!*\
  !*** E:/work/app/cwtx/store/Activity.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _ApiList = __webpack_require__(/*! @/utils/ApiList */ 45);var _default =
{
  namespaced: true,
  state: {
    progressList: [{
      id: 1,
      name: '30G流量包',
      percent: 30 },
    {
      id: 2,
      name: '50G流量包',
      percent: 50 },
    {
      id: 3,
      name: '80G流量包',
      percent: 80 }],

    conlist: {
      invite_count: 0,
      remain_bonus: 0,
      total_bonus: 0 },

    customColors: [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 }] },


  mutations: {
    syncConlist: function syncConlist(state, data) {
      state.conlist = data;
    },
    syncProgressList: function syncProgressList(state, list) {
      state.progressList = list;
    } },

  actions: {
    asyncConlist: function asyncConlist(_ref, cardNo) {var commit = _ref.commit,state = _ref.state;
      (0, _ApiList.getInviteDate)(cardNo).then(function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          commit('syncConlist', res.data);
        }
      });
    },
    asyncProgressList: function asyncProgressList(_ref2, cardNo) {var commit = _ref2.commit,state = _ref2.state;
      (0, _ApiList.getExchangeDate)(cardNo).then(function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          commit('syncProgressList', res.data.product_list);
        }
      });
    } } };exports.default = _default;

/***/ }),
/* 51 */
/*!******************************************!*\
  !*** E:/work/app/cwtx/store/HomeData.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  namespaced: true,
  state: {
    navaInfo: {
      navaTitle: '申请实名认证',
      haveJump: false,
      rightLink: '',
      linkText: '' } },


  mutations: {},


  actions: {} };exports.default = _default;

/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */
/*!*******************************************************!*\
  !*** E:/work/app/cwtx/static/cwtx/publish-qrcode.jpg ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */
/*!****************************************************************!*\
  !*** E:/work/app/cwtx/js_sdk/zhouWei-request/requestConfig.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _request = _interopRequireDefault(__webpack_require__(/*! ./request */ 184));

var _url = _interopRequireDefault(__webpack_require__(/*! @/utils/url.js */ 12));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} //let baseUrl = "http://www.xxx.com/api/";
//可以new多个request来支持多个域名请求
var $http = new _request.default({
  //接口请求地址
  baseUrl: _url.default,
  //服务器本地上传文件地址
  fileUrl: _url.default,
  //设置请求头
  headers: {
    'content-type': 'application/json;charset=UTF-8' },

  //以下是默认值可不写
  //是否提示--默认提示
  isPrompt: true,
  //是否显示请求动画
  load: true,
  //是否使用处理数据模板
  isFactory: true,
  //列表接口是否有加载判断
  loadMore: true });

//当前接口请求数
var requestNum = 0;
//请求开始拦截器
$http.requestStart = function (options) {
  if (requestNum <= 0) {
    uni.showNavigationBarLoading();
    if (options.load) {
      //打开加载动画
      uni.showLoading({
        title: '加载中',
        mask: true });

    }
  }
  requestNum += 1;
  //请求前加入token
  options.headers['token'] = "1234568";
  console.log("请求开始前", options);
  return options;
};
//请求结束
$http.requestEnd = function (options, resolve) {
  //判断当前接口是否需要加载动画
  requestNum = requestNum - 1;
  if (requestNum <= 0) {
    uni.hideLoading();
    uni.hideNavigationBarLoading();
  }
  if (resolve.errMsg && (resolve.errMsg != "request:ok" || resolve.statusCode && resolve.statusCode != 200)) {
    uni.showToast({
      title: "网络错误，请检查一下网络",
      icon: "none" });

  }
};
//登录弹窗次数
var loginPopupNum = 0;
//所有接口数据处理（可在接口里设置不调用此方法）
$http.dataFactory = function (options, resolve) {
  console.log("接口返回结果", resolve);
  //设置回调默认值
  var callback = {
    //success数据是否请求成功状态
    success: false,
    //这里返回的数据就是调用请求方法收到的数据
    result: "" };

  //判断数据是否请求成功
  if (resolve.statusCode == '200') {
    callback.success = true;
    callback.result = resolve.data;
  } else if (resolve.data.code == "1000" || resolve.data.code == "1001") {
    //未登录或登录已失效
    if (loginPopupNum <= 0) {
      loginPopupNum++;
      uni.showModal({
        title: '温馨提示',
        content: '此时此刻需要您登录喔~',
        confirmText: "去登录",
        cancelText: "再逛会",
        success: function success(res) {
          loginPopupNum--;
          if (res.confirm) {
            uni.navigateTo({
              url: "'/pages/login" });

          }
        } });

    }
  } else {//其他错误提示
    //设置可以提示的时候
    if (options.isPrompt) {
      setTimeout(function () {
        //提示后台接口抛出的错误信息
        uni.showToast({
          title: resolve.data.info,
          icon: "none",
          duration: 3000 });

      }, 500);
    }
    callback.result = resolve.data;
  }
  return callback;
};var _default =
$http;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 184 */
/*!**********************************************************!*\
  !*** E:/work/app/cwtx/js_sdk/zhouWei-request/request.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var qiniuUploader = __webpack_require__(/*! ./qiniuUploader */ 185);var
request = /*#__PURE__*/function () {
  function request(options) {_classCallCheck(this, request);
    //请求公共地址
    this.baseUrl = options.baseUrl || "";
    //公共文件上传请求地址
    this.fileUrl = options.fileUrl || "";
    //默认请求头
    this.headers = options.headers || {};
    //默认配置
    //是否提示--默认提示
    this.isPrompt = options.isPrompt || true;
    //是否显示请求动画
    this.load = options.load || true;
    //是否使用处理数据模板
    this.isFactory = options.isFactory || true;
    //列表接口是否有加载判断
    this.loadMore = options.loadMore || true;
  }
  // 获取默认信息
  _createClass(request, [{ key: "getDefault", value: function getDefault(url, options, type) {
      //判断url是不是链接
      var urlType = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/.test(url);
      var httpUrl;
      if (type == "file") {
        httpUrl = urlType ? url : this.fileUrl + url;
      } else {
        httpUrl = urlType ? url : this.baseUrl + url;
      }
      var config = Object.assign({
        isPrompt: this.isPrompt,
        load: this.load,
        isFactory: this.isFactory,
        loadMore: this.loadMore },
      options);
      //请求地址
      config.httpUrl = httpUrl;
      //请求头
      config.headers = Object.assign(this.headers, options.headers);
      return config;
    }

    //post请求
  }, { key: "post", value: function post() {var _this2 = this;var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var requestInfo = this.getDefault(url, options, "data");
      requestInfo.data = data;
      return new Promise(function (resolve, reject) {
        _this2.getRequest("POST", requestInfo, function (state, response) {
          //是否用外部的数据处理方法
          if (state && requestInfo.isFactory && _this2.dataFactory) {
            //数据处理
            var factoryInfo = _this2.dataFactory(requestInfo, response);
            factoryInfo.success ? resolve(factoryInfo.result) : reject(factoryInfo.result);
          } else {
            state ? resolve(response) : reject(response);
          }
        });
      });
    }
    //get请求
  }, { key: "get", value: function get() {var _this3 = this;var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var requestInfo = this.getDefault(url, options, "data");
      requestInfo.data = data;
      return new Promise(function (resolve, reject) {
        _this3.getRequest("GET", requestInfo, function (state, response) {
          //是否用外部的数据处理方法
          if (state && requestInfo.isFactory && _this3.dataFactory) {
            //数据处理
            var factoryInfo = _this3.dataFactory(requestInfo, response);
            factoryInfo.success ? resolve(factoryInfo.result) : reject(factoryInfo.result);
          } else {
            state ? resolve(response) : reject(response);
          }
        });
      });
    }
    //put请求
  }, { key: "put", value: function put() {var _this4 = this;var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var requestInfo = this.getDefault(url, options, "data");
      requestInfo.data = data;
      return new Promise(function (resolve, reject) {
        _this4.getRequest("PUT", requestInfo, function (state, response) {
          //是否用外部的数据处理方法
          if (state && requestInfo.isFactory && _this4.dataFactory) {
            //数据处理
            var factoryInfo = _this4.dataFactory(requestInfo, response);
            factoryInfo.success ? resolve(factoryInfo.result) : reject(factoryInfo.result);
          } else {
            state ? resolve(response) : reject(response);
          }
        });
      });
    }
    //delete请求
  }, { key: "delete", value: function _delete() {var _this5 = this;var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var requestInfo = this.getDefault(url, options, "data");
      requestInfo.data = data;
      return new Promise(function (resolve, reject) {
        _this5.getRequest("DELETE", requestInfo, function (state, response) {
          //是否用外部的数据处理方法
          if (state && requestInfo.isFactory && _this5.dataFactory) {
            //数据处理
            var factoryInfo = _this5.dataFactory(requestInfo, response);
            factoryInfo.success ? resolve(factoryInfo.result) : reject(factoryInfo.result);
          } else {
            state ? resolve(response) : reject(response);
          }
        });
      });
    }

    //接口请求方法
  }, { key: "getRequest", value: function getRequest(ajaxType, options, callback) {var _this6 = this;
      //请求前回调
      if (this.requestStart) {
        options.method = ajaxType;
        var requestStart = this.requestStart(options);
        if (typeof requestStart == "object") {
          options.data = requestStart.data;
          options.headers = requestStart.headers;
          options.isPrompt = requestStart.isPrompt;
          options.load = requestStart.load;
          options.isFactory = requestStart.isFactory;
        } else {
          callback(false, "请求开始拦截器未通过");
          return;
        }
      }
      uni.request({
        url: options.httpUrl,
        data: options.data,
        method: ajaxType, //请求类型
        header: options.headers, //加入请求头
        success: function success(res) {
          //请求完成回调
          _this6.requestEnd && _this6.requestEnd(options, res);
          callback(true, res);
        },
        fail: function fail(err) {
          //请求完成回调
          _this6.requestEnd && _this6.requestEnd(options, err);
          callback(false, err);
        } });

    }
    //jsonp请求(只限于H5使用)
  }, { key: "jsonp", value: function jsonp() {var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var requestInfo = this.getDefault(url, options, "data");
      var dataStr = '';
      Object.keys(data).forEach(function (key) {
        dataStr += key + '=' + data[key] + '&';
      });
      //匹配最后一个&并去除
      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      }
      requestInfo.httpUrl = requestInfo.httpUrl + '?' + dataStr;
      var _this = this;
      return new Promise(function (resolve, reject) {
        var callbackName = "callback" + Math.ceil(Math.random() * 1000000);
        if (_this.requestStart) {
          requestInfo.data = data;
          var requestStart = _this.requestStart(requestInfo);
          if (typeof requestStart == "object") {
            requestInfo.data = requestStart.data;
            requestInfo.headers = requestStart.headers;
            requestInfo.isPrompt = requestStart.isPrompt;
            requestInfo.load = requestStart.load;
            requestInfo.isFactory = requestStart.isFactory;
          } else {
            reject("请求开始拦截器未通过");
            return;
          }
        }
        window[callbackName] = function (data) {
          resolve(data);
        };
        var script = document.createElement("script");
        script.src = requestInfo.httpUrl + "&callback=" + callbackName;
        document.head.appendChild(script);
        // 及时删除，防止加载过多的JS
        document.head.removeChild(script);
        //请求完成回调
        _this.requestEnd && _this.requestEnd(requestInfo, {});
      });
    }
    //七牛云上传图片
  }, { key: "qnImgUpload", value: function qnImgUpload() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var callback = arguments.length > 1 ? arguments[1] : undefined;
      var _this = this;
      return new Promise(function (resolve, reject) {
        uni.chooseImage({
          count: options.count || 9, //默认9
          sizeType: options.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: options.sourceType || ['album'], //从相册选择
          success: function success(res) {
            _this.qnFileUpload(res.tempFilePaths, callback).then(function (data) {
              resolve(data);
            }, function (err) {
              reject(err);
            });
          } });

      });
    }
    //七牛云上传文件命名
  }, { key: "randomChar", value: function randomChar(l) {var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
      var tmp = "";
      var time = new Date();
      for (var i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
      }
      return (
        "file/" +
        url +
        time.getTime() +
        tmp);

    }
    //七牛云文件上传（支持多张上传）
  }, { key: "qnFileUpload", value: function qnFileUpload(files, callback) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        if (typeof files == "object") {
          var len = files.length;
          var imageList = new Array();
          //该地址需要开发者自行配置（每个后台的接口风格都不一样）
          _this.get("wx/get_qiniu_token").then(function (data) {
            /*
                                                                *接口返回参数：
                                                                *visitPrefix:访问文件的域名
                                                                   *token:七牛云上传token
                                                                   *folderPath:上传的文件夹
                                                                   */
            uploadFile(0);
            var t = new Date();
            var _n_ = Date.parse(t);
            function uploadFile(i) {
              // 交给七牛上传
              // console.log( data.token)
              qiniuUploader.upload(files[i], function (res) {
                callback && callback(res.imageURL);
                imageList.push(res.imageURL);
                if (len - 1 > i) {
                  uploadFile(i + 1);
                } else {
                  resolve(imageList);
                }
              }, function (error) {
                console.log('error: ' + error);
                reject(error);
              }, {
                region: 'SCN', //地区
                domain: data.visitPrefix, // // bucket 域名，下载资源时用到。
                key: Date.parse(new Date()) + 'cardhold', //key
                uptoken: data.qiniu_token, // 由其他程序生成七牛 uptoken
                uptokenURL: null // 上传地址
              }, function (res) {
                // console.log('上传进度', res.progress)
                // console.log('已经上传的数据长度', res.totalBytesSent)
                // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
              });
            }
          });
        } else {
          console.error("files 必须是数组类型");
          reject("files 必须是数组类型");
        }
      });

    }
    //本地服务器图片上传
  }, { key: "urlImgUpload", value: function urlImgUpload() {var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var requestInfo = this.getDefault(url, options, "file");
      requestInfo.data = data;
      var _this = this;
      return new Promise(function (resolve, reject) {
        uni.chooseImage({
          count: data.count || 9, //默认9
          sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: data.sourceType || ['album', 'camera'], //从相册选择
          success: function success(res) {
            _this.urlFileUpload(requestInfo, res.tempFiles, function (state, response) {
              state ? resolve(response) : reject(response);
            });
          } });

      });
    }
    //本地服务器文件上传方法
  }, { key: "urlFileUpload", value: function urlFileUpload(options, files, callback) {
      var _this = this;
      //请求前回调
      if (this.requestStart) {
        options.method = "FILE";
        var requestStart = this.requestStart(options);
        if (typeof requestStart == "object") {
          if (typeof requestStart == "object") {
            options.data = requestStart.data;
            options.headers = requestStart.headers;
            options.isPrompt = requestStart.isPrompt;
            options.load = requestStart.load;
            options.isFactory = requestStart.isFactory;
          } else {
            callback(false, "请求开始拦截器未通过");
            return;
          }
        }
      }
      var len = files.length - 1;
      var fileList = new Array();
      fileUpload(0);
      function fileUpload(i) {
        var config = {
          url: options.httpUrl,
          filePath: files[i].path,
          header: options.headers, //加入请求头
          name: options.name || "file",
          success: function success(response) {
            response.data = JSON.parse(response.data);
            //请求完成回调
            _this.requestEnd && _this.requestEnd(options, response);
            //是否用外部的数据处理方法
            if (options.isFactory && _this.dataFactory) {
              //数据处理
              var factoryInfo = _this.dataFactory(options, response);
              if (factoryInfo.success) {
                fileList.push(factoryInfo.result);
                if (len <= i) {
                  callback(true, fileList);
                } else {
                  fileUpload(i + 1);
                }
              } else {
                callback(false, factoryInfo.result);
              }
            } else {
              fileList.push(response.data);
              if (len <= i) {
                callback(true, fileList);
              } else {
                fileUpload(i + 1);
              }
            }
          },
          fail: function fail(err) {
            //请求完成回调
            _this.requestEnd && _this.requestEnd(options, err);
            callback(false, err);
          } };

        if (options.data) {
          config.formData = options.data;
        }
        uni.uploadFile(config);
      }
    } }]);return request;}();exports.default = request;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 185 */
/*!****************************************************************!*\
  !*** E:/work/app/cwtx/js_sdk/zhouWei-request/qiniuUploader.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx) { // created by gpake
(function () {

  var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null,
    qiniuShouldUseQiniuFileName: false };


  module.exports = {
    init: init,
    upload: upload


    // 在整个程序生命周期中，只需要 init 一次即可
    // 如果需要变更参数，再调用 init 即可
  };function init(options) {
    config = {
      qiniuRegion: '',
      qiniuImageURLPrefix: '',
      qiniuUploadToken: '',
      qiniuUploadTokenURL: '',
      qiniuUploadTokenFunction: null,
      qiniuShouldUseQiniuFileName: false };

    updateConfigWithOptions(options);
  }

  function updateConfigWithOptions(options) {
    if (options.region) {
      config.qiniuRegion = options.region;
    } else {
      console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
      config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
      config.qiniuUploadTokenURL = options.uptokenURL;
    } else if (options.uptokenFunc) {
      config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
      config.qiniuImageURLPrefix = options.domain;
    }
    config.qiniuShouldUseQiniuFileName = options.shouldUseQiniuFileName;
  }

  function upload(filePath, success, fail, options, progress, cancelTask) {
    if (null == filePath) {
      console.error('qiniu uploader need filePath to upload');
      return;
    }
    if (options) {
      updateConfigWithOptions(options);
    }
    console.log(options);
    console.log(config);
    if (config.qiniuUploadToken) {
      doUpload(filePath, success, fail, options, progress, cancelTask);
    } else if (config.qiniuUploadTokenURL) {
      getQiniuToken(function () {
        doUpload(filePath, success, fail, options, progress, cancelTask);
      });
    } else if (config.qiniuUploadTokenFunction) {
      config.qiniuUploadToken = config.qiniuUploadTokenFunction();
      if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
        console.error('qiniu UploadTokenFunction result is null, please check the return value');
        return;
      }
      doUpload(filePath, success, fail, options, progress, cancelTask);
    } else {
      console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
      return;
    }
  }

  function doUpload(filePath, _success, _fail, options, progress, cancelTask) {
    if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
      console.error('qiniu UploadToken is null, please check the init config or networking');
      return;
    }
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
      fileName = options.key;
    }
    var formData = {
      'token': config.qiniuUploadToken };

    if (!config.qiniuShouldUseQiniuFileName) {
      formData['key'] = fileName;
    }
    var uploadTask = wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function success(res) {
        var dataString = res.data;
        if (res.data.hasOwnProperty('type') && res.data.type === 'Buffer') {
          dataString = String.fromCharCode.apply(null, res.data.data);
        }
        try {
          if (null == dataString || dataString == '') {
            if (_fail) {
              _fail(e);
            }
          } else {
            var dataObject = JSON.parse(dataString);
            //do something
            var imageUrl = config.qiniuImageURLPrefix + '/' + dataObject.key;
            dataObject.imageURL = imageUrl;
            if (_success) {
              _success(dataObject);
            }
          }
        } catch (e) {
          console.log('parse JSON failed, origin String is: ' + dataString);
          if (_fail) {
            _fail(e);
          }
        }
      },
      fail: function fail(error) {
        console.error(error);
        if (_fail) {
          _fail(error);
        }
      } });


    uploadTask.onProgressUpdate(function (res) {
      progress && progress(res);
    });

    cancelTask && cancelTask(function () {
      uploadTask.abort();
    });
  }

  function getQiniuToken(callback) {
    wx.request({
      url: config.qiniuUploadTokenURL,
      success: function success(res) {
        var token = res.data.uptoken;
        if (token && token.length > 0) {
          config.qiniuUploadToken = token;
          if (callback) {
            callback();
          }
        } else {
          console.error('qiniuUploader cannot get your token, please check the uptokenURL or server');
        }
      },
      fail: function fail(error) {
        console.error('qiniu UploadToken is null, please check the init config or networking: ' + error);
      } });

  }

  function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch (code) {
      case 'ECN':uploadURL = 'https://up.qbox.me';break;
      case 'NCN':uploadURL = 'https://up-z1.qbox.me';break;
      case 'SCN':uploadURL = 'https://up-z2.qbox.me';break;
      case 'NA':uploadURL = 'https://up-na0.qbox.me';break;
      case 'ASG':uploadURL = 'https://up-as0.qbox.me';break;
      default:console.error('please make the region is with one of [ECN, SCN, NCN, NA, ASG]');}

    return uploadURL;
  }

})();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-alipay/dist/index.js */ 1)["default"]))

/***/ }),
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */
/*!*********************************************************!*\
  !*** E:/work/app/cwtx/common/dc-clipboard/clipboard.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
               * 设置粘贴板数据
               * @param {String} text 要设置的字符串
               * 如果未设置参数，则清空数据
               */
function setClipboardText(text) {
  try {
    var os = plus.os.name;
    text = text || '';
    if ('iOS' == os) {
      // var UIPasteboard  = plus.ios.importClass('UIPasteboard');  
      // var pasteboard = UIPasteboard.generalPasteboard();  
      // pasteboard.setValueforPasteboardType(text, 'public.utf8-plain-text');
      var pasteboard = plus.ios.invoke('UIPasteboard', 'generalPasteboard');
      plus.ios.invoke(pasteboard, 'setValue:forPasteboardType:', text, 'public.utf8-plain-text');
    } else {
      var main = plus.android.runtimeMainActivity();
      // var Context = plus.android.importClass('android.content.Context');
      // var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
      var clip = main.getSystemService('clipboard');
      plus.android.invoke(clip, 'setText', text);
    }
  } catch (e) {
    console.error('error @setClipboardText!!');
  }
}

function getClipboardText() {
  try {
    var os = plus.os.name;
    if ('iOS' == os) {
      var pasteboard = plus.ios.invoke('UIPasteboard', 'generalPasteboard');
      return plus.ios.invoke(pasteboard, 'valueForPasteboardType:', 'public.utf8-plain-text');
    } else {
      var main = plus.android.runtimeMainActivity();
      var clip = main.getSystemService('clipboard');
      return plus.android.invoke(clip, 'getText');
    }
  } catch (e) {
    console.error('error @getClipboardText!!');
  }
}


module.exports = {
  setText: setClipboardText,
  getText: getClipboardText };

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-alipay/common/vendor.js.map
import config from '@/config';
import pkg from '@/../package.json';

const _MIDEA_COMMON = 'MideaCommon'; // 通用组件
const _MIDEA_USER = 'MideaUser'; // 用户信息相关
const _MIDEA_BARCODE = 'MideaBarcode'; // 二维码扫描相关
const _MIDEA_MAP = 'MideaMap'; // 地图定位相关
const _MIDEA_PDF = 'MideaPdf'; // 附近展示相关
const _MIDEA_ORG = 'Organization'; // 组织架构相关
const _Audio = 'Audio'; // 录音

let viewTimeOut = null;
let resumeFunc = null;

// 避免基座能力调用失败
window.moniterViewAppear = function () {};

export default {
  /**
   * 获取设备平台
   * @returns {number}
   */
  getPlatForm() {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    let flatform = 0;
    if (isAndroid) {
      flatform = 2;
    } else if (isiOS) {
      flatform = 1;
    }
    return flatform;
  },
  callApi(name, method, params) {
    /**
     * 调用cordova的方法
     * @param name {string} 方法组、类别
     * @param method {string} 方法名称
     * @param params {Array} 参数
     * @return {promise}
     */
    var promise = new Promise((resolve, reject) => {
      const cordova = window.cordova || window.Cordova;
      if (cordova) {
        try {
          cordova.exec(
            (msg) => {
              resolve(msg);
            },
            (msg) => {
              reject(msg);
            },
            name,
            method,
            params || []
          );
        } catch (e) {
          console.error('_error', 'widget error:', e);
          reject(e);
        }
      } else {
        console.log('_debug', 'Cordova is not exist');
        reject('Cordova is not exist');
      }
    });

    return promise;
  },
  /**
   * 验证密码，主要用于hr自助认证
   * @return {promise}
   */
  password() {
    return this.callApi(_MIDEA_COMMON, 'authPassword').then((message) => {
      if (message === 0) {
        this.password();
      } else if (message === -1) {
        this.exit();
      }
    });
  },
  /**
   * 显示菜单
   * @return {*|promise}
   */
  showMenu: function () {
    return this.callApi(_MIDEA_COMMON, 'showMenu', null);
  },
  /**
   * 显示导航
   * @return {*|promise}
   */
  showNav: function () {
    return this.callApi(_MIDEA_COMMON, 'showNav', null);
  },
  /**
   * 隐藏导航
   * @return {*|promise}
   */
  hideNav: function () {
    return this.callApi(_MIDEA_COMMON, 'hideNav', null);
  },
  /**
   * 退出应用
   * @return {*|promise}
   */
  exit: function () {
    return this.callApi(_MIDEA_COMMON, 'exit', null);
  },
  /**
   * 后退
   * @return {*|promise}
   */
  goBack: function () {
    return this.callApi(_MIDEA_COMMON, 'goBack', null);
  },
  /**
   * 开始监听手机摇动
   * @return {*|promise}
   */
  shake: function () {
    return this.callApi(_MIDEA_COMMON, 'shake', null);
  },
  /**
   * 停止监听手机摇动
   * @return {*|promise}
   */
  shakeStop: function () {
    return this.callApi(_MIDEA_COMMON, 'shakeStop', null);
  },
  /**
   * 显示悬浮菜单
   * @return {*|promise}
   */
  showFloat: function () {
    return this.callApi(_MIDEA_COMMON, 'showFloat', null);
  },
  /**
   * 隐藏悬浮菜单
   * @return {*|promise}
   */
  hideFloat: function () {
    return this.callApi(_MIDEA_COMMON, 'hideFloat', null);
  },
  /**
   * 获取当前语言
   * @return {*|promise}
   */
  language: function () {
    if (config.env === 'local') {
      return new Promise((resolve, reject) => {
        resolve({
          language: config.language,
        });
      });
    } else {
      return this.callApi(_MIDEA_COMMON, 'language', []);
    }
    // return this.callApi(_MIDEA_COMMON, 'language', null)
  },
  /**
   * 获取用户信息
   * @return {*|promise}
   */
  getUser: function () {
    // return this.callApi(_MIDEA_USER, 'getUser', null)
    if (config.env === 'local') {
      return Promise.resolve(config.testUser);
    } else {
      return this.callApi(_MIDEA_USER, 'getUser', []);
    }
  },
  /**
   * 启动扫码
   * @return {*|promise}
   */
  scan: function () {
    return this.callApi(_MIDEA_BARCODE, 'scan', null);
  },
  /**
   * 启动扫码
   * @return {*|promise}
   */
  scanNow: function () {
    return this.callApi(_MIDEA_BARCODE, 'scanNow', null);
  },
  /**
   * 获取扫码结果
   * @return {*|promise}
   */
  getScanExtra: function () {
    return this.callApi(_MIDEA_BARCODE, 'getScanExtra', null);
  },
  /**
   * 获取位置信息
   * @param arr {array} 参数
   * @return {*|promise}
   */
  location: function (arr) {
    return this.callApi(_MIDEA_MAP, 'location', arr);
  },
  /**
   * 开始更新位置信息
   * @param arr {array} 参数
   * @return {*|promise}
   */
  startUpdatingLocation: function (arr) {
    return this.callApi(_MIDEA_MAP, 'startUpdatingLocation', arr);
  },
  /**
   * 停止更新位置信息
   * @return {*|promise}
   */
  stopUpdatingLocation: function () {
    return this.callApi(_MIDEA_MAP, 'stopUpdatingLocation', null);
  },
  /**
   * 导航
   * @param arr {array} 参数
   * @return {*|promise}
   */
  navigation: function (arr) {
    return this.callApi(_MIDEA_MAP, 'navTo', arr);
  },
  /**
   * 拍照或选择图片
   * @param params {object} 参数
   * @return {*}
   */
  getPicture: function (params) {
    const imgPackageHeader = 'data:image/jpeg;base64,';
    const base64Code =
      'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDUtMDhUMDk6MzY6MTUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA3LTA5VDE1OjU4OjU5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA3LTA5VDE1OjU4OjU5KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhmYTI0OGY5LTA2YzMtNDZlOC1hNzdlLTFlYjk0ZWJhYWY4NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2NjI3YmMwZi00YjY4LTRlNDUtYmE0ZS1kYzFiNTM3YTNlNjYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NjI3YmMwZi00YjY4LTRlNDUtYmE0ZS1kYzFiNTM3YTNlNjYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY2MjdiYzBmLTRiNjgtNGU0NS1iYTRlLWRjMWI1MzdhM2U2NiIgc3RFdnQ6d2hlbj0iMjAxOS0wNS0wOFQwOTozNjoxNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhmYTI0OGY5LTA2YzMtNDZlOC1hNzdlLTFlYjk0ZWJhYWY4NSIgc3RFdnQ6d2hlbj0iMjAxOS0wNy0wOVQxNTo1ODo1OSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2fNMqQAAIfVJREFUeJztnXuQJVd93z+/X/e9d147M/uSVtIiyVg2sVAgAkP8kGyMMTjGpkSVHVN+xZSNgxOoPIsgqlKVhKqUnVT5j+ACbOxgG8ouUhgoyykgTlnCwkCQiAQoEmAJIWl3te/dmdl53Xv7/PLHOaf7dN87M7uzM6u5U3O2Zm93n9Pn9Xt9z+88WsyMYeF9H4a//iKMz8KNR+DFL4LlAk6twnd64M6Ay0EyaClcEjAF2lzf7/NqB3eacocTburDjSj7nNA2ASdgAk7Db7iP183n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';
    if (config.env === 'local') {
      // 本地调试
      return Promise.resolve({
        base64Code,
        base64Url: imgPackageHeader + base64Code,
      });
    } else {
      // 测试或者生产环境
      let opt = {
        quality: params.quality || 75,
        destinationType: params.destinationType || 0,
        allowEdit: params.allowEdit || false,
        encodingType: params.encodingType || 0,
        targetWidth: params.targetWidth || 375,
        targetHeight: params.targetHeight || 667,
        saveToPhotoAlbum: params.saveToPhotoAlbum || false,
        sourceType: params.sourceType || 0,
        mediaType: params.mediaType || 0,
        correctOrientation: params.correctOrientation || true,
        cameraDirection: params.cameraDirection || 0,
      };
      return new Promise((resolve, reject) => {
        try {
          navigator.camera.getPicture(
            (data) => {
              resolve({
                base64Code: data,
                base64Url: imgPackageHeader + data,
              });
            },
            (data) => {
              reject(data);
            },
            opt
          );
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    }
  },
  /**
   * 获取通讯录
   * @param fields {string} 查找内容
   * @param options {array} 参数
   * @return {*}
   */
  getContact: function (fields, options) {
    var promise = new Promise((resolve, reject) => {
      try {
        navigator.service.contacts.find(
          fields,
          function (msg) {
            resolve(msg);
          },
          function (msg) {
            reject(msg);
          },
          options
        );
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

    return promise;
  },
  /**
   * 组织架构单选
   * @return {*|promise}
   */
  orgChoose: function () {
    return this.callApi(_MIDEA_USER, 'orgChoose', null);
  },
  /**
   * 组织架构多选
   * @param p {array} 参数
   * @return {*|promise}
   */
  orgMuChoose: function (p) {
    return this.callApi(_MIDEA_USER, 'orgMuChoose', p);
  },
  /**
   * 根据组织id获取组织内容
   * @param p {array} 参数
   * {
      "withChild": true,
      "withUser": true,
      "departId": orgId
    }
   * @return {*|promise}
   */
  fetchDepart: function (p) {
    return this.callApi(_MIDEA_ORG, 'fetchDepart', p);
  },
  /**
   * 改变状态栏颜色-仅IOS
   * @param p {array} 参数 [r, g, b]
   * @return {*|promise}
   */
  changeColor: function (p) {
    return this.callApi(_MIDEA_COMMON, 'statusBarColor', p);
  },
  changeColorAndroid: function (p) {
    return this.callApi(_MIDEA_COMMON, 'statusBarColor4Android', p);
  },
  /**
   * 登出，注销用户
   * @return {*|promise}
   */
  logout: function () {
    return this.callApi(_MIDEA_COMMON, 'logout', null);
  },
  /**
   * 获取webview信息
   * @return {*|promise}
   */
  webview: function () {
    return this.callApi(_MIDEA_COMMON, 'webview', null);
  },
  /**
   * 获取屏幕信息
   * @return {*|promise}
   */
  screen: function () {
    return this.callApi(_MIDEA_COMMON, 'screen', null);
  },
  /**
   * 获取额外启动参数
   * @param params {array} 参数
   * @return {*|promise}
   */
  getExtra: function (params) {
    return this.callApi(_MIDEA_COMMON, 'getExtra', params || [pkg.identify]);
  },
  /**
   * 获取设备信息
   * @return {*|promise}
   */
  getDeviceInfo: function () {
    return this.callApi(_MIDEA_COMMON, 'getDeviceInfo', null);
  },
  /**
   * 用外部浏览器打开链接
   * @param url {string} 链接地址url
   * @return {*|promise}
   */
  openUrl: function (url) {
    return this.callApi(_MIDEA_COMMON, 'openSysBrowser', [url]);
  },
  /**
   * h5事件监听
   * @param params {array} 参数
   * @return {*|promise}
   */
  statistics: function (params) {
    return this.callApi(_MIDEA_COMMON, 'onEvent', params);
  },
  /**
   * 分享
   * @param params {array} 参数
   * @return {*|promise}
   */
  share: function (params) {
    return this.callApi(_MIDEA_COMMON, 'share', params);
  },
  /**
   * 打开应用页面
   * @return {*|promise}
   */
  showAppView: function () {
    return this.callApi(_MIDEA_COMMON, 'showAppView', ['messageView']);
  },
  /**
   * 打开时间日期选择
   * @param params {array} 参数
   * @return {*}
   */
  showPicker: function (params) {
    var promise = new Promise((resolve, reject) => {
      if (window.datePicker) {
        params = Object.assign(
          {
            date: new Date(),
            mode: 'date',
            type: 'day',
          },
          params
        );

        window.datePicker &&
          window.datePicker.show(params, function (date) {
            resolve(date);
          });
      } else {
      }
    });
    return promise;
  },
  /**
   * 打开通讯录
   * @return {*|promise}
   */
  getPhoneMan: function () {
    return this.callApi(_MIDEA_USER, 'getContact', null);
  },
  /**
   * 打开个人设置页面
   * @return {*|promise}
   */
  goPersonalSet: function () {
    return this.callApi(_MIDEA_COMMON, 'showSetView', null);
  },
  /**
   * 打开“我的”页面
   * @return {*|promise}
   */
  goMyView: function () {
    return this.callApi(_MIDEA_COMMON, 'showMyView', null);
  },
  /**
   * 打开widget
   * @param params {array} 参数
   * @return {*|promise}
   */
  showWidget: function (params) {
    return this.callApi(_MIDEA_COMMON, 'showWidget', params);
  },
  /**
   * 显示键盘
   * @return {*|promise}
   */
  showInput: function () {
    return this.callApi(_MIDEA_COMMON, 'showInput', null);
  },
  /**
   * 隐藏键盘
   * @return {*|promise}
   */
  hideInput: function () {
    return this.callApi(_MIDEA_COMMON, 'hideInput', null);
  },
  /**
   * 打开消息页面
   * @return {*|promise}
   */
  showMessageView: function () {
    return this.callApi(_MIDEA_COMMON, 'showAppView', ['messageView']);
  },
  /**
   * 批量将图片转换成base64码
   * @param pictureList {array} 图片列表
   * @return {*|promise}
   */
  getBase64CodeFromPictures: function (pictureList) {
    return this.callApi(_MIDEA_COMMON, 'getBase64s', pictureList);
  },
  /**
   * 跳转到系统设置页面，
   * @param arr arr[0]为要跳转的对应的设置页面，暂时支持  蜂窝网络：CellularNetWork，WIFI：WIFI
   * @returns {*}
   */
  gotoSystemSetting: function (arr) {
    return this.callApi(_MIDEA_COMMON, 'gotoSystemSetting', arr);
  },
  /**
   * 附件展示
   * @param param {array} 附件链接url列表
   * @return {Promise}
   */
  readPdf: function (param) {
    return this.callApi(_MIDEA_COMMON, 'readPdf', param);
  },
  /**
   * 附件txt展示
   * @param param {array} 参数
   * @return {Promise}
   */
  showTxt: function (param) {
    return this.callApi(_MIDEA_PDF, 'showTxt', param);
  },
  /**
   * @description 获取底座密码
   * @returns {Promise}
   */
  getUserPassword: function () {
    return this.callApi(_MIDEA_USER, 'getUserPassword', []);
  },
  /**
   * @description 打电话（底座有bug）
   * @param phoneNumber {string}
   * @returns {Promise}
   */
  financeCall: function (phoneNumber) {
    return this.callApi(_MIDEA_COMMON, 'callPhone', [phoneNumber]);
  },
  /**
   *  跳转到 IM沟通
   * @param userId {string}
   * @returns {Promise}
   */
  imCommunicate: function (userId) {
    return this.callApi(_MIDEA_USER, 'vcard', [userId]);
  },
  /**
   *  是否禁用webview橡皮筋效果
   * @param params params '1': 启用 '0': 禁止
   * @returns {*}
   */
  setBounces(params) {
    return this.callApi(_MIDEA_COMMON, 'setBounces', [params]);
  },
  /**
   * 打开外链url
   * @param url {string} 链接地址url
   * @return {*|promise}
   */
  neiOpenUrl: function (url) {
    if (config.env === 'local' && config.buildTarget !== 'cordova') {
      window.open(url);
    } else {
      return this.callApi(_MIDEA_COMMON, 'openUrl', [url]);
    }
  },
  /**
   *  开始录音
   *  time 最大录音时间，单位：毫秒 (默认为15s)
   */
  playAudio() {
    return this.callApi(_Audio, 'startRecord', [{ maxRecordDuration: 60 }]);
  },
  /**
   *  停止录音
   */
  stopAudio() {
    return this.callApi(_Audio, 'stopRecord', []);
  },
  /**
   * 取消录音
   */
  cancelRecord() {
    return this.callApi(_Audio, 'cancelRecord', []);
  },
  previewFile(fileUrl) {
    return this.callApi(_MIDEA_COMMON, 'previewFile', [fileUrl]);
  },
  amapLocation() {
    return this.callApi(_MIDEA_MAP, 'amapLocation');
  },
  /**
   *  判断安卓、ios
   * @param
   * @returns true:false
   */
  isAndroid() {
    let u = navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  },
  isIOS() {
    let u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  },
  saveToGallery(url) {
    return this.callApi(_MIDEA_COMMON, 'saveToGallery', [url]);
  },
  /*
   **
   **  从其他 应用中返回 调用 传入的fun方法
   **  @param fun { Function } 回调方法
   **
   */
  viewAppear(fun) {
    if (this.isIOS) {
      clearTimeout(viewTimeOut);
      viewTimeOut = window.setInterval(function () {
        new Promise((resolve, reject) => {
          if (window.cordova) {
            try {
              window.cordova.exec(
                (msg) => {
                  fun();
                  // this.viewAppear(fun)
                  resolve(msg);
                },
                (msg) => {
                  reject(msg);
                },
                'MideaCommon',
                'moniterViewAppear',
                null
              );
            } catch (e) {
              console.error(e);
              reject(e);
            }
          } else {
          }
        });
      }, 1000);
    }
    if (this.isAndroid) {
      try {
        resumeFunc != null && document.removeEventListener('resume', resumeFunc, false);
        resumeFunc = fun;
        document.addEventListener('resume', resumeFunc, false);
      } catch (e) {
        console.error(e);
      }
    }
  },
};

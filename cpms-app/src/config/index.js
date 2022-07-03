import pkg from '@/../package.json';
import env, { buildTarget } from './env';

const config = {};

config.pkg = pkg;

// 高德地图APIKEY
config.amapKey = '66c039ccc1eb3b908ea450529cd5768e';

// 错误监控系统APIKEY
config.fundebugKey = 'f00c617546f35d24a5b7343bd45e63e3776ddfc81eec9a2abed47e2a887b5de5';

// 模拟用户
config.testUser = {
  uid: 'weicong.peng',
  cn: '彭伟聪',
  token: 'ut_sIkbVyd35Qq1Gu65ND7wWtXoqwS1axKxJ62',
};

// 接口配置
config.apiMeta = {
  successKey: 'code', // 成功标识字段
  successValue: 0, // 成功标识值
  errorKey: 'msg', // 错误提示信息字段
  intercept: true, // 是否拦截错误信息
};

config.baseUrl = {
  // 本地环境
  local: '',
  // SIT环境
  sit: 'https://acloud-sit.tcl.com',
  // UAT环境
  uat: 'https://acloud-uat.tcl.com',
  // 生产环境
  prod: 'https://acloud.tcl.com',
};

/**
 * 运行模式:
 * local: 本地环境
 * sit: SIT环境
 * uat: UAT环境
 * prod: 生产环境
 */
config.env = env;

/**
 * 构建对象：
 * cordova：轻应用
 * h5：在线服务
 */
config.buildTarget = buildTarget;

// 当前语言: CN | EN
config.language = 'CN';

config.themeColor = [229, 1, 19, 1];

export default config;

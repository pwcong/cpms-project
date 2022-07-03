import pkg from '@/../package.json';
import env from './env';

const config = {};

config.env = env;

// 包描述信息
config.pkg = pkg;

// 高德地图APIKEY
config.amapKey = '66c039ccc1eb3b908ea450529cd5768e';

// 错误监控系统APIKEY
config.fundebugKey = 'f00c617546f35d24a5b7343bd45e63e3776ddfc81eec9a2abed47e2a887b5de5';

export default config;

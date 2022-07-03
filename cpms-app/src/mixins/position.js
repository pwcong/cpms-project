import { calcDistance } from '@/utils';
import config from '@/config';

export default {
  name: 'position-mixin',
  data() {
    return {
      position: {},
    };
  },
  methods: {
    calcDistance(pos1, pos2) {
      return calcDistance(pos1, pos2);
    },
    calcPosition(pos, distance) {
      const { longitude, latitude } = pos;

      const d = (distance / 1.5) * 0.00001;

      const toString = (d) => (Math.round(d * 100000) / 100000).toString();

      return {
        longitude: toString(
          Number(longitude) + d * (Math.random() > 0.5 ? 1 : -1)
        ),
        latitude: toString(
          Number(latitude) + d * (Math.random() > 0.5 ? 1 : -1)
        ),
      };
    },
    getPosition() {
      const ctx = this;
      return new Promise(async (resolve, reject) => {
        if (config.env === 'local') {
          const testPosition = {
            longitude: 113.927828,
            latitude: 22.574745,
            address: '中国广东省深圳市南山区中山园路',
            provider: '广东省',
            city: '深圳市',
            district: '南山区',
            streeName: '中山园路',
            streeNumber: '',
          };

          ctx.$set(ctx, 'position', testPosition);
          resolve(testPosition);
          return;
        }

        let position = {};
        try {
          position = await ctx.$nativeApi.amapLocation();
          ctx.position = position;
          resolve(position);
        } catch (e) {
          ctx.$toast.fail({
            message: '获取地理位置失败',
          });
          reject();
        }

        console.log('当前定位地址结果为: ', position);
      });
    },
    openPositionTimer(timeout = 5000) {
      this.$toast.loading({
        message: '定位中',
        duration: timeout,
      });

      let t = false;

      const _getPosition = () => {
        this.getPosition()
          .then(() => {
            this.$toast.success({
              message: '定位成功',
              duration: 1000,
            });
          })
          .catch(() => {
            if (!t) {
              setTimeout(_getPosition, 500);
            } else {
              this.$toast.fail({
                message: '当前位置与打卡距离相对较远，请到打卡点后再刷新定位',
              });
            }
          });
      };

      _getPosition();
      setTimeout(() => (t = true), timeout);
    },
  },
};

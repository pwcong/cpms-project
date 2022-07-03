<template>
  <list-layout class="page-clock-clockin">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="考勤打卡" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form>
          <block>
            <van-field
              required
              readonly
              v-model="punchAddress.fdClockAddress"
              name="fdClockAddress"
              label="最近打卡地点"
            />
            <van-field
              required
              readonly
              v-model="punchAddress.fdClockScope"
              name="fdClockScope"
              label="打卡半径（米）"
            />
            <van-field
              required
              readonly
              :value="formatDateTime(punchLastTime)"
              name="punchLastTime"
              label="上次打卡时间"
            />
            <van-field required readonly :value="punchNowTime" name="punchNowTime" label="打卡时间" />
          </block>
          <block>
            <div class="distance">
              <van-icon name="location-o" />
              <span>
                {{ distanceText }}
              </span>
              <span v-if="!allowClockIn">，超出打卡半径</span>
            </div>

            <div v-if="allowClockIn" class="refresh" @click="handleClockIn">
              <div class="refresh-wrapper active">
                <span>签到</span>
              </div>
            </div>
            <div v-else class="refresh" @click="openPositionTimer()">
              <div class="refresh-wrapper">
                <span>点击刷新</span>
              </div>
            </div>
          </block>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import api from '@/api';
import { userMixin, positionMixin } from '@/mixins';

export default {
  name: 'page-clock-clockin',
  mixins: [userMixin, positionMixin],
  components: {},
  data() {
    return {
      // position: {
      //   longitude: 113.927828,
      //   latitude: 22.574745,
      //   address: '中国广东省深圳市南山区中山园路',
      //   provider: '广东省',
      //   city: '深圳市',
      //   district: '南山区',
      //   streeName: '中山园路',
      //   streeNumber: '',
      // },
      // *******************************************************
      punchAddress: {}, // 打卡地点
      punchLastTime: '', // 上次打卡时间
      punchNowTime: '', // 打卡时间
      address: [],
    };
  },
  created() {
    this.initData();
    this.initClock();
    this.openPositionTimer();
  },
  computed: {
    distance() {
      return this.calcDistance(this.position, this.punchAddress);
    },
    distanceText() {
      return `您距离最近打卡区域${this.distance >= 0 ? `${this.distance.toFixed(2)}米` : '未知'}`;
    },
    allowClockIn() {
      // return true;
      if (isNaN(this.distance)) {
        return false;
      }

      if (this.distance > Number(this.punchAddress.fdClockScope || 0)) {
        return false;
      }

      return true;
    },
  },

  watch: {
    address(v) {
      this.calcNearAddress(v);
    },
    position(v) {
      this.calcNearAddress(this.address);
    },
  },

  methods: {
    formatDateTime(v) {
      if (!v) {
        return '';
      }

      if (typeof v === 'string') {
        return v;
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD HH:mm:ss');
    },
    async initData() {
      try {
        const data = await api.salesman.postClockAddressMobilePage({});
        this.punchLastTime = data.lastTime;
        this.address = data.records || [];
      } catch (error) {
        // DO NOTHING
        console.error(error);
      }
    },

    initClock() {
      const clock = setInterval(() => {
        this.punchNowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      }, 1000);

      this.$once('hook:beforeDestroy', () => {
        clearInterval(clock);
      });
    },

    calcNearAddress(address) {
      if (this.position.longitude === undefined) {
        this.punchAddress = {};
        return;
      }

      address = address
        .map((d) => {
          const { fdLatitude = 0, fdLongitude = 0 } = d;

          const t = {
            ...d,
            latitude: fdLatitude / 1000000,
            longitude: fdLongitude / 1000000,
            distance: this.calcDistance(this.position, {
              latitude: fdLatitude / 1000000,
              longitude: fdLongitude / 1000000,
            }),
          };

          return t;
        })
        .sort((a, b) => (a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0));

      if (address[0]) {
        this.punchAddress = address[0];
      } else {
        this.punchAddress = {};
      }
    },

    async handleClockIn() {
      if (!this.punchAddress.id) {
        this.$toast.fail({
          message: '请获取最近打卡地点',
        });
        return;
      }

      this.loading = true;
      this.$toast.loading({
        message: '正在打卡中',
      });

      try {
        await api.salesman.postClockInForm({
          ...this.punchAddress,
          fdType: 'clock',
          fdProvinceName: this.position.provider,
          fdCityName: this.position.city,
          fdCountyName: this.position.district,
        });
        this.$toast.success({
          message: '打卡成功',
        });
        setTimeout(this.handleCancel, 300);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    handleCancel() {
      this.$root.goBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-clock-clockin {
  background-color: white;
  .main {
    background-color: white;
  }
  .distance {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $theme-color;
    padding: 14px 0;
    font-size: 14px;

    span {
      margin-left: 4px;
    }
  }

  .refresh {
    margin: 12px auto;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 2px solid #dddddd;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    .refresh-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid #ffdd9f;
      background-color: #ffdd9f;
      color: white;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background-color: #ffad45;
      }
    }
  }
}
</style>

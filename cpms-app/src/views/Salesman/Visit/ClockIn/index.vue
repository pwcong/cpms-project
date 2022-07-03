<template>
  <list-layout class="page-visit-clockin">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="拜访打卡" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form" @submit="onSubmit">
          <block>
            <van-field
              required
              readonly
              v-model="targetPosition.fdDetailaddress"
              name="fdDetailaddress"
              label="打卡地点"
            />
            <!-- <van-field required readonly value="1000" label="打卡半径（米）" /> -->
            <van-field required readonly :value="fdFlowTime" name="fdFlowTime" label="本次打卡时间" />

            <van-field
              required
              readonly
              :value="(formData.sysAttContractAspectParams[0] || {}).value"
              name="sysAttContractAspectParams"
              label="实时拍照"
              :rules="[{ required: true, message: '请上传实时拍照' }]"
            >
              <picture-uploader
                mode="picture"
                slot="input"
                :actions="[1]"
                v-model="formData.sysAttContractAspectParams"
              />
            </van-field>
          </block>
          <block>
            <div class="distance">
              <van-icon name="location-o" />
              <span>
                {{ distanceText }}
              </span>
              <span v-if="!allowClockIn">，超出打卡半径</span>
            </div>
            <div v-if="allowClockIn" class="refresh" @click="handleSubmit">
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
  name: 'page-visit-clockin',
  mixins: [userMixin, positionMixin],
  data() {
    const { id } = this.$route.query;

    return {
      id,
      loading: false,
      fdFlowTime: '',
      formData: {
        sysAttContractAspectParams: [],
      },
      targetPosition: {},
      position: {
        // longitude: 113.927828,
        // latitude: 22.574745,
        // address: '中国广东省深圳市南山区中山园路',
        // provider: '广东省',
        // city: '深圳市',
        // district: '南山区',
        // streeName: '中山园路',
        // streeNumber: '',
      },
      attKey: 'SALESMAN_VISITCLOCKIN',
    };
  },
  created() {
    this.initData();
    this.initClock();
    this.openPositionTimer();
  },
  computed: {
    distance() {
      return this.calcDistance(this.position, {
        longitude: (this.targetPosition.fdLongitude || 0) / 1000000,
        latitude: (this.targetPosition.fdLatitude || 0) / 1000000,
      });
    },
    distanceText() {
      return `您距离最近打卡区域${this.distance >= 0 ? `${this.distance.toFixed(2)}米` : '未知'}`;
    },
    allowClockIn() {
      // return true;
      if (isNaN(this.distance)) {
        return false;
      }

      if (this.distance > 1000) {
        return false;
      }

      return true;
    },
  },
  methods: {
    async initData() {
      const data = await api.salesman.getVisitClockInAddress(this.id);
      this.targetPosition = data || {};
    },

    handleSubmit() {
      this.$refs.form.submit();
    },

    async onSubmit() {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.$toast.loading({
        message: '正在打卡中',
      });

      try {
        await api.salesman.postVisitClockInForm({
          fdAttKey: this.attKey,
          sysAttContractAspectParams: this.formData.sysAttContractAspectParams.map((d) => ({
            fdAttKey: this.attKey,
            fdAttFileId: d.value,
          })),
          spersonClockRecordMain: {
            fdClockAddress: this.targetPosition.fdDetailaddress,
            fdLatitude: this.position.latitude,
            fdLongitude: this.position.longitude,
            fdProvinceName: this.position.provider,
            fdCityName: this.position.city,
            fdCountyName: this.position.district,
          },
          id: this.id,
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

    initClock() {
      const clock = setInterval(() => {
        this.fdFlowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      }, 1000);

      this.$once('hook:beforeDestroy', () => {
        clearInterval(clock);
      });
    },

    handleCancel() {
      this.$root.goBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-visit-clockin {
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

<template>
  <list-layout class="page-clock-externalclockin">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="外勤打卡" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form" @submit="onFormSubmit">
          <block>
            <van-field required readonly v-model="position.address" name="address" label="最近打卡地点" />
            <van-field required readonly :value="fdFlowTime" name="fdFlowTime" label="本次打卡时间" />

            <van-field
              readonly
              required
              is-link
              clickable
              :value="formData.fdRelateModule"
              name="fdRelateModule"
              label="关联拜访计划"
              placeholder="请选择"
              @click="showSelectVisit = true"
              :rules="[{ required: true, message: '请选择关联拜访计划' }]"
            />

            <van-field
              required
              v-model="formData.fdCause"
              name="fdCause"
              label="外勤打卡理由"
              type="textarea"
              :row="3"
              placeholder="请输入"
              :rules="[{ required: true, message: '请输入外勤打卡理由' }]"
            />

            <van-field
              required
              readonly
              :value="(formData.sysAttContractAspectParams[0] || {}).fdAttFileId"
              name="sysAttContractAspectParams"
              label="实时拍照"
              :rules="[{ required: true, message: '请上传实时拍照' }]"
            >
              <picture-uploader mode="picture" slot="input" :actions="[1]" @change="handleSelectAtt" />
            </van-field>
          </block>
          <block>
            <div v-if="!!position && !!position.address" class="refresh" @click="handleSubmit">
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

    <selection-visit
      searchable
      status="todo"
      title="选择拜访计划"
      :value="
        !!formData.fdRelateModuleId
          ? [
              {
                text: formData.fdRelateModule,
                value: formData.fdRelateModuleId,
              },
            ]
          : []
      "
      :visible.sync="showSelectVisit"
      @change="handleSelectVisit"
    />
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import api from '@/api';
import { userMixin, positionMixin } from '@/mixins';
import SelectionVisit from '@/views/components/selection/visit';
import formMixin from '../OutclockDetail/form';
export default {
  name: 'page-clock-externalclockin',
  mixins: [formMixin, userMixin, positionMixin],
  components: {
    SelectionVisit,
  },
  data() {
    return {
      loading: false,
      fdFlowTime: '',
      formData: {
        fdRelateModule: '',
        fdRelateModuleId: '',
        fdCause: '',
        sysAttContractAspectParams: [],
        fdAttKey: 'SALESMAN_EXTERNALCLOCKIN',
      },
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
      showSelectVisit: false,
    };
  },
  created() {
    this.initClock();
    this.openPositionTimer();
  },
  methods: {
    async initData() {},

    handleSubmit() {
      this.$refs.form.submit();
    },

    async onFormSubmit() {
      if (this.loading) {
        return;
      }
      if (!this.position || !this.position.address) {
        this.$toast.fail({
          message: '请点击刷新重新定位',
        });
        return;
      }

      this.$dialog
        .confirm({
          title: '是否确认外勤打卡?',
        })
        .then(async () => {
          this.loading = true;

          this.$toast.loading({
            message: '正在打卡中',
          });

          try {
            await api.salesman.postExternalClockInForm({
              ...this.formData,
              spersonClockRecordMainAddParam: {
                fdClockAddress: this.position.address,
                fdLatitude: this.position.latitude,
                fdLongitude: this.position.longitude,
                fdProvinceName: this.position.provider,
                fdCityName: this.position.city,
                fdCountyName: this.position.district,
              },
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
        });
    },

    initClock() {
      const clock = setInterval(() => {
        this.fdFlowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      }, 1000);

      this.$once('hook:beforeDestroy', () => {
        clearInterval(clock);
      });
    },

    handleSelectVisit(res) {
      const value = res[0];
      if (!value) {
        this.formData.fdRelateModule = '';
        this.formData.fdRelateModuleId = '';
        return;
      }
      this.formData.fdRelateModule = value.text;
      this.formData.fdRelateModuleId = value.value;
    },
    handleSelectAtt(res) {
      this.formData.sysAttContractAspectParams = res.map((d) => ({
        fdAttFileId: d.value,
        fdAttKey: this.formData.fdAttKey,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-clock-externalclockin {
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

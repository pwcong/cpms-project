<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar
          :class="className"
          title="项目地址设置"
          left-text="取消"
          left-arrow
          right-text="保存"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                v-model="tempValue.fdDetailAddress"
                name="tempValue.fdDetailAddress"
                label="项目施工地址"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showMap = true"
                required
                :rules="[
                  {
                    required: true,
                    message: '请请选择项目施工地址',
                  },
                ]"
              />
            </block>
          </van-form>
        </div>
      </template>

      <!-- <selection-amap searchable :visible.sync="showMap" @change="handleSelectAddress" /> -->

      <selection-amap
        title="选择地址"
        :position="position"
        searchable
        @relocation="getPosition"
        :visible.sync="showMap"
        @change="handleSelectAddress"
      >
        <template v-slot:item="{ value, checked }">
          <amap-item :position="position" :value="value" :checked="checked" />
        </template>
      </selection-amap>
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin, positionMixin } from '@/mixins';
import AMapItem from '@/components/selection-amap/item';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdDetailAddress: '',
  },
});

export default {
  name: 'setting-address',
  mixins: [selectionMixin, positionMixin],
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
    },
    moduleId: {
      type: String,
    },
  },
  components: {
    'amap-item': AMapItem,
  },
  data() {
    return {
      showMap: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      const t = this.list.findIndex((d) => d.fdDetailAddress === this.tempValue.fdDetailAddress);

      // 地址新增不能重复
      if ((this.mode === 'add' && t > -1) || (this.mode === 'edit' && t !== this.index)) {
        if (t > -1) {
          this.$toast.fail({
            message: '当前地址已存在，请选择其他地址',
          });
          return;
        }
      }

      this.onOk();
    },
    handleSelectAddress(res) {
      res = res[0];
      if (!res) {
        return;
      }

      const { data = {}, text, value } = res;

      const { province = '', city = '', district = '', township = '', adcode } = data.addressComponent || {};

      this.tempValue.fdProvince = typeof province === 'string' ? province : '';
      this.tempValue.fdCity = typeof city === 'string' ? city : '';
      this.tempValue.fdCounty = typeof district === 'string' ? district : '';
      this.tempValue.fdStreet = typeof township === 'string' ? township : '';
      this.tempValue.fdDetailAddress = text;
      this.tempValue.fdLongitude = Number(value.split(',')[0]);
      this.tempValue.fdLatitude = Number(value.split(',')[1]);
      this.tempValue.fdAdcode = adcode;
    },
  },
};
</script>
<style lang="scss" scoped></style>

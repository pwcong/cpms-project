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
          title="项目所在地设置"
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
                v-if="tempValue.fdIsMain !== '1'"
                :value="tempValue.fdEntireCountry === '1' ? '是' : '否'"
                name="fdEntireCountry"
                label="是否全国"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showYesOrNo = true"
              />
              <template v-if="tempValue.fdEntireCountry !== '1'">
                <van-field
                  :value="tempValue.fdProvinceName"
                  name="fdProvinceName"
                  label="所在省"
                  placeholder="请选择"
                  is-link
                  clickable
                  readonly
                  @click="showProvince = true"
                  :required="tempValue.fdEntireCountry !== '1' || tempValue.fdIsMain === '1'"
                  :rules="[
                    {
                      required: tempValue.fdEntireCountry !== '1' || tempValue.fdIsMain === '1',
                      message: '请选择所在省',
                    },
                  ]"
                />
                <van-field
                  :value="tempValue.fdCityName"
                  name="fdCityName"
                  label="所在市"
                  placeholder="请选择"
                  is-link
                  clickable
                  readonly
                  @click="showCity = true"
                  :required="tempValue.fdIsMain === '1'"
                  :rules="[
                    {
                      required: tempValue.fdIsMain === '1',
                      message: '请选择所在市',
                    },
                  ]"
                />
              </template>
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>

    <van-popup v-model="showYesOrNo" position="bottom">
      <picker-yes-or-no
        show-toolbar
        title="选择是否全国"
        @confirm="(tempValue.fdEntireCountry = $event.value) && (showYesOrNo = false)"
        @cancel="showYesOrNo = false"
      />
    </van-popup>

    <selection-province
      searchable
      :visible.sync="showProvince"
      :value="
        !!tempValue.fdProvince
          ? [
              {
                value: tempValue.fdProvince,
                text: tempValue.fdProvinceName,
              },
            ]
          : []
      "
      title="选择所在省"
      @change="handleChangeProvince"
    />
    <selection-city
      searchable
      :provinceCode="tempValue.fdProvince"
      :visible.sync="showCity"
      :value="!!tempValue.fdCity ? [{ value: tempValue.fdCity, text: tempValue.fdCityName }] : []"
      title="选择所在市"
      @change="handleChangeCity"
    />
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import PickerYesOrNo from '@/views/components/picker/yes-or-no';
import SelectionProvince from '@/views/components/selection/province';
import SelectionCity from '@/views/components/selection/city';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdIsMain: '',
    fdEntireCountry: '',
    fdProvince: '',
    fdProvinceName: '',
    fdCity: '',
    fdCityName: '',
    fdBusinessName: '',
    fdBusinessCode: '',
    fdIsRegion: '',
    fdRegionNum: 0,
    fdRegionBusinessCode: '',
  },
});

export default {
  name: 'setting-site',
  mixins: [selectionMixin],
  components: {
    PickerYesOrNo,
    SelectionProvince,
    SelectionCity,
  },
  data() {
    return {
      showYesOrNo: false,
      showProvince: false,
      showCity: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    async onFormSubmit() {
      const data = await api.business.postProjectIsRegion(this.tempValue);

      this.tempValue = {
        ...this.tempValue,
        fdIsRegion: data.fdIsRegion,
        fdBusinessName: data.fdBusinessName,
        fdBusinessCode: data.fdBusinessCode,
        fdRegionNum: data.fdRegionNum,
        fdRegionBusinessCode: data.fdRegionBusinessCode,
      };

      this.onOk();
    },
    handleChangeProvince(res) {
      this.tempValue.fdProvince = (res[0] || {}).value;
      this.tempValue.fdProvinceName = (res[0] || {}).text;
      this.tempValue.fdCity = '';
      this.tempValue.fdCityName = '';
    },
    handleChangeCity(res) {
      this.tempValue.fdCity = (res[0] || {}).value;
      this.tempValue.fdCityName = (res[0] || {}).text;
    },
  },
};
</script>
<style lang="scss" scoped></style>

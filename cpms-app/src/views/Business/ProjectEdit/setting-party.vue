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
          title="项目干系人设置"
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
                v-model="tempValue.fdPersonnelAttribution"
                name="fdPersonnelAttribution"
                label="人员归属"
                is-link
                clickable
                readonly
                @click="!!allowEdit && (showPersonnelAttribution = true)"
                placeholder="请输入"
                required
                :disabled="!allowEdit"
                :rules="[
                  {
                    required: true,
                    message: '请选择人员归属',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdName"
                name="fdName"
                label="姓名"
                placeholder="请输入"
                required
                :disabled="!allowEdit"
                :rules="[
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdMobile"
                name="fdMobile"
                label="电话"
                placeholder="请输入"
                required
                :disabled="!allowEdit"
                :rules="[
                  {
                    required: true,
                    message: '请输入电话',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdPosition"
                name="fdPosition"
                label="职务"
                :disabled="!allowEdit"
                placeholder="请输入"
                required
                :rules="[
                  {
                    required: true,
                    message: '请输入职务',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdSuperiors"
                name="fdSuperiors"
                label="上级领导"
                :disabled="!allowEdit"
                placeholder="请输入"
              />
              <van-field
                v-model="tempValue.fdRole"
                name="fdRole"
                label="参与角色"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showRole = true"
              />
              <van-field
                v-model="tempValue.fdStandpoint"
                name="fdStandpoint"
                label="立场"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showStandpoint = true"
              />
              <van-field
                v-model="tempValue.fdContactStatus"
                name="fdContactStatus"
                label="接触状态"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showContactStatus = true"
              />
              <van-field
                v-model="tempValue.fdGuestRelationship"
                name="fdGuestRelationship"
                label="客情关系"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showRelationship = true"
              />
            </block>
          </van-form>
        </div>
      </template>

      <selection-personnel-attribution
        :visible.sync="showPersonnelAttribution"
        :value="
          !!tempValue.fdPersonnelAttribution
            ? [
                {
                  value: tempValue.fdPersonnelAttribution,
                },
              ]
            : []
        "
        title="选择人员归属"
        @change="tempValue.fdPersonnelAttribution = ($event[0] || {}).value"
      />

      <selection-role
        :visible.sync="showRole"
        :value="
          (tempValue.fdRole || '')
            .split(',')
            .filter((v) => !!v)
            .map((v) => ({
              value: v,
            }))
        "
        title="选择参与角色"
        multiple
        @change="tempValue.fdRole = $event.map((d) => d.value).join(',')"
      />

      <selection-stand-point
        :visible.sync="showStandpoint"
        :value="
          !!tempValue.fdStandpoint
            ? [
                {
                  value: tempValue.fdStandpoint,
                },
              ]
            : []
        "
        title="选择参与角色"
        @change="tempValue.fdStandpoint = ($event[0] || {}).value"
      />

      <selection-contact-status
        :value="
          !!tempValue.fdContactStatus
            ? [
                {
                  value: tempValue.fdContactStatus,
                },
              ]
            : []
        "
        title="选择接触状态"
        :visible.sync="showContactStatus"
        @change="tempValue.fdContactStatus = ($event[0] || {}).value"
      />

      <selection-guest-relationship
        :value="
          !!tempValue.fdGuestRelationship
            ? [
                {
                  value: tempValue.fdGuestRelationship,
                },
              ]
            : []
        "
        title="选择接触状态"
        :visible.sync="showRelationship"
        @change="tempValue.fdGuestRelationship = ($event[0] || {}).value"
      />
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectionPersonnelAttribution from '../components/selection/personnel-attribution';
import SelectionRole from '../components/selection/role';
import SelectionStandPoint from '../components/selection/stand-point';
import SelectionContactStatus from '../components/selection/contact-status';
import SelectionGuestRelationship from '../components/selection/guest-relationship';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdPersonnelAttribution: '',
    fdName: '',
    fdMobile: '',
    fdPosition: '',
    fdSuperiors: '',
    fdRole: '',
    fdStandpoint: '',
    fdContactStatus: '',
    fdGuestRelationship: '',
    fdIsValid: '',
  },
});

export default {
  name: 'setting-party',
  mixins: [selectionMixin],
  components: {
    SelectionPersonnelAttribution,
    SelectionRole,
    SelectionStandPoint,
    SelectionContactStatus,
    SelectionGuestRelationship,
  },
  computed: {
    allowEdit() {
      return !this.tempValue.id;
    },
  },
  data() {
    return {
      showPersonnelAttribution: false,
      showRole: false,
      showStandpoint: false,
      showContactStatus: false,
      showRelationship: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>

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
          title="客户联系人设置"
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
                required
                v-model="tempValue.fdContactName"
                name="tempValue.fdContactName"
                label="负责人姓名"
                placeholder="请输入"
                :readonly="!!isEdit && !!moduleId && status !== 'draft'"
                :rules="[{ required: true, message: '请输入姓名' }]"
              />
              <van-field
                required
                v-model="tempValue.fdContactPost"
                name="tempValue.fdContactPost"
                label="职务"
                placeholder="请输入"
                :readonly="!!isEdit && !!moduleId && status !== 'draft'"
                :rules="[{ required: true, message: '请输入职务' }]"
              />
              <van-field
                required
                v-model="tempValue.fdContactMobile"
                name="tempValue.fdContactMobile"
                label="手机号"
                placeholder="请输入"
                :readonly="!!isEdit && !!moduleId && status !== 'draft'"
                :rules="[
                  {
                    required: !tempValue.fdContactMobile && !tempValue.fdContactPhone,
                    message: '手机号或座机必填一个',
                  },
                ]"
              />
              <van-field
                required
                v-model="tempValue.fdContactPhone"
                name="tempValue.fdContactPhone"
                label="座机"
                placeholder="请输入"
                :readonly="!!isEdit && !!moduleId && status !== 'draft'"
                :rules="[
                  {
                    required: !tempValue.fdContactMobile && !tempValue.fdContactPhone,
                    message: '手机号或座机必填一个',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdContactLeaderName"
                name="tempValue.fdContactLeaderName"
                label="上级"
                placeholder="请输入"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdContactName: '',
    fdContactPost: '',
    fdContactMobile: '',
    fdContactPhone: '',
    fdContactLeaderId: '',
    fdContactLeaderName: '',
  },
});

export default {
  name: 'setting-contact',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
    contactAddParamList: {
      type: Array,
    },
    status: {
      type: String,
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
  },
  data() {
    return {
      t: '',
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    async onFormSubmit() {
      if (!!this.moduleId && this.status !== 'draft') {
        try {
          if (this.isEdit) {
            const query = {
              fdContactLeaderId: this.tempValue.fdContactLeaderId,
              fdContactLeaderName: this.tempValue.fdContactLeaderName,
              version: this.tempValue.version,
              id: this.tempValue.id,
            };
            await api.customer.putCustomerContactholderEdit(query);
          } else {
            const custContactAddParamList = [];
            const contactAddParamList = {
              ...this.tempValue,
              fdMainId: this.moduleId,
            };
            custContactAddParamList.push(contactAddParamList);
            const data = await api.customer.postAddCustomerContact(custContactAddParamList);
            this.tempValue = {
              ...data[0],
            };
          }

          this.onOk();
        } catch (e) {
          console.error(e);
        }
      } else {
        this.onOk();
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>

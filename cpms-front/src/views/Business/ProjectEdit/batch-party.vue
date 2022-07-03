<template>
  <p-drawer
    class="batch-drawer"
    title="项目干系人批量设置"
    placement="bottom"
    :visible="visible"
    @close="onCancel"
    :destroyOnClose="true"
    :maskClosable="false"
    height="70vh"
    :body-style="{ paddingBottom: '80px' }"
  >
    <p-form-model ref="form" :model="tempValue">
      <p-table
        class="batch-table"
        v-if="tempValue.stakeholderListParams.length > 0"
        :scroll="{ x: true }"
        :pagination="false"
        :columns="columns"
        :data-source="tempValue.stakeholderListParams"
        bordered
      >
        <template slot="fdPersonnelAttribution" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'stakeholderListParams.' + index + '.fdPersonnelAttribution'"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <select-personnel-attribution
              style="width: 100px"
              :value="
                !!record.fdPersonnelAttribution
                  ? [
                      {
                        value: record.fdPersonnelAttribution,
                      },
                    ]
                  : []
              "
              allow-clear
              placeholder="请选择"
              @change="record.fdPersonnelAttribution = ($event[0] || {}).value"
            />
          </p-form-model-item>
        </template>
        <template slot="fdName" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'stakeholderListParams.' + index + '.fdName'"
            :rules="{
              required: true,
              message: '请输入',
              trigger: 'blur',
            }"
          >
            <p-input v-model="record.fdName" placeholder="请输入" />
          </p-form-model-item>
        </template>
        <template slot="fdMobile" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'stakeholderListParams.' + index + '.fdMobile'"
            :rules="{
              required: true,
              message: '请输入',
              trigger: 'blur',
            }"
          >
            <p-input v-model="record.fdMobile" placeholder="请输入" />
          </p-form-model-item>
        </template>
        <template slot="fdPosition" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'stakeholderListParams.' + index + '.fdPosition'"
            :rules="{
              required: true,
              message: '请输入',
              trigger: 'blur',
            }"
          >
            <p-input v-model="record.fdPosition" placeholder="请输入" />
          </p-form-model-item>
        </template>
        <template slot="fdSuperiors" slot-scope="text, record">
          <p-input v-model="record.fdSuperiors" placeholder="请输入" />
        </template>
        <template slot="fdRole" slot-scope="text, record">
          <select-role
            style="width: 200px"
            :value="
              (record.fdRole || '')
                .split(',')
                .filter((v) => !!v)
                .map((v) => ({
                  value: v,
                }))
            "
            allow-clear
            placeholder="请选择"
            multiple
            @change="record.fdRole = $event.map((d) => d.value).join(',')"
          />
        </template>
        <template slot="fdStandpoint" slot-scope="text, record">
          <select-stand-point
            style="width: 200px"
            :value="
              !!record.fdStandpoint
                ? [
                    {
                      value: record.fdStandpoint,
                    },
                  ]
                : []
            "
            allow-clear
            placeholder="请选择"
            @change="record.fdStandpoint = ($event[0] || {}).value"
          />
        </template>
        <template slot="fdContactStatus" slot-scope="text, record">
          <select-contact-status
            style="width: 200px"
            :value="
              !!record.fdContactStatus
                ? [
                    {
                      value: record.fdContactStatus,
                    },
                  ]
                : []
            "
            placeholder="请选择"
            allow-clear
            @change="record.fdContactStatus = ($event[0] || {}).value"
          />
        </template>
        <template slot="fdGuestRelationship" slot-scope="text, record">
          <select-guest-relationship
            style="width: 200px"
            :value="
              !!record.fdGuestRelationship
                ? [
                    {
                      value: record.fdGuestRelationship,
                    },
                  ]
                : []
            "
            placeholder="请选择"
            allow-clear
            @change="record.fdGuestRelationship = ($event[0] || {}).value"
          />
        </template>
        <template slot="fdIsValid" slot-scope="text, record">
          <select-yes-or-no
            style="width: 100px"
            :value="
              !!record.fdIsValid
                ? [
                    {
                      value: record.fdIsValid,
                    },
                  ]
                : []
            "
            placeholder="请选择"
            @change="record.fdIsValid = ($event[0] || {}).value"
          />
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <span>
            <p-button-link @click="handleAddItem(index + 1)">
              <p-icon type="plus-circle" />
            </p-button-link>
            <p-popconfirm
              v-if="!record.id || status === 'draft'"
              title="是否确认删除当前行数据?"
              @confirm="handleDelItem(record, index)"
            >
              <p-button-link>
                <p-icon type="minus-circle" />
              </p-button-link>
            </p-popconfirm>
            <template v-else>
              <p-popconfirm
                v-if="record.fdIsValid !== '0'"
                title="是否确认废弃当前行数据?"
                @confirm="handleAbandonItem(record, index)"
              >
                <p-button-link>废弃</p-button-link>
              </p-popconfirm>
            </template>
          </span>
        </template>
      </p-table>
      <p-empty
        v-else
        :description="false"
        style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)"
      >
        <span>暂无数据，</span>
        <p-button-link type="primary" @click="handleAddItem(0)"> 新增一条 </p-button-link>
      </p-empty>
    </p-form-model>

    <div class="batch-footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button
        style="width: 100px; margin-left: 8px"
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </p-button>
    </div>
  </p-drawer>
</template>

<script>
import lodash from 'lodash';
import { buildSelectionMixin } from '@/mixins';
import SelectPersonnelAttribution from '../components/select/personnel-attribution';
import SelectRole from '../components/select/role';
import SelectGuestRelationship from '../components/select/guest-relationship';
import SelectContactStatus from '../components/select/contact-status';
import SelectStandPoint from '../components/select/stand-point';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

const defaultValue = {
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
};

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue,
  getValue: (_, value) => {
    return lodash.cloneDeep(value);
  },
});

export default {
  name: 'batch-party',
  props: {
    status: {
      type: String,
    },
  },
  mixins: [selectionMixin],
  components: {
    SelectPersonnelAttribution,
    SelectRole,
    SelectGuestRelationship,
    SelectContactStatus,
    SelectStandPoint,
    SelectYesOrNo,
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '人员归属',
          dataIndex: 'fdPersonnelAttribution',
          scopedSlots: { customRender: 'fdPersonnelAttribution' },
          className: 'required',
        },
        {
          title: '姓名',
          dataIndex: 'fdName',
          scopedSlots: { customRender: 'fdName' },
          className: 'required',
        },
        {
          title: '电话',
          dataIndex: 'fdMobile',
          scopedSlots: { customRender: 'fdMobile' },
          className: 'required',
        },
        {
          title: '职务',
          dataIndex: 'fdPosition',
          scopedSlots: { customRender: 'fdPosition' },
          className: 'required',
        },
        {
          title: '上级领导',
          dataIndex: 'fdSuperiors',
          scopedSlots: { customRender: 'fdSuperiors' },
        },
        {
          title: '参与角色',
          dataIndex: 'fdRole',
          scopedSlots: { customRender: 'fdRole' },
        },
        {
          title: '立场',
          dataIndex: 'fdStandpoint',
          scopedSlots: { customRender: 'fdStandpoint' },
        },
        {
          title: '接触状态',
          dataIndex: 'fdContactStatus',
          scopedSlots: { customRender: 'fdContactStatus' },
        },
        {
          title: '客情关系',
          dataIndex: 'fdGuestRelationship',
          scopedSlots: { customRender: 'fdGuestRelationship' },
        },
        {
          title: '是否有效',
          dataIndex: 'fdIsValid',
          scopedSlots: { customRender: 'fdIsValid' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    };
  },
  methods: {
    handleOk(submit) {
      this.tempValue.stakeholderListParams = [...this.tempValue.stakeholderListParams];
      !!submit && this.onOk();
    },
    handleAddItem(index) {
      this.tempValue.stakeholderListParams.splice(index || 0, 0, {
        ...defaultValue,
        fdIsValid: '1',
      });
      this.handleOk();
    },
    handleDelItem(value, index) {
      this.tempValue.stakeholderListParams.splice(index, 1);
      this.handleOk();
    },
    async handleAbandonItem(value, index) {
      this.tempValue.stakeholderListParams[index] = {
        ...value,
        fdIsValid: '0',
        fdIsUpdate: '1',
      };
      this.handleOk();
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.handleOk(true);
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/batch-drawer.scss';
</style>

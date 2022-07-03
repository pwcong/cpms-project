<template>
  <block theme="primary" title="客户联系人">
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddCustomer">
        新增联系人
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="
        [
          {
            title: '序号',
            width: 50,
            fixed: 'left',
            dataIndex: 'index',
            customRender: (text, record, index) => `${index + 1}`,
          },
          {
            title: '姓名',
            dataIndex: 'fdContactName',
          },
          {
            title: '职务',
            dataIndex: 'fdContactPost',
          },
          {
            title: '手机号',
            dataIndex: 'fdContactMobile',
          },
          {
            title: '座机',
            dataIndex: 'fdContactPhone',
          },
          {
            title: '上级',
            dataIndex: 'fdContactLeaderName',
          },
          {
            title: '是否有效',
            dataIndex: 'fdIsValid',
            scopedSlots: { customRender: 'fdIsValid' },
          },
        ].concat(
          !!readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 120,
                  fixed: 'right',
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      "
      :data-source="tempValue.contactAddParamList"
      :pagination="false"
      bordered
    >
      <template slot="fdIsValid" slot-scope="text, record">
        {{ record.fdIsValid === '0' ? '作废' : '有效' }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link
            v-if="record.fdIsValid !== '0'"
            @click="handleEditCustomer(record, index)"
          >
            编辑
          </p-button-link>
          <p-popconfirm
            title="是否确认删除当前行数据?"
            @confirm="handleDelItem(record, index)"
            v-if="!moduleId"
          >
            <p-button-link>删除</p-button-link>
          </p-popconfirm>
          <template v-if="!!moduleId">
            <p-popconfirm
              v-if="record.fdIsValid !== '0'"
              title="废弃动作会立即生效，是否确认废弃当前行数据?"
              @confirm="handleAbandonItem(record, index)"
            >
              <p-button-link>废弃</p-button-link>
            </p-popconfirm>
          </template>
        </span>
      </template>
    </p-table>

    <setting-contact
      :moduleId="moduleId"
      :status="status"
      :contactAddParamList="superiorList"
      :value="customerValue"
      :visible.sync="customerVisible"
      :mode="customerIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeCustomer"
    />
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import SettingContact from './setting-contact';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    contactAddParamList: [],
  },
});

export default {
  name: 'contact-list',
  mixins: [selectionMixin],
  components: {
    SettingContact,
  },
  props: {
    moduleId: {
      type: String,
    },
    contactList: {
      type: Array,
    },
    status: {
      type: String,
    },
  },
  data() {
    return {
      customerVisible: false,
      customerValue: {},
      customerIndex: -1,
      superiorList: [],
    };
  },
  methods: {
    handleAddCustomer() {
      this.setSuperiorList(this.contactList);
      this.handleEditCustomer(
        {
          fdIsValid: '1',
        },
        -1
      );
    },
    handleEditCustomer(value, index) {
      this.customerValue = { ...value };
      this.customerIndex = index;
      // if (index === 0) {
      //   this.superiorList = [];
      // } else {
      //   }
      this.setSuperiorList(this.tempValue.contactAddParamList, index);
      this.customerVisible = true;
    },
    handleDelItem(value, index) {
      this.tempValue.contactAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleChangeCustomer(value) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.customerIndex > -1) {
        this.tempValue.contactAddParamList[this.customerIndex] = value;
      } else {
        this.tempValue.contactAddParamList.push(value);
      }
      this.handleOk();
      this.setSuperiorList(this.tempValue.contactAddParamList);
    },

    // 废弃
    async handleAbandonItem(value, index) {
      const custContactEditParamList = [];
      const contactEditParamList = {
        fdContactName: value.fdContactName,
        fdContactPost: value.fdContactPost,
        id: value.id,
        version: value.version,
      };
      custContactEditParamList.push(contactEditParamList);
      try {
        await api.customer.putCustomerContactholderInvalid(custContactEditParamList);
      } catch (e) {
        console.error(e);
      } finally {
        this.$message.success('操作成功');
        this.tempValue.contactAddParamList[index] = {
          ...value,
          fdIsValid: '0',
        };
      }
      this.handleOk();
    },
    handleOk() {
      this.tempValue.contactAddParamList = [...this.tempValue.contactAddParamList];
      this.onOk();
    },
    setSuperiorList(list, customerIndex) {
      const superiorList = [];
      list.map((d, index) => {
        if (d.fdIsValid === '1' && index !== customerIndex) {
          superiorList.push({
            fdContactLeaderId: d.id || '',
            fdContactLeaderName: d.fdContactName,
          });
        }
      });
      this.superiorList = superiorList;
    },
  },
};
</script>

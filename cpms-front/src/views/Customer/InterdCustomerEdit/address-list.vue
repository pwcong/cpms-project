<template>
  <block class="office-address-list" theme="primary">
    <template v-slot:title>
      <div>
        <span>客户办公地址</span>
        <span style="font-size: 12px; color: #e50113">
          （注：客户办公地址至少一条记录。如不选择客户地址，则在客户审批完成前，不能进行客户拜访）
        </span>
      </div>
    </template>
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddAddress">
        新增地址
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
            title: '客户办公地址',
            dataIndex: 'fdDetailaddress',
          },
          {
            title: '创建人',
            dataIndex: 'createByName',
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
      :data-source="tempValue.addressAddParamList"
      :pagination="false"
      bordered
    >
      <template slot="fdIsValid" slot-scope="text, record">
        {{ record.fdIsValid === '0' ? '作废' : '有效' }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <template v-if="record.fdIsValid === '1'">
            <p-button-link
              v-if="!moduleId || status === 'draft'"
              @click="handleEditAddress(record, index)"
            >
              编辑
            </p-button-link>
          </template>
          <template v-if="!moduleId">
            <p-popconfirm
              title="是否确认删除当前行数据?"
              @confirm="handleDelItem(record, index)"
            >
              <p-button-link>删除</p-button-link>
            </p-popconfirm>
          </template>
          <template v-else>
            <p-popconfirm
              v-if="record.fdIsValid !== '0' && user.uid === record.createBy"
              title="废弃动作会立即生效，是否确认废弃当前行数据?"
              @confirm="handleAbandonItem(record, index)"
            >
              <p-button-link>废弃</p-button-link>
            </p-popconfirm>
          </template>
        </span>
      </template>
    </p-table>
    <selection-amap :visible.sync="showMap" @change="handleSelectAddress" />
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, userMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressAddParamList: [],
  },
});

export default {
  name: 'address-list',
  mixins: [selectionMixin, userMixin],
  props: {
    title: {
      type: Boolean,
    },
    moduleId: {
      type: String,
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
      addressVisible: false,
      showMap: false,
      addressValue: {},
      addressIndex: -1,
    };
  },
  methods: {
    handleAddAddress() {
      this.handleEditAddress(
        {
          fdIsValid: '1',
        },
        -1
      );
    },
    handleEditAddress(value, index) {
      this.addressValue = { ...value };
      this.addressIndex = index;
      this.showMap = true;
    },
    handleDelItem(value, index) {
      this.tempValue.addressAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleSelectAddress(value) {
      const { addressComponent = {} } = (value[0] || {}).data || {};
      this.handleChangeAddress([
        // ToDo 把this.addressValue赋值给到要传过去的
        {
          ...this.addressValue,
          fdLongitude: Number(value[0].value.split(',')[0]),
          fdLatitude: Number(value[0].value.split(',')[1]),
          fdAdcode: addressComponent.adcode,
          fdProvince: addressComponent.province,
          fdCity: typeof addressComponent.city === 'string' ? addressComponent.city : '',
          fdCounty:
            typeof addressComponent.district === 'string'
              ? addressComponent.district
              : '',
          fdStreet:
            addressComponent.township === 'string' ? addressComponent.township : '',
          fdDetailaddress: (value[0] || {}).text,
          createByName: this.user.name,
        },
      ]);
    },
    async handleChangeAddress(value) {
      if (!!this.moduleId && this.status !== 'draft') {
        try {
          const officeAddresAddParam = [];
          const officeAddresAddParamList = {
            ...value[0],
            fdMainId: this.moduleId,
          };
          officeAddresAddParam.push(officeAddresAddParamList);
          const data = await api.customer.postAddCustomerOfficeAddres(
            officeAddresAddParam
          );
        } catch (e) {
          console.error(e);
        } finally {
          this.tempValue.addressAddParamList = [
            ...value,
            ...this.tempValue.addressAddParamList,
          ];
          this.onOk();
        }
      } else {
        this.tempValue.addressAddParamList = [...this.tempValue.addressAddParamList];
        // 如果下标大于等于0说明是编辑，否则是新增
        if (this.addressIndex > -1) {
          this.tempValue.addressAddParamList[this.addressIndex] = value[0];
        } else {
          this.tempValue.addressAddParamList.push(...value);
        }
        this.tempValue.addressAddParamList = [...this.tempValue.addressAddParamList];
        this.onOk();
      }
    },
    //废弃
    async handleAbandonItem(value, index) {
      const addressEditParamlist = [];
      const addressEditParamList = {
        ...value,
      };
      addressEditParamlist.push(addressEditParamList);
      try {
        await api.customer.putCustomerOfficeAddressholderInvalid(addressEditParamlist);
      } catch (e) {
        console.error(e);
      } finally {
        this.$message.success('操作成功');
        this.tempValue.addressAddParamList[index] = {
          ...value,
          fdIsValid: '0',
        };
      }
      this.handleOk();
    },
    handleOk() {
      this.tempValue.addressAddParamList = [...this.tempValue.addressAddParamList];
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.office-address-list {
  .tips {
    color: $theme-color;
  }
}
</style>

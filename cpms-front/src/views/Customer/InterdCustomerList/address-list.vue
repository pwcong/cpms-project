<template>
  <block class="office-address-list" theme="primary">
    <template v-slot:title>
      <div>
        <span>客户办公地址</span>
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
      :data-source="tempValue.addressDtoList"
      :pagination="false"
      bordered
    >
      <template slot="fdIsValid" slot-scope="text, record">
        {{ record.fdIsValid === '0' ? '作废' : '有效' }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-popconfirm
            v-if="
              record.fdIsValid !== '0' &&
              (user.uid === record.createBy || user.uid === tempValue.fdLoginName)
            "
            title="废弃动作会立即生效，是否确认废弃当前行数据?"
            @confirm="handleAbandonItem(record, index)"
          >
            <p-button-link>废弃</p-button-link>
          </p-popconfirm>
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
    addressDtoList: [],
  },
});

export default {
  name: 'address-list',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: {
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
    async handleSelectAddress(value) {
      const { addressComponent = {} } = (value[0] || {}).data || {};
      this.handleChangeAddress([
        // ToDo 把this.addressValue赋值给到要传过去的
        {
          ...this.addressValue,
          fdLongitude: Number(value[0].value.split(',')[0]),
          fdLatitude: Number(value[0].value.split(',')[1]),
          fdAdcode: addressComponent.adcode,
          fdProvince: addressComponent.province,
          fdCity: addressComponent.city.toString(),
          fdCounty: addressComponent.district.length > 0 ? addressComponent.district : '',
          fdStreet: addressComponent.township,
          fdDetailaddress: (value[0] || {}).text,
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
          await api.customer.postAddCustomerOfficeAddres(officeAddresAddParam);
          const data = await api.customer.getCustomerDetail(this.moduleId);
          this.tempValue = {
            ...data,
          };
          this.onOk();
        } catch (e) {
          console.error(e);
        }
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
        this.tempValue.addressDtoList[index] = {
          ...value,
          fdIsValid: '0',
        };
      }
      this.handleOk();
    },
    handleOk() {
      this.tempValue.addressDtoList = [...this.tempValue.addressDtoList];
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

<template>
  <p-modal
    :maskClosable="false"
    title="子单明细"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
  >
    <p-spin :spinning="loading">
      <p-form-model
        ref="form"
        :model="tempValue"
        :rules="formRules"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block theme="primary">
          <p-row :gutter="24">
            <p-col :span="6">
              <p-form-model-item label="方舟主单号:">
                <p-input v-model="tempValue.fdArkParentOrderNo" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="产品线:">
                <p-input v-model="tempValue.fdProductLineName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="要货客户:">
                <p-input v-model="tempValue.fdApplyCustomerName" readOnly />
              </p-form-model-item>
            </p-col>

            <p-col :span="6">
              <p-form-model-item label="收货人:">
                <p-input v-model="tempValue.fdAddrContactName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="方舟子单号:">
                <p-input v-model="tempValue.fdArkChildOrderNo" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="开单日期:">
                <p-input :value="formatDate(tempValue.fdOrderCreateDate)" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="结算客户:">
                <p-input v-model="tempValue.fdSettleCustomerName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="收货人电话:">
                <p-input v-model="tempValue.fdAddrMobile" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="CRM单号:">
                <p-input v-model="tempValue.fdCrmNo" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="分公司:">
                <p-input v-model="tempValue.fdCorporateName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="配货客户:">
                <p-input v-model="tempValue.fdShipCustomerName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="配送方式:">
                <!-- <p-input v-model="tempValue.fdShipType" readOnly /> -->
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_order_ship_type"
                  :value="
                    !!tempValue.fdShipType
                      ? [
                          {
                            value: tempValue.fdShipType,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="状态:">
                <!-- <p-input v-model="tempValue.fdStatus" readOnly /> -->
                <select-order-split-status
                  readOnly
                  :value="
                    !!tempValue.fdStatus
                      ? [
                          {
                            value: tempValue.fdStatus,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="业务员:">
                <p-input v-model="tempValue.fdSaleManName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="发货仓库:">
                <p-input v-model="tempValue.fdWarehouseName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="6">
              <p-form-model-item label="配送地址:">
                <p-input v-model="tempValue.fdShipAddrDetail" readOnly />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
      </p-form-model>

      <p-tabs>
        <p-tab-pane key="1" tab="产品信息">
          <product-info
            :orderProductListsDto="tempValue.orderProductListsDto"
            readOnly
            moduleFlag="cpms_project_order_main"
          />
        </p-tab-pane>
        <p-tab-pane key="2" tab="物流信息">
          <logistics-info
            :moduleId="moduleId"
            :logisticsId="tempValue.fdLogisticsId"
            readOnly
            moduleFlag="cpms_project_order_main"
          />
        </p-tab-pane>
        <p-tab-pane key="3" tab="出库信息">
          <deliver-info
            :moduleId="moduleId"
            readOnly
            moduleFlag="cpms_project_order_main"
          />
        </p-tab-pane>

        <p-tab-pane key="5" tab="查看日志">
          <view-log
            :moduleId="moduleId"
            :visible="visible"
            readOnly
            moduleFlag="cpms_project_order_main"
          />
        </p-tab-pane>
      </p-tabs>
    </p-spin>
    <span slot="footer">
      <p-button @click="onCancel">关 闭</p-button>
    </span>
  </p-modal>
</template>

<script>
import SelectOrderSplitStatus from '@/views/Order/components/select/order-split-status';
import api from '@/api';
import ProductInfo from './product-info';
import LogisticsInfo from './logistics-info';
import DeliverInfo from './deliver-info';
import ViewLog from './view-log';
import { buildSelectionMixin, userMixin, buildListMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdArkChildOrderNo: '',
    fdProductLineName: '',
    fdApplyCustomerName: '',
    fdAddrContactName: '',
    fdArkChildOrderNo: '',
    fdOrderCreateDate: '',
    fdSettleCustomerName: '',
    fdAddrMobile: '',
    fdCrmNo: '',
    fdCorporateName: '',
    fdShipCustomerName: '',
    fdShipType: '',
    fdStatus: '',
    fdLoginName: '',
    fdWarehouseName: '',
    fdShipAddrDetail: '',
  },
});

const reqMixin = buildListMixin({
  relation: ['moduleId', 'visible'],
  getData: async (_, query) => {
    const { moduleId, visible } = _;
    if (!moduleId || !visible) {
      _.tempValue = {};
      return {};
    }

    const res = await api.order.getOrderSplitByArkList(moduleId);
    _.tempValue = { ...res };

    return {};
  },
});

export default {
  name: 'order-detail',
  mixins: [selectionMixin, userMixin, reqMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SelectOrderSplitStatus,
    ProductInfo,
    LogisticsInfo,
    DeliverInfo,
    ViewLog,
  },
};
</script>

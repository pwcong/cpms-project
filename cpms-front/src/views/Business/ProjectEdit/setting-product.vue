<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <p-row :gutter="24">
        <p-col :span="12">
          <p-form-model-item label="产品线" prop="fdProductLineCode">
            <select-product-line
              :value="
                !!tempValue.fdProductLineCode
                  ? [
                      {
                        value: tempValue.fdProductLineCode,
                        text: tempValue.fdProductLineName,
                      },
                    ]
                  : []
              "
              placeholder="请选择"
              allow-clear
              @change="handleChangeProductLine"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="产品类型" prop="fdProductCategoryCode">
            <select-product-cate
              :value="
                !!tempValue.fdProductCategoryCode
                  ? [
                      {
                        value: tempValue.fdProductCategoryCode,
                        text: tempValue.fdProductCategoryName,
                      },
                    ]
                  : []
              "
              allow-clear
              placeholder="请选择"
              @change="handleChangeProductCate"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="产品型号" prop="fdProductId">
            <template v-if="tempValue.fdProductCategoryCode === '完全定制化'">
              <p-input placeholder="请输入" v-model="tempValue.fdProductName" read-only />
            </template>
            <template v-else>
              <select-product
                :productLineCode="tempValue.fdProductLineCode"
                :value="
                  !!tempValue.fdProductId
                    ? [
                        {
                          value: tempValue.fdProductId,
                          text: tempValue.fdProductName,
                        },
                      ]
                    : []
                "
                allow-clear
                placeholder="请选择"
                @change="handleChangeProduct"
              />
            </template>
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="产品编码">
            <p-input readOnly v-model="tempValue.fdProductId" />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="数量" prop="fdNum">
            <p-input-number
              style="width: 100%"
              placeholder="请输入"
              v-model="tempValue.fdNum"
              @change="calcTotalCum"
              :min="0"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="预计销售单价(元)" prop="fdPrice">
            <p-input-number
              style="width: 100%"
              placeholder="请输入"
              v-model="tempValue.fdPrice"
              @change="calcTotalCum"
              :min="0"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="预售总金额(元)" prop="fdTotalSum">
            <p-input
              style="width: 100%"
              placeholder="请输入"
              read-only
              :value="tempValue.fdTotalSum"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="预出货日期" prop="fdShippingDate">
            <p-date-picker v-model="tempValue.fdShippingDate" valueFormat="YYYY-MM-DD" />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="备注/定制说明" prop="fdRemake">
            <p-textarea
              v-model="tempValue.fdRemake"
              placeholder="请输入"
              :maxLength="500"
              :autoSize="{
                minRows: 4,
              }"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="12">
          <p-form-model-item label="定制费承担方" prop="fdCustomFeeBearer">
            <select-fee-bearer
              :value="
                !!tempValue.fdCustomFeeBearer
                  ? [
                      {
                        value: tempValue.fdCustomFeeBearer,
                        text: tempValue.fdCustomFeeBearer,
                      },
                    ]
                  : []
              "
              placeholder="请选择"
              allow-clear
              @change="tempValue.fdCustomFeeBearer = ($event[0] || {}).value"
            />
          </p-form-model-item>
        </p-col>
      </p-row>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';

import SelectProductLine from '@/views/components/select/product-line';
import SelectProduct from '@/views/components/select/product';
import SelectProductCate from '../components/select/product-cate';
import SelectFeeBearer from '../components/select/fee-bearer';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineCode: '',
    fdProductLineName: '',
    fdProductCategoryCode: '',
    fdProductCategoryName: '',
    fdProductId: '',
    fdProductName: '',
    fdCustomFeeBearer: '',
    fdIsValid: '1',
  },
});

export default {
  name: 'setting-product',
  mixins: [selectionMixin, formatMixin],
  components: {
    SelectProductLine,
    SelectProductCate,
    SelectProduct,
    SelectFeeBearer,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}产品信息`;
    },
    rules() {
      const { fdProductCategoryName } = this.tempValue;

      return {
        fdProductLineCode: [
          {
            required: true,
            message: '请选择产品线',
            trigger: 'change',
          },
        ],
        fdProductCategoryCode: [
          {
            required: true,
            message: '请选择产品类型',
            trigger: 'change',
          },
        ],
        fdProductId: [
          {
            required: true,
            message: '请选择产品型号',
            trigger: 'change',
          },
        ],
        fdNum: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur',
          },
        ],
        fdPrice: [
          {
            required: true,
            message: '请输入预计销售单价',
            trigger: 'blur',
          },
        ],
        fdShippingDate: [
          {
            required: true,
            message: '请选择预出货日期',
            trigger: 'change',
          },
        ],
        fdRemake: [
          {
            required:
              ['标准产品定制化', '完全定制化'].indexOf(fdProductCategoryName) > -1,
            message: '请输入备注/定制说明',
            trigger: 'blur',
          },
        ],
        fdCustomFeeBearer: [
          {
            required:
              ['标准产品定制化', '完全定制化'].indexOf(fdProductCategoryName) > -1,
            message: '请选择定制费承担方',
            trigger: 'change',
          },
        ],
      };
    },
  },
  methods: {
    calcTotalCum() {
      const { fdNum, fdPrice } = this.tempValue;

      this.tempValue = {
        ...this.tempValue,
        fdTotalSum: this.getAmount((fdNum || 0) * (fdPrice || 0)),
      };
    },
    async handleChangeProductCate(res) {
      this.tempValue.fdProductCategoryCode = (res[0] || {}).value;
      this.tempValue.fdProductCategoryName = (res[0] || {}).text;

      if (this.tempValue.fdProductCategoryCode === '完全定制化') {
        const data = await api.basedata
          .getProductList({
            limit: 200,
            pageNo: 1,
            fdIsDingzhihua: '1',
          })
          .then((res) => res.data || []);
        this.tempValue.fdProductId = (data[0] || {}).fdProductSku;
        this.tempValue.fdProductName = (data[0] || {}).fdProductName;
      } else {
        if (this.tempValue.fdProductName === '自定义产品') {
          this.tempValue.fdProductId = '';
          this.tempValue.fdProductName = '';
        }
      }
    },
    handleChangeProductLine(res) {
      this.tempValue.fdProductLineCode = (res[0] || {}).value;
      this.tempValue.fdProductLineName = (res[0] || {}).text;
      this.tempValue.fdProductId = '';
      this.tempValue.fdProductName = '';
      this.tempValue.fdProductCategoryCode = '';
      this.tempValue.fdProductCategoryName = '';
    },
    handleChangeProduct(res) {
      this.tempValue.fdProductId = (res[0] || {}).value;
      this.tempValue.fdProductName = (res[0] || {}).text;
      this.tempValue.fdProductLineCode = (res[0] || {}).fdProductLineCode;
      this.tempValue.fdProductLineName = (res[0] || {}).fdProductLineName;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.onOk();
      });
    },
  },
};
</script>

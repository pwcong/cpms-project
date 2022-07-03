<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="600px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <p-form-model-item label="项目施工地址" prop="fdDetailAddress">
        <p-input
          v-model="tempValue.fdDetailAddress"
          read-only
          placeholder="请选择"
          @click="showMap = true"
        >
        </p-input>
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>

    <selection-amap :visible.sync="showMap" @change="handleSelectAddress" />
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdDetailAddress: '',
  },
});

export default {
  name: 'setting-party',
  mixins: [selectionMixin],
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
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}项目地址`;
    },
    rules() {
      return {
        fdDetailAddress: [
          {
            required: true,
            message: '请选择项目施工地址',
            trigger: 'change',
          },
        ],
      };
    },
  },
  data() {
    return {
      showMap: false,
    };
  },
  methods: {
    handleSelectAddress(res) {
      res = res[0];
      if (!res) {
        return;
      }

      const { data = {}, text, value } = res;

      const {
        province = '',
        city = '',
        district = '',
        township = '',
        adcode,
      } = data.addressComponent || {};

      this.tempValue.fdProvince = typeof province === 'string' ? province : '';
      this.tempValue.fdCity = typeof city === 'string' ? city : '';
      this.tempValue.fdCounty = typeof district === 'string' ? district : '';
      this.tempValue.fdStreet = typeof township === 'string' ? township : '';
      this.tempValue.fdDetailAddress = text;
      this.tempValue.fdLongitude = Number(value.split(',')[0]);
      this.tempValue.fdLatitude = Number(value.split(',')[1]);
      this.tempValue.fdAdcode = adcode;
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        const t = this.list.findIndex(
          (d) => d.fdDetailAddress === this.tempValue.fdDetailAddress
        );

        // 地址新增不能重复
        if (
          (this.mode === 'add' && t > -1) ||
          (this.mode === 'edit' && t !== this.index)
        ) {
          if (t > -1) {
            this.$message.error('当前地址已存在，请选择其他地址');
            return;
          }
        }

        // 若ID存在数据变更需请求接口
        // if (!!this.moduleId) {
        //   try {
        //     const data = await api.business.postProjectAddressForm({
        //       ...this.tempValue,
        //       fdMainId: this.moduleId,
        //     });

        //     this.tempValue = {
        //       ...this.tempValue,
        //       id: data.id,
        //     };

        //     this.onOk();
        //   } catch (e) {
        //     console.error(e);
        //   }
        // } else {
        //   this.onOk();
        // }

        this.onOk();
      });
    },
  },
};
</script>

<template>
  <p-modal
    :maskClosable="false"
    title="拜访人"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <!-- <div>
      <p-switch-form :col="1" :model="query">
        <p-switch-form-item label="关键字">
          <p-input v-model="query.keyword" placeholder="请输入" />
        </p-switch-form-item>
        <template slot="button">
          <p-button type="primary" @click="onRefresh(false)" icon="search" />
        </template>
      </p-switch-form>
    </div> -->
    <div>
      <p-table
        :scroll="{ x: true }"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: tempValue.map((d) => d.name),
          onChange: onSelectChange,
        }"
        rowKey="name"
        :loading="loading"
        :columns="[
          {
            title: '姓名',
            dataIndex: 'name',
          },

          {
            title: '电话',
            dataIndex: 'phone',
          },
          {
            title: '职务',
            dataIndex: 'position',
          },
        ]"
        :data-source="list"
        bordered
        :pagination="pagination"
        @change="
          (pagination.current = $event.current) && (pagination.pageSize = $event.pageSize)
        "
      >
      </p-table>
    </div>
    <span slot="footer">
      <div style="text-align: right">
        <div>
          <p-button @click="onCancel">取 消</p-button>
          <p-button type="primary" :disabled="tempValue.length <= 0" @click="onOk()">
            确 定
          </p-button>
        </div>
      </div>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  getData: (_, query) => {
    const { fdVisitType, fdModuleTypeId } = _;

    if (!fdVisitType || !fdModuleTypeId) {
      return Promise.resolve({
        data: [],
      });
    }

    if (fdVisitType == 'cust') {
      return api.customer.getCustomerDetail(fdModuleTypeId).then((res) => {
        return {
          data: (res.contactDtoList || []).map((d) => ({
            name: d.fdContactName,
            phone: d.fdContactMobile || d.fdContactPhone,
            position: d.fdContactPost,
          })),
        };
      });
    } else if (fdVisitType == 'clue') {
      return api.clue.getClueDetail(fdModuleTypeId).then((res) => {
        return {
          data: (res.otherContacts || []).map((d) => ({
            name: d.fdContactName,
            phone: d.fdContactPhone,
            position: '',
          })),
        };
      });
    } else if (fdVisitType == 'project') {
      return api.business.getProjectDetail(fdModuleTypeId).then((res) => {
        return {
          data: (res.stakeholderListDtoList || []).map((d) => ({
            name: d.fdName,
            phone: d.fdMobile,
            position: d.fdPosition,
          })),
        };
      });
    }
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-visitor',
  mixins: [selectionMixin, listMixin],
  props: {
    fdVisitType: {
      type: String,
      default: '',
    },
    fdModuleTypeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      },
    };
  },
  watch: {
    fdModuleTypeId(v) {
      this.onRefresh();
    },
    fdVisitType(v) {
      this.onRefresh();
    },
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      const key = selectedRowKeys.pop();

      if (!!key) {
        this.tempValue = this.list.filter((d) => key === d.name);
      } else {
        this.tempValue = [];
      }
    },
  },
};
</script>

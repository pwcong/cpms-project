<template>
  <block title="项目所在地" class="site-list" theme="primary">
    <template v-slot:title>
      <div>
        <span>项目所在地</span>
        <span style="font-size: 12px; color: #e50113">
          （注：项目名称根据项目主所在地自动生成，因此项目所在地中必须有一个主所在地）
        </span>
      </div>
    </template>
    <template v-slot:action>
      <p-button
        type="primary"
        v-show="!readOnly && !hasMain"
        @click="handleAddItem(true)"
      >
        新增主所在地
      </p-button>
      <p-button type="primary" v-show="!readOnly && hasMain" @click="handleAddItem()">
        新增所在地
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :pagination="false"
      :columns="
        [
          {
            title: '序号',
            width: 50,
            dataIndex: 'index',
            customRender: (text, record, index) => `${index + 1}`,
          },
          {
            title: '省市',
            dataIndex: 'site',
            scopedSlots: { customRender: 'site' },
          },
          {
            title: '是否主所在地',
            dataIndex: 'fdIsMain',
            customRender: (text, record) => (record.fdIsMain === '1' ? '是' : '否'),
          },
          {
            title: '是否跨区',
            dataIndex: 'fdIsRegion',
            customRender: (text, record) => (record.fdIsRegion === '1' ? '是' : '否'),
          },
          {
            title: '商务中心',
            dataIndex: 'fdBusinessName',
          },
        ].concat(
          readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 120,
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      "
      :data-source="tempValue.projectSites"
      bordered
    >
      <template slot="site" slot-scope="text, record">
        {{ record | formatSite }}
        <p-tag color="blue" v-if="record.fdIsMain === '1'" style="margin-left: 8px">
          项目主所在地
        </p-tag>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEditItem(record, index)"> 编辑 </p-button-link>
          <p-button-link
            v-if="
              record.fdIsMain !== '1' &&
              record.fdEntireCountry !== '1' &&
              !!record.fdProvince &&
              !!record.fdCity
            "
            @click="handleToMain(record, index)"
          >
            转主所在地
          </p-button-link>
          <p-popconfirm
            title="是否确认删除当前行数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link> 删除 </p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>

    <setting-site
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      :settingData="tempValue.projectSites"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingSite from './setting-site';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'site-list',
  mixins: [selectionMixin],
  components: {
    SettingSite,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  computed: {
    hasMain() {
      const t = this.tempValue.projectSites.filter((d) => d.fdIsMain === '1').length > 0;
      return t;
    },
  },
  methods: {
    handleAddItem(isMain) {
      this.handleEditItem(
        {
          fdIsMain: isMain ? '1' : '0',
          fdEntireCountry: '0',
        },
        -1
      );
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleToMain(value, index) {
      const oldIndex = this.tempValue.projectSites.findIndex((d) => d.fdIsMain === '1');

      if (oldIndex > -1) {
        this.tempValue.projectSites[oldIndex].fdIsMain = '0';
        this.tempValue.projectSites[index].fdIsMain = '1';
        this.handleOk();
      }
    },
    handleOk() {
      this.tempValue.projectSites = [...this.tempValue.projectSites].sort((a, b) => {
        if (a.fdIsMain === '1') {
          return -1;
        }

        return 1;
      });
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.projectSites.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.projectSites[this.itemIndex] = value;
      } else {
        this.tempValue.projectSites.push(value);
      }
      this.handleOk();
    },
  },
  filters: {
    formatSite(v) {
      const { fdEntireCountry, fdProvinceName = '', fdCityName = '' } = v;

      if (fdEntireCountry === '1') {
        return '全国';
      }

      if (!!fdProvinceName && !!fdCityName) {
        return `${fdProvinceName}${fdCityName}`;
      }

      return fdProvinceName;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.site-list {
  .tips {
    color: $theme-color;
  }
}
</style>

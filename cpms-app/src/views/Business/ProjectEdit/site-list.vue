<template>
  <block theme="primary" title="项目所在地">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.projectSites.length > 0">
          <thead>
            <th>序号</th>
            <th>省市</th>
            <th>是否主所在地</th>
            <th>是否跨区</th>
            <th>商务中心</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.projectSites" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item | formatSite }}</td>
              <td>{{ item.fdIsMain === '1' ? '是' : '否' }}</td>
              <td>{{ item.fdIsRegion === '1' ? '是' : '否' }}</td>
              <td>
                <div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                  {{ item.fdBusinessName }}
                </div>
              </td>
              <td v-if="!readonly">
                <van-button type="primary" size="mini" native-type="button" @click="handleEditItem(item, index)">
                  编辑
                </van-button>
                <van-button
                  type="primary"
                  size="mini"
                  native-type="button"
                  v-if="item.fdIsMain !== '1' && item.fdEntireCountry !== '1' && !!item.fdProvince && !!item.fdCity"
                  @click="handleToMain(item, index)"
                >
                  转主所在地
                </van-button>
                <van-button type="danger" size="mini" native-type="button" @click="handleDelItem(item, index)">
                  删除
                </van-button>
              </td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
      <div class="table-footer" v-if="!readonly">
        <van-button
          plain
          block
          type="danger"
          icon="plus"
          size="mini"
          native-type="button"
          v-if="!hasMain"
          @click="handleAddItem(true)"
        >
          新增主所在地
        </van-button>
        <van-button
          plain
          block
          type="danger"
          icon="plus"
          size="mini"
          native-type="button"
          v-if="hasMain"
          @click="handleAddItem()"
        >
          新增所在地
        </van-button>
      </div>
    </div>

    <setting-site :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingSite from './setting-site';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    projectSites: [],
  },
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
    handleOk() {
      this.tempValue.projectSites = [...this.tempValue.projectSites];
      this.onOk();
    },
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
    handleDelItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认删除该行数据?',
        })
        .then(async () => {
          this.tempValue.projectSites.splice(index, 1);
          this.handleOk();
        });
    },
    handleToMain(value, index) {
      const oldIndex = this.tempValue.projectSites.findIndex((d) => d.fdIsMain === '1');

      if (oldIndex > -1) {
        this.tempValue.projectSites[oldIndex].fdIsMain = '0';
        this.tempValue.projectSites[index].fdIsMain = '1';
        this.handleOk();
      }
    },
    handleChangeItem(value) {
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
@import '@/assets/scss/table.scss';
</style>

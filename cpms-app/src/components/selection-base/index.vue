<template>
  <van-popup
    :get-container="selectionContainer"
    class="selection-base-wrapper"
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
  >
    <list-layout class="selection-base">
      <template v-slot:header="{ className }">
        <van-nav-bar :class="className" :title="title" left-text="取消" left-arrow @click-left="onCancel">
          <template #right>
            <div style="color: white">
              <span
                v-for="(action, index) in actions"
                :key="index"
                style="margin-right: 10px"
                @click="handleAction(action)"
              >
                {{ action.text }}
              </span>
              <span @click="tempValue = []" v-if="!!tempValue.length && allowClear" style="margin-right: 10px">
                清空
              </span>
              <span @click="onOk">
                {{ `确定${!!tempValue.length ? `(${tempValue.length})` : ''}` }}
              </span>
            </div>
          </template>
        </van-nav-bar>
      </template>

      <template v-slot:toolbar="{ className }" v-if="searchable || expandable">
        <div :class="className" style="top: 46px">
          <van-search v-if="searchable" v-model="query.keyword" :placeholder="placeholder" />
          <div class="paths" v-if="expandable && !query.keyword">
            <div class="paths-wrapper">
              <div class="path path--tip">{{ expandTip }}:</div>

              <div
                :class="{
                  path: true,
                  'path--root': true,
                  'path--active': paths.length === 0,
                }"
                @click="handlePath({}, -1)"
              >
                {{ expandRoot }}
              </div>
              <div
                v-for="(path, index) in paths"
                :key="index"
                :class="{
                  path: true,
                  'path--active': paths.length - 1 === index,
                }"
                @click="handlePath(path, index)"
              >
                {{ getText(path) }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:main="{ className }">
        <van-pull-refresh
          :class="className"
          :value="loading && !loadingMore"
          @refresh="onRefresh"
          :style="{
            top: `${toolbarHeight}px`,
            height: `calc(100% - ${toolbarHeight}px)`,
          }"
        >
          <van-list :value="loadingMore" :finished="!hasMore" finished-text="没有更多了" @load="onLoadMore">
            <div class="list">
              <div
                :class="{
                  item: true,
                  'item--expandable': expandable && !query.keyword,
                }"
                v-for="(item, index) in targetOptions"
                :key="index"
                @click="handleChange(item)"
              >
                <div class="item-main">
                  <slot name="item" :value="item" :index="index" :checked="isChecked(item)">
                    <div class="item-wrapper">
                      <div class="checkbox">
                        <van-checkbox :value="isChecked(item)" />
                      </div>
                      <div class="text">
                        {{ getText(item) }}
                      </div>
                    </div>
                  </slot>
                </div>
                <div class="item-expander" v-if="expandable && !query.keyword" @click.stop="handleExpand(item)">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-base',
  mixins: [selectionMixin],
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索关键词',
    },
    searchable: {
      type: Boolean,
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '选择',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    expandTip: {
      type: String,
      default: '层级',
    },
    expandRoot: {
      type: String,
      default: '顶部',
    },
    options: {
      type: Array,
    },
    getOptions: {
      type: Function,
    },
    getOption: {
      type: Function,
      default: (_, option) => Promise.resolve(option),
    },
    getText: {
      type: Function,
      default: (option) => option.label || option.text,
    },
    actions: {
      type: Array,
      default: () => [
        // {
        //   text: '',
        //   func: (_) => {
        //     // TODO
        //   },
        // },
      ],
    },
  },
  data() {
    return {
      paths: [],
    };
  },
  computed: {
    toolbarHeight() {
      return 46 + (this.searchable ? 54 : 0) + (this.expandable && !this.query.keyword ? 32 : 0);
    },
    targetOptions() {
      if (!!this.options) {
        return this.options.filter((o) => (!!this.query.keyword ? o.text.indexOf(this.query.keyword) > -1 : true));
      } else if (!!this.getOptions) {
        return this.list;
      } else {
        return [];
      }
    },
  },
  methods: {
    async handleChange(item) {
      item = await this.getOption(this, item);

      if (this.isChecked(item)) {
        this.tempValue = this.tempValue.filter((d) => d.value !== item.value);
      } else {
        if (this.multiple) {
          this.tempValue = this.tempValue.concat(item);
        } else {
          this.tempValue = [item];
        }
      }
    },
    isChecked(item) {
      return this.tempValue.findIndex((d) => d.value === item.value) > -1;
    },
    handleAction(action) {
      !!action.func && action.func(this);
    },
    async handleExpand(item) {
      item = await this.getOption(this, item);
      this.paths.push(item);
      this.query.parent = item;
    },
    handlePath(item, index) {
      if (index === -1) {
        this.paths = [];
      } else {
        this.paths = this.paths.slice(0, index + 1);
      }
      this.query.parent = item;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.selection-base {
  .list {
    padding: 0 14px;
  }

  .paths {
    overflow-x: auto;
    &-wrapper {
      font-size: 0;
      white-space: nowrap;
    }

    .path {
      height: 32px;
      display: inline-block;
      padding: 0 8px;
      line-height: 32px;
      font-size: 12px;
      vertical-align: middle;
      position: relative;
      user-select: none;

      &--tip {
        color: #666666;
      }

      &--active {
        color: $theme-color;
      }

      &:not(:last-child):not(:first-child) {
        padding-right: 20px;
        color: #999999;

        &::after {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          position: absolute;
          content: '>';
        }
      }
    }
  }

  .item {
    border-bottom: 1px solid #eeeeee;
    position: relative;

    &--expandable {
      padding-right: 50px;
    }

    &-expander {
      position: absolute;
      right: 0;
      top: 0;
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .item-wrapper {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .checkbox {
      .van-checkbox {
        margin-right: 12px;
        border-bottom: none;
      }
    }
    .text {
      flex: 1;
      font-size: 14px;
    }
  }
}
</style>

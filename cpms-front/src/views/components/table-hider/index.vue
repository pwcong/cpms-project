<template>
  <div class="table-hider">
    <div class="table-hider-main">
      <div class="table-hider-all">
        <p-checkbox
          :indeterminate="selectedKeys.length > 0 && selectedKeys.length < options.length"
          :checked="options.length > 0 && selectedKeys.length === options.length"
          @change="handleAll"
        >
          全选
        </p-checkbox>
        <span>显示列</span>
      </div>

      <div class="table-hider-options">
        <draggable :value="options" @start="onStart" @end="onEnd" :animation="300">
          <div
            class="table-hider-option"
            v-for="(item, index) in options"
            :key="index"
            @click.stop="handleToggle(item)"
          >
            <p-checkbox :checked="!!selectedKeysMap[item.key]">
              {{ item.title }}
            </p-checkbox>
          </div>
        </draggable>
      </div>
    </div>

    <div class="table-hider-bottom" v-if="allowSubmit">
      <p-button @click="handleCancel" size="small"> 取消 </p-button>
      <p-button
        style="margin-left: 8px"
        @click="handleSubmit"
        type="primary"
        size="small"
      >
        确定
      </p-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { buildSelectionMixin } from '@/mixins';
import draggable from 'vuedraggable';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'table-hider',
  mixins: [selectionMixin],
  components: { draggable },
  data() {
    return {
      allowSubmit: false,
      dragStart: false,
    };
  },
  computed: {
    options() {
      return Object.keys(this.tempValue)
        .map((k) => ({
          ...this.tempValue[k],
          disabled: false,
        }))
        .sort((a, b) => {
          switch (true) {
            case a.order > b.order:
              return 1;
            case a.order < b.order:
              return -1;
            default:
              return 0;
          }
        });
    },
    selectedKeys() {
      // 过滤每一项数据，拿到数组里每一项的key值形成一个新的数组
      return this.options.filter((d) => !d.hidden).map((d) => d.key);
    },
    selectedKeysMap() {
      return this.selectedKeys.reduce((p, c) => {
        p[c] = true;
        return p;
      }, {});
    },
  },
  methods: {
    onStart() {
      this.dragStart = true;
    },
    onEnd(event) {
      if (!this.dragStart) {
        return;
      }

      this.allowSubmit = true;
      let { newIndex, oldIndex } = event;

      let newOptions = [];

      this.options.forEach((d, i) => {
        if (i === oldIndex) {
          return;
        }

        if (newIndex >= oldIndex) {
          newOptions.push(d);
        }

        if (i === newIndex) {
          newOptions.push(this.options[oldIndex]);
        }

        if (newIndex < oldIndex) {
          newOptions.push(d);
        }
      });

      newOptions = newOptions.map((d, i) => ({
        ...d,
        order: i,
      }));

      this.tempValue = newOptions.reduce((p, c) => {
        p[c.key] = c;
        return p;
      }, {});

      this.dragStart = false;
    },
    handleCancel() {
      this.allowSubmit = false;
      this.tempValue = this.value;
    },
    handleSubmit() {
      this.allowSubmit = false;
      this.onOk();
    },
    handleAll(e) {
      const checked = e.target.checked;
      if (checked) {
        this.handleChange(this.options.map((d) => d.key));
      } else {
        this.handleChange([]);
      }
    },
    handleToggle: _.debounce(function (item) {
      const targetKeys = this.selectedKeys
        .filter((k) => k !== item.key)
        .concat(!!this.selectedKeysMap[item.key] ? [] : [item.key]);
      this.handleChange(targetKeys);
    }, 100),
    handleChange(selectedKeys) {
      this.allowSubmit = true;

      const selectedKeysMap = (selectedKeys || []).reduce((p, c) => {
        //selectedKeys是过滤后的key值数组，现在转对象，给每个key值一个true
        p[c] = true;
        return p;
      }, {});

      const newValue = this.options
        .map((d) => ({
          ...d,
          hidden: !selectedKeysMap[d.key],
        }))
        .reduce((p, c) => {
          p[c.key] = c;
          return p;
        }, {});

      this.tempValue = newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.table-hider {
  // padding: 8px;
  background-color: white;

  &-main {
    padding: 8px;
    border: 1px solid #dddddd;
    border-radius: 3px;
  }

  &-all {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #dddddd;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  &-options {
    max-height: 200px;
    overflow-y: auto;
  }

  &-option {
    user-select: none;
    background-color: #fdfdfd;
    cursor: move;
    width: 200px;
    cursor: move;

    &:hover {
      background-color: #f1f1f1;
      cursor: move;
    }

    .poros-checkbox-wrapper {
      padding: 2px 0;
      display: block;
    }
  }

  &-bottom {
    margin-top: 8px;
    text-align: right;
  }
}
</style>

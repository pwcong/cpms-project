<template>
  <block class="follow-form">
    <p-form-model
      class="follow-form-wrapper"
      v-if="components.length > 0"
      ref="form"
      :rules="readOnly ? undefined : rules"
      :model="tempValue"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <p-row :gutter="24">
        <p-col
          :span="item.fdComponentType === 'multipleText' ? 24 : 8"
          v-for="(item, index) in components"
          :key="index"
        >
          <p-form-model-item :label="item.fdComponentName" :prop="item.id">
            <template v-if="item.fdComponentType === 'singleText'">
              <p-input
                :maxLength="200"
                :readOnly="readOnly"
                :value="tempValue[item.id]"
                @input="handleChangeItem($event.target.value, item.id)"
                :placeholder="readOnly ? undefined : item.fdComponentInputPrompt"
              >
                <template v-if="item.fdComponentOtherPrompt" slot="suffix">
                  <p-tooltip placement="top">
                    <template slot="title">
                      <span>
                        {{ item.fdComponentOtherPrompt }}
                      </span>
                    </template>
                    <p-icon style="color: #999999" type="info-circle" />
                  </p-tooltip>
                </template>
              </p-input>
            </template>
            <template v-if="item.fdComponentType === 'multipleText'">
              <p-textarea
                :readOnly="readOnly"
                :value="tempValue[item.id]"
                @input="handleChangeItem($event.target.value, item.id)"
                :placeholder="readOnly ? undefined : item.fdComponentInputPrompt"
                :maxLength="500"
                :autoSize="{
                  minRows: 4,
                }"
              >
                <template v-if="item.fdComponentOtherPrompt" slot="suffix">
                  <p-tooltip placement="top">
                    <template slot="title">
                      <span>
                        {{ item.fdComponentOtherPrompt }}
                      </span>
                    </template>
                    <p-icon style="color: #999999" type="info-circle" />
                  </p-tooltip>
                </template>
              </p-textarea>
            </template>
            <template v-if="item.fdComponentType === 'att'">
              <uploader
                multiple
                :readOnly="readOnly"
                :value="tempValue[item.id]"
                @input="handleChangeItem($event, item.id)"
              />
            </template>
            <template v-if="item.fdComponentType === 'process'">
              <template v-if="(tempValue[item.id] || []).length <= 0">
                <span v-if="readOnly" style="color: #999999"> &lt; 无 &gt; </span>
              </template>
              <template v-else>
                <div class="process-list">
                  <div
                    v-for="(_item, _index) in tempValue[item.id] || []"
                    :key="_index"
                    class="process-item"
                    @click="handleProcess({ ...item, ..._item }, 'view')"
                  >
                    {{ _item.text }}
                  </div>
                </div>
              </template>
              <div v-if="!readOnly" style="font-size: 0">
                <p-button
                  size="small"
                  @click="handleProcess(item, 'create')"
                  type="primary"
                >
                  新建流程
                </p-button>
              </div>
            </template>
            <template v-if="item.fdComponentType === 'textDisplay'">
              <span style="color: #333333">
                {{ item.fdDisplay }}
              </span>
            </template>
            <template v-if="item.fdComponentType === 'dropDown'">
              <select-dict
                :readOnly="readOnly"
                systemCode="cpms"
                :dictCode="item.fdDropDown"
                :value="
                  (tempValue[item.id] || '')
                    .split(',')
                    .filter((v) => !!v)
                    .map((v) => ({
                      value: v,
                    }))
                "
                :placeholder="readOnly ? undefined : '请选择'"
                allow-clear
                :multiple="item.fdIsMultipleChoice === '1'"
                @input="handleChangeItem($event.map((d) => d.value).join(','), item.id)"
              />
            </template>
          </p-form-model-item>
        </p-col>
      </p-row>
    </p-form-model>

    <!-- <div v-else style="text-align: center; padding: 12px">
      <p-empty />
    </div> -->
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'follow-form',
  mixins: [selectionMixin],
  props: {
    rules: {
      type: Object,
      default: () => {},
    },
    components: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleChangeItem(value, id) {
      this.tempValue[id] = value;
      this.onOk();
    },
    handleProcess(item, action) {
      const { fdMainId, fdProcessId, value } = item;

      switch (fdProcessId) {
        case 'authorizationApplication':
          if (action === 'view') {
            this.$router.push({
              path: `/Business/Grant/GrantDetail/${value}`,
            });
          }
          if (action === 'create') {
            this.$router.push({
              path: '/Business/Grant/GrantCreate',
              query: {
                source: 'project',
                targetId: fdMainId,
              },
            });
          }
          break;
        case 'ContractContract':
          if (action === 'view') {
            this.$router.push({
              path: `/Business/Contract/ContractDetail/${value}`,
            });
          }
          if (action === 'create') {
            this.$router.push({
              path: '/Business/Contract/ContractCreate',
              query: {
                source: 'project',
                targetId: fdMainId,
              },
            });
          }
          break;
        case 'priceApplication':
          if (action === 'view') {
            this.$router.push({
              path: `/Business/Price/PriceDetail/${value}`,
            });
          }
          if (action === 'create') {
            this.$router.push({
              path: '/Business/Price/PriceCreate',
              query: {
                source: 'project',
                targetId: fdMainId,
              },
            });
          }
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.follow-form {
  margin: 16px 0;
  &-wrapper {
    padding: 16px;
    border-radius: 3px;
    border: 1px solid $theme-color;
  }
  .process-item {
    cursor: pointer;
    color: $theme-color;
    line-height: 1;
    padding: 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

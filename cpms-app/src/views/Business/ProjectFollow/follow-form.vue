<template>
  <van-form class="follow-form" ref="form">
    <block>
      <template v-for="(item, index) in components">
        <template v-if="item.fdComponentType === 'singleText'">
          <van-field
            v-bind="getCommonProps(item)"
            :key="index"
            :value="tempValue[item.id]"
            :placeholder="readonly ? undefined : item.fdComponentInputPrompt"
            :readonly="readonly"
            @input="handleChangeItem($event.target.value, item.id)"
          />
        </template>

        <template v-if="item.fdComponentType === 'multipleText'">
          <van-field
            v-bind="getCommonProps(item)"
            :key="index"
            :readonly="readonly"
            :value="tempValue[item.id]"
            type="textarea"
            :placeholder="readonly ? undefined : item.fdComponentInputPrompt"
            @input="handleChangeItem($event.target.value, item.id)"
          />
        </template>

        <template v-if="item.fdComponentType === 'att'">
          <van-field
            v-bind="getCommonProps(item)"
            :value="(tempValue[item.id] || []).map((d) => d.value).join(',')"
            :key="index"
            readonly
          >
            <uploader
              mode="file"
              slot="input"
              multiple
              :readonly="readonly"
              :value="tempValue[item.id]"
              @input="handleChangeItem($event, item.id)"
            />
          </van-field>
        </template>

        <template v-if="item.fdComponentType === 'process'">
          <van-field
            v-bind="getCommonProps(item)"
            :key="index"
            readonly
            :value="(tempValue[item.id] || []).map((d) => d.value).join(',')"
          >
            <template #input>
              <div>
                <template v-if="(tempValue[item.id] || []).length <= 0">
                  <span v-if="readonly" style="color: #999999"> &lt; 无 &gt; </span>
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
                <div v-if="!readonly" style="font-size: 0">
                  <van-button @click="handleProcess(item, 'create')" type="danger" size="mini"> 新建流程 </van-button>
                </div>
              </div>
            </template>
          </van-field>
        </template>

        <template v-if="item.fdComponentType === 'textDisplay'">
          <van-field v-bind="getCommonProps(item)" :key="index" :value="item.fdDisplay" type="textarea" readonly />
        </template>

        <template v-if="item.fdComponentType === 'dropDown'">
          <div :key="index">
            <van-field
              v-bind="getCommonProps(item)"
              :value="tempValue[item.id]"
              readonly
              :is-link="!readonly"
              :clickable="!readonly"
              @click="!readonly && (visibles[item.id] = true)"
            >
              <template #input>
                <dict-text
                  :placeholder="!readonly ? '请选择' : undefined"
                  :value="(tempValue[item.id] || '').split(',').filter((v) => !!v)"
                  systemCode="cpms"
                  :dictCode="item.fdDropDown"
                />
              </template>
            </van-field>

            <selection-dict
              systemCode="cpms"
              :dictCode="item.fdDropDown"
              searchable
              :value="
                (tempValue[item.id] || '')
                  .split(',')
                  .filter((v) => !!v)
                  .map((v) => ({
                    value: v,
                  }))
              "
              :title="`选择${item.fdComponentName}`"
              :visible.sync="visibles[item.id]"
              :multiple="item.fdIsMultipleChoice === '1'"
              @change="handleChangeItem($event.map((d) => d.value).join(','), item.id)"
            />
          </div>
        </template>
      </template>
    </block>
  </van-form>
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
      default: () => ({}),
    },
    components: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visibles: {},
    };
  },
  watch: {
    components(v) {
      this.visibles = v.reduce((p, c) => {
        p[c.id] = false;
        return p;
      }, {});
    },
  },
  methods: {
    getCommonProps(item) {
      return {
        name: item.id,
        label: item.fdComponentName,
        required: !this.readonly && ((this.rules[item.id] || [])[0] || {}).required,
        rules: !this.readonly ? this.rules[item.id] : undefined,
      };
    },
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
  .process-list {
    width: 100%;
  }
  .process-item {
    font-size: 12px;
    line-height: 14px;
    max-width: 100%;
    margin-bottom: 4px;
    cursor: pointer;
    color: $theme-color;
  }
}
</style>

<template>
  <p-modal
    title="常见问题"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
    :footer="false"
  >
    <p-collapse v-if="list.length > 0" class="issue-list">
      <p-collapse-panel class="issue" v-for="(item, index) in list" :key="index">
        <template #header>
          <div class="issue-desc">
            <span>[问题{{ index + 1 }}]</span>
            <span>
              {{ item.fdDesc }}
            </span>
          </div>
        </template>

        <template>
          <div class="issue-pic" v-if="(item.picList || []).length > 0">
            <img
              style="max-width: 100%; max-height: 100%"
              :key="_index"
              v-for="(pic, _index) in item.picList || []"
              :src="pic.path"
            />
          </div>
          <div class="issue-res">
            <span>解决方案:</span>
            <span>
              {{ item.fdHandleResult }}
            </span>
          </div>
        </template>
      </p-collapse-panel>
    </p-collapse>

    <p-empty v-else />
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  properties: [],
  getData: async (_) => {
    const data = await api.common
      .getQuestionList({
        pageNo: 1,
        limit: 10,
        fdIsCommon: '1',
        fdStatus: 'solved',
      })
      .then((res) => res.data || []);

    const newData = [];
    for (let i = 0, l = data.length; i < l; i++) {
      const t = data[i];
      const picList = await api.common
        .getFileList({
          attKey: 'COMMON_QUESTION_PIC',
          moudleId: t.id,
        })
        .then((res) => res.data || []);

      newData.push({
        ...t,
        picList: picList.map((d) => ({
          text: d.fdFileName,
          value: d.id,
          path: d.fdPath,
        })),
      });
    }

    return {
      data: newData,
    };
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'modal-issue',
  mixins: [selectionMixin, listMixin],
  watch: {
    visible(v) {
      !!v && this.onRefresh();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.issue-list {
  .issue {
    font-size: 15px;

    &-desc,
    &-res {
      color: #333333;

      span:nth-child(1) {
        font-weight: bold;
        color: $theme-color;
        margin-right: 4px;
      }
    }

    &-res {
      font-size: 14px;
    }

    &-pic {
      margin-bottom: 16px;
    }
  }
}
</style>

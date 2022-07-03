import { buildListMixin } from '@/mixins';
import SelectionBase from './index.vue';

export function buildSelectionBase() {
  const listMixin = buildListMixin({
    properties: ['keyword', { key: 'parent', value: {} }],
    getDataPropName: 'getOptions',
  });

  return {
    name: 'selection-base',
    mixins: [listMixin, SelectionBase],
  };
}

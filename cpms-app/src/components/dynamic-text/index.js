import { buildDataHOC } from '@/utils';
import DynamicText from './index.vue';

function getValue(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return (value || '').split(',').filter((v) => !!v);
}

export function buildDynamicText(name, options) {
  const { properties = {}, getData = options.getData || ((_) => Promise.resolve([])) } = options;

  return buildDataHOC(DynamicText, name, {
    property: 'text',
    properties: Object.assign({}, properties, {
      value: {
        type: [String, Array],
      },
    }),
    getData: async (_) => {
      const data = await getData(_);

      const dataMap = data.reduce((p, c) => {
        p[c.value] = c.text;
        return p;
      }, {});

      return getValue(_.value)
        .map((v) => dataMap[v] || v)
        .join(',');
    },
  });
}

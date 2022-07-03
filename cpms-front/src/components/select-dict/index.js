import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import { get } from 'poros/http';
import { buildDynamicText } from '../dynamic-text/index.js';

const commonProps = {
  systemCode: {
    type: String,
  },
  dictCode: {
    type: String,
  },
};

const req = {};

function getReq(systemCode, dictCode) {
  if (!systemCode || !dictCode) {
    return Promise.resolve({
      data: [],
    });
  }

  // 缓存请求内容
  const t = `${systemCode}-${dictCode}`;

  if (req[t]) {
    return req[t];
  }

  req[t] = get('/api/poros-permission/dict/data/list', {
    systemCode,
    dictCode,
  }).then((res) => ({
    ...res,
    data: (res.data || []).map((d) => ({
      text: d.dataLabel,
      value: d.dataValue,
    })),
  }));

  return req[t];
}

export default buildPropsHOC(
  {
    props: commonProps,
    mixins: [buildSelectBase()],
    watch: {
      systemCode() {
        this.onRefresh();
      },
      dictCode() {
        this.onRefresh();
      },
    },
  },
  'select-dict',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { systemCode, dictCode } = _;

        return getReq(systemCode, dictCode).then((res) => ({
          ...res,
          data: !!query.keyword
            ? (res.data || []).filter((d) => d.text.indexOf(query.keyword) > -1)
            : res.data,
        }));
      },
    },
  }
);

export const DictText = buildDynamicText('dict-text', {
  properties: commonProps,
  getData: (_) => {
    const { systemCode, dictCode } = _;

    return getReq(systemCode, dictCode).then((res) => {
      return res.data || [];
    });
  },
});

import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';
import { get } from 'poros/http';

function getOptions(orgType, query = {}) {
  return get('/api/poros-permission/secOrg/list', {
    code: query.code,
    name: query.keyword,
    status: 1,
    dataSources: orgType,
  }).then((res) => ({
    data: (res.data || []).map((d) => ({
      ...d,
      text: d.name,
      label: `${d.name}${!!d.namePath ? `(${d.namePath})` : ''}`,
      value: d.code,
    })),
  }));
}

export default buildPropsHOC(
  {
    props: {
      orgType: {
        type: String,
        default: '1',
      },
      expandable: {
        type: Boolean,
        default: true,
      },
      expandRoot: {
        type: String,
        default: '组织架构',
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      orgType() {
        this.onRefresh();
      },
    },
  },
  'selection-org',
  {
    placeholder: {
      type: String,
      default: '请输入组织名称搜索',
    },
    getOptions: {
      type: Function,
      default: async (_, query) => {
        const { orgType } = _;
        const { keyword, parent } = query;

        if (!keyword) {
          if (parent.code) {
            return await getOptions(orgType, { code: parent.code });
          } else {
            const res = await getOptions(orgType);
            const top = (res.data || [])[0];
            if (!top) {
              return {
                data: [],
              };
            }
            return await getOptions(orgType, {
              code: top.code,
            });
          }
        } else {
          return await getOptions(orgType, { keyword });
        }
      },
    },
  }
);

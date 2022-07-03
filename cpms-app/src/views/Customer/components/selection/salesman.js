import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    mixins: [buildSelectionBase()],
  },
  'selection-salesman',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.customer
          .getSalesman({
            limit: 200,
            pageNo: 1,
            fdUserNameOrLoginNameOrSapId: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.records || []).map((d) => ({
                ...d,
                text: `(${d.fdUserName}) (${d.fdUserSapId}) (${d.fdCompanyName ? d.fdCompanyName : d.fdCompanyCode})
                (${d.fdSalesOfficeName ? d.fdSalesOfficeName : d.fdSalesOfficeCode})
                ${d.fdLoginName ? '(' + d.fdLoginName + ')' : ''}`,
                value: d.fdUserSapId,
              })),
            };
          })
          .catch((error) => {
            return Promise.resolve({
              data: [],
            });
          });
      },
    },
  }
);

import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import { userMixin } from '@/mixins';
import api from '@/api';
import config from '@/config';

export default buildPropsHOC(
  {
    mixins: [buildSelectBase(), userMixin],
  },
  'select-salesman',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.customer
          .getSalesman({
            fdUserNameOrLoginNameOrSapId: query.keyword,
            limit: 200,
            pageNo: 1,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.records || []).map((d) => ({
                ...d,
                text: `(${d.fdUserName}) (${d.fdUserSapId}) (${
                  d.fdCompanyName ? d.fdCompanyName : d.fdCompanyCode
                }) 
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

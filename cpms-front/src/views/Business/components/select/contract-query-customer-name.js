import { buildSelectBase } from '@/components/select-base'
import { buildPropsHOC } from '@/utils/hoc'
import api from '@/api'

export default buildPropsHOC(buildSelectBase(), 'select-contract-query-customer-name', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.contract
        .getContractList({
          limit: 200,
          pageNo: 1,
          fdCustName: query.keyword
        })
        .then(res => {
          return {
            ...res,
            data: (res.data || []).map(d => ({
              text: d.fdCustName,
              value: d.id,
              data: d
            }))
          }
        })
    }
  }
})

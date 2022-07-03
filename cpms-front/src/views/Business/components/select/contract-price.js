import { buildSelectBase } from '@/components/select-base'
import { buildPropsHOC } from '@/utils/hoc'
import api from '@/api'

export default buildPropsHOC(buildSelectBase(), 'select-contract-price', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.contract
        .getContractList({
          limit: 200,
          pageNo: 1,
          keyword: query.keyword
        })
        .then(res => {
          return {
            ...res,
            data: (res.data || []).map(d => ({
              text: d.value,
              value: d.id,
              data: d
            }))
          }
        })
    }
  }
})

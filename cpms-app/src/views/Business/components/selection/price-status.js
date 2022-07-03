import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc'
import api from '@/api'

export default buildPropsHOC(buildSelectionBase(), 'selection-price-status', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.price
        .getPriceStatus({
          limit: 200,
          pageNo: 1,
          keyword: query.fdStatus
        })
        .then(res => {
          return {
            ...res,
            data: (res.data || []).map(d => ({
              text: d.value,
              value: d.key
            }))
          }
        })
    }
  }
})

import { buildPropsHOC } from '@/utils'
import FilterBase from '@/components/filter-base'
import SelectionProvince from '@/views/components/selection/province'
import SelectionCity from '@/views/components/selection/city'

export default buildPropsHOC(
  {
    components: {
      SelectionProvince,
      SelectionCity
    },
    mixins: [FilterBase]
  },
  'project-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'province',
          label: '省',
          type: 'selection',
          component: 'selection-province',
          getText: v => (v || []).map(d => d.text).join(';'),
          events (_) {
            return {
              change: function () {
                _.tempValue.city = []
              }
            }
          }
        },
        {
          key: 'city',
          label: '市',
          type: 'selection',
          component: 'selection-city',
          getText: v => (v || []).map(d => d.text).join(';'),
          props (_) {
            return {
              provinceCode: ((_.tempValue.province || {})[0] || {}).value
            }
          }
        }
      ]
    }
  }
)
export function convertFilter2Query (filter) {
  const { province = [], city = [] } = filter || {}

  const query = {
    fdProvince: (province[0] || {}).value,
    fdCity: (city[0] || {}).value
  }
  return query
}

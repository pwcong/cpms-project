import { buildPropsHOC } from '@/utils'
import FilterBase from '@/components/filter-base'

export default buildPropsHOC(
  {
    components: {},
    mixins: [FilterBase]
  },
  'page-filter',
  {
    options: {
      type: Array,
      default: () => [
      ]
    }
  }
)

export function convertFilter2Query (filter) {
  const { id, name } = filter || {}

  const query = {
    id,
    name
  }

  return query
}

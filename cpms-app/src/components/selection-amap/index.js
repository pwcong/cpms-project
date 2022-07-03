import axios from 'axios';

import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';
import config from '@/config';

export default buildPropsHOC(
  {
    props: {
      position: {
        type: Object,
        default: () => ({}),
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      position() {
        this.onRefresh();
      },
    },
  },
  'selection-amap',
  {
    getOption: {
      type: Function,
      default: (_, option) =>
        new Promise(async (resolve, reject) => {
          try {
            const result = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
              params: {
                key: config.amapKey,
                location: option.value,
              },
            });
            const data = (result.data.regeocode || {}).addressComponent || {};

            resolve({
              ...option,
              streetName: data.township,
              streetId: data.towncode,
              districtName: data.district,
              districtId: data.adcode,
              cityName: data.city,
              cityId: data.citycode,
              provinceName: data.province,
            });
          } catch (e) {
            _.$toast.fail({
              message: '获取目标地址失败',
            });
            reject(e);
          }
        }),
    },
    getOptions: {
      type: Function,
      default: (_, query) =>
        new Promise(async (resolve) => {
          let options = [];
          try {
            let result = {
              pois: [],
            };
            if (!query.keyword) {
              const { longitude, latitude } = _.position;
              if (!!longitude && !!latitude) {
                result = await axios
                  .get('https://restapi.amap.com/v3/place/around', {
                    params: {
                      key: config.amapKey,
                      location: `${longitude},${latitude}`,
                    },
                  })
                  .then((res) => res.data);
              }
            } else {
              result = await axios
                .get(`https://restapi.amap.com/v3/place/text?keywords=${query.keyword || '深圳'}&key=${config.amapKey}`)
                .then((res) => res.data);
            }
            options = result.pois.map((d) => ({
              ...d,
              text: `${d.pname || ''}${d.cityname || ''}${d.adname || ''}${d.name}`,
              value: d.location,
            }));
          } catch (e) {
            _.$toast.fail({
              message: '获取可选地址失败',
            });
          }

          const map = new Map();
          options = options.filter((d) => {
            if (map.has(d.value)) {
              return false;
            }
            map.set(d.value, true);
            return true;
          });
          resolve({
            totalCount: options.length,
            data: options,
          });
        }),
    },
    actions: {
      type: Array,
      default: () => [
        {
          text: '重新定位',
          func: (_) => {
            _.$emit('relocation');
          },
        },
      ],
    },
  }
);

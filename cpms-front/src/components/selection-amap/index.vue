<template>
  <p-modal
    :maskClosable="false"
    title="选择地址"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
  >
    <div class="amap">
      <div class="amap-l">
        <div
          class="amap-container"
          ref="container"
          style="width: 100%; height: 350px"
        ></div>
      </div>
      <div class="amap-r">
        <div class="amap-search">
          <p-input v-model="query.keyword" clearable placeholder="请输入关键词搜索" />
        </div>
        <div class="amap-list" v-if="list.length > 0">
          <div
            class="amap-item"
            v-for="(item, index) in list"
            :key="index"
            @click="handleClick(item.location, item.text)"
          >
            {{ item.text }}
          </div>
        </div>
        <div v-else class="amap-empty">
          <p-empty />
        </div>
      </div>
    </div>
    <div class="amap-address">
      <span>
        {{ currentPosition }}
      </span>
    </div>
    <span slot="footer">
      <div class="amap-footer">
        <div class="amap-footer-l">
          <!-- <span>
            {{ currentPosition }}
          </span> -->
        </div>
        <div class="amap-footer-r">
          <p-button @click="onCancel">取 消</p-button>
          <p-button :disabled="!tempValue.length" type="primary" @click="onOk">
            确 定
          </p-button>
        </div>
      </div>
    </span>
  </p-modal>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import api from '@/api';

import config from '@/config';
import { buildSelectionMixin, buildListMixin } from '@/mixins';
import { getOptions as getAddressList } from '@/components/select-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

const listMixin = buildListMixin({
  properties: ['keyword'],
  getData: (_, query) => getAddressList(query),
});

const center = [116.406315, 39.908775];

export default {
  name: 'selection-amap',
  mixins: [listMixin, selectionMixin],
  data() {
    return {
      map: null,
      geolocation: null,
      marker: null,
      isInited: false,
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler: function (v) {
        if (!this.isInited && v) {
          this.isInited = true;
          this.$nextTick(() => {
            this.initMap();
          });
        }

        if (v && this.map) {
          this.marker && this.map.remove([this.marker]);
          this.marker = null;

          this.geolocation.getCurrentPosition();
          // this.map.panTo(center);
        }
      },
    },
  },
  computed: {
    currentPosition() {
      const position = this.tempValue[0];
      return `当前选中：${!!position ? position.text : '无'}`;
    },
  },
  methods: {
    initMap() {
      console.log('init');
      const map = (this.map = new AMap.Map(this.$refs.container, {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        center, //初始化地图中心点
      }));

      map.plugin('AMap.Geolocation', () => {
        const geolocation = (this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        }));
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', (geo) => {
          console.log('complete', geo);
          if (!!geo && geo.position) {
            this.handleClick(`${geo.position.lng},${geo.position.lat}`);
          }
        }); //返回定位信息
        AMap.event.addListener(geolocation, 'error', function () {
          console.log('error', arguments);
        }); //返回定位出错信息
      });

      map.on('click', (e) => {
        const { lng, lat } = e.lnglat;
        this.handleClick(`${lng},${lat}`);
      });

      AMap.plugin(['AMap.ToolBar'], function () {
        map.addControl(
          new AMap.ToolBar({
            liteStyle: true,
          })
        );
      });
    },
    initMarker(position) {
      if (!this.marker) {
        this.marker = new AMap.Marker({
          icon: '///a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
          position,
          offset: new AMap.Pixel(-13, -30),
        });
        this.marker.setMap(this.map);
      }

      this.marker.setPosition(position);
    },
    drawMap(position) {
      this.initMarker(position);
      this.map.panTo(position);
    },
    async handleClick(position, text) {
      const remove = this.$message.loading('校验地址信息中', 0);

      try {
        const data = await axios
          .get('https://restapi.amap.com/v3/geocode/regeo', {
            params: {
              key: config.amapKey,
              location: position,
            },
          })
          .then((res) => res.data.regeocode);

        const { province, city, district } = data.addressComponent || {};

        await api.common.checkAddress({
          adCode: (data.addressComponent || {}).adcode,
          provinceName: typeof province === 'string' ? province : '',
          cityName: typeof city === 'string' ? city : '',
          countyName: typeof district === 'string' ? district : '',
        });

        const value = [
          {
            value: position,
            text: text || data.formatted_address,
            data,
          },
        ];
        this.tempValue = value;

        const lng = position.split(',')[0];
        const lat = position.split(',')[1];

        this.drawMap([lng, lat]);
      } catch {
        this.tempValue = [];
        // DO NOTHING
        // this.$message.error("当前选择的地址无效，请重新选择");
      } finally {
        remove();
      }
    },
  },
  beforeDestroy() {
    this.map && this.map.destroy();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.amap {
  display: flex;
  flex-flow: row nowrap;

  &-l {
    flex: 1;

    ::v-deep .amap-icon img {
      width: 25px;
      height: 34px;
    }
    height: 350px;
  }

  &-r {
    margin-left: 20px;
    width: 250px;
    max-width: 250px;
    display: flex;
    flex-flow: column nowrap;
    height: 350px;
    position: relative;
  }

  &-list {
    margin-top: 8px;
    flex: 1;
    overflow: auto;
  }

  &-item {
    font-size: 12px;
    padding: 4px 8px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: rgba($theme-color, 0.04);
      color: $theme-color;
    }
  }

  &-footer {
    display: flex;
    &-l {
      flex: 1;
      font-size: 14px;
      text-align: left;
    }
  }

  &-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &-address {
    padding-top: 16px;
    font-size: 16px;
    color: $theme-color;
    text-align: center;
    font-weight: bold;
  }
}
</style>

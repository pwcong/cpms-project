import _ from 'lodash';
import omit from 'omit.js';

export function buildPropsHOC(Component, componentName, properties) {
  return {
    name: componentName,
    mixins: [Component],
    props: properties,
  };
}

export function buildDataHOC(Component, componentName, options) {
  const {
    property = 'data',
    data,
    getData = (_, properties) => Promise.resolve([]),
    properties = {},
  } = options || {};

  return {
    name: componentName,
    mixins: [omit(Component, ['props'])],
    props: Object.assign({}, omit(Component.props, [property]), properties),
    data() {
      return {
        [property]: data,
      };
    },
    created() {
      const ctx = this;
      this.onInitData = _.debounce(function () {
        getData(ctx, ctx.$props).then((data) => (ctx[property] = data));
      }, 200);
      this.onInitData();
    },
    watch: {
      ...Object.keys(properties).reduce((p, c) => {
        p[c] = function () {
          this.onInitData();
        };

        return p;
      }, {}),
    },
  };
}

export function buildTable4ListMixin(options = {}) {
  const { properties = [], sorterKey = 'sorter', sorterMap = {} } = options;

  const getProperties = options.getProperties || ((_, properties) => properties);
  const getPropertiesMeta =
    options.getPropertiesMeta ||
    ((_, _properties) =>
      (_properties || [])
        .filter((p) => !!p.hider)
        .reduce((p, c, i) => {
          p[c.dataIndex] = {
            order: i,
            key: c.dataIndex,
            title: c.title,
            hidden: false,
          };
          return p;
        }, {}));

  return {
    data() {
      const _properties = getProperties(this, properties);

      return {
        properties: _properties,
        propertiesMeta: getPropertiesMeta(this, _properties),
      };
    },
    computed: {
      propertiesWithMeta() {
        return this.properties
          .filter((p) => !(this.propertiesMeta[p.dataIndex] || {}).hidden)
          .sort((a, b) => {
            a = this.propertiesMeta[a.dataIndex] || {};
            b = this.propertiesMeta[b.dataIndex] || {};

            switch (true) {
              case a.order > b.order:
                return 1;
              case a.order < b.order:
                return -1;
              default:
                return 0;
            }
          });
      },
    },
    methods: {
      handleList(pagination, filters, sorter) {
        this.pageNo = pagination.current;
        this.pageSize = pagination.pageSize;

        const sorterValue = (this.query[sorterKey] || []).reduce((p, c) => {
          p[c.key] = c.value;
          return p;
        }, {});

        const { field, order } = sorter;

        if (!!field) {
          const key = sorterMap[field] || field;

          const value = !!order ? (order === 'ascend' ? 'asc' : 'desc') : '';

          if (Array.isArray(key)) {
            if (key.length <= 0) {
              return;
            }

            if (sorterValue[key[0]] !== value) {
              this.query[sorterKey] = key.map((k) => ({
                key: k,
                value,
              }));
            }
          } else {
            if (sorterValue[key] !== value) {
              this.query[sorterKey] = [
                {
                  key,
                  value,
                },
              ];
            }
          }
        }
      },
    },
  };
}

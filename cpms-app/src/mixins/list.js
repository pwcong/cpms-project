import _ from 'lodash';

export const listMixin = {
  data() {
    return {
      inited: false,
      loading: false,
      loadingMore: false,
      list: [],
      query: {},
      pageNo: 1,
      pageSize: 20,
      totalSize: 0,
    };
  },
  computed: {
    hasMore() {
      return this.pageSize * this.pageNo < this.totalSize && this.list.length < this.totalSize;
    },
  },
};

export function buildListMixin(options) {
  options = Object.assign({}, options);

  const {
    immediate = true,
    duration = 200,
    relation = [],
    properties = [
      // 'key',
      // {key: '', value: ''}
    ],
    getDataPropName = 'getData',
    getQuery = (_, query) => query,
    getData = (_, query) => Promise.resolve({ data: [], totalSize: 0 }),
  } = options;

  return {
    mixins: [listMixin],
    props: {
      [getDataPropName]: {
        type: Function,
        default: getData,
      },
    },
    data() {
      return {
        query: properties.reduce((p, c) => {
          if (typeof c === 'object') {
            p[c.key] = c.value;
          } else {
            p[c] = undefined;
          }
          return p;
        }, {}),
        onLoad: null,
        onRefresh: null,
        onLoadMore: null,
      };
    },
    created() {
      const ctx = this;

      this.onLoad = _.debounce(function (query) {
        ctx.loading = true;

        setTimeout(async () => {
          try {
            if (!ctx[getDataPropName]) {
              return;
            }

            query = getQuery(
              ctx,
              Object.assign(
                {
                  pageNo: ctx.pageNo,
                  pageSize: ctx.pageSize,
                },
                query
              )
            );

            const targetQuery = Object.keys(query).reduce((p, c) => {
              const v = query[c];
              if (v !== '' && v !== undefined && v !== null) {
                p[c] = v;
              }
              return p;
            }, {});

            const { data, totalSize = 0 } = await ctx[getDataPropName](ctx, targetQuery);

            ctx.totalSize = totalSize;

            if (ctx.loadingMore) {
              ctx.list = ctx.list.concat(data || []);
            } else {
              ctx.list = data || [];
            }
          } catch (e) {
            console.error(e);
          } finally {
            ctx.loading = false;
            ctx.loadingMore = false;
          }
        });
      }, duration);

      this.onRefresh = _.debounce(function () {
        if (ctx.loading) {
          return;
        }
        ctx.pageNo = 1;
        ctx.onLoad(ctx.query);
      }, duration);

      this.onLoadMore = _.debounce(function () {
        if (ctx.loading) {
          return;
        }
        ctx.loadingMore = true;
        ctx.pageNo++;
      }, duration);

      if (immediate) {
        this.onLoad(this.query);
      }
    },
    activated() {
      if (immediate) {
        if (this.inited) {
          this.onRefresh();
        }
        this.inited = true;
      }
    },
    watch: {
      ...['pageNo', 'pageSize', 'query', ...relation].reduce((p, c) => {
        switch (c) {
          case 'pageNo':
            p[c] = {
              handler(v) {
                this.onLoad(this.query);
              },
            };
            break;
          case 'pageSize':
            p[c] = {
              handler(v) {
                this.onRefresh(true);
              },
            };
            break;
          case 'query':
            p[c] = {
              deep: true,
              handler(v) {
                this.onRefresh(true);
              },
            };
            break;
          default:
            p[c] = {
              handler(v) {
                this.onRefresh(true);
              },
            };
            break;
        }

        return p;
      }, {}),
    },
  };
}

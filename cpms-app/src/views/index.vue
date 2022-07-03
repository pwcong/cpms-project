<template>
  <list-layout class="page-index">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" left-text="关闭" left-arrow @click-left="onClickLeft">
        <span slot="title" @click="initVConsole">CPMS</span>
      </van-nav-bar>
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100vh - 46px)">
        <div class="main">
          <module-list :value="modules" @goto="goto" />
        </div>
        <div class="footer">
          <span>CPMS</span>
          <span> / </span>
          <span>v{{ config.pkg.version }}</span>
        </div>
      </div>
    </template>
  </list-layout>
</template>

<script>
import config from '@/config';
// import { createRoutesByMenus } from '@/utils';
import Debug from '@/common/lib/debug';
import { authMixin } from '@/mixins';
import ModuleList from '@/components/module-list';
import { MODULES } from './config';

function convert2MenusMap(menus, map) {
  map = map || new Map();

  for (let i = 0, l = (menus || []).length; i < l; i++) {
    const t = menus[i];
    if (!!t.url && t.target === 'render') {
      map.set(t.url, t);
    }

    if (Array.isArray(t.children)) {
      convert2MenusMap(t.children, map);
    }
  }

  return map;
}

export default {
  name: 'Home',
  mixins: [authMixin],
  components: {
    ModuleList,
  },
  data() {
    return {
      config,
    };
  },
  computed: {
    modules() {
      return this.filterModules(MODULES);
    },
    menusMap() {
      return convert2MenusMap(this.menus);
    },
    // menus() {
    //   return [
    //     // {
    //     //   title: '客户管理',
    //     //   path: '/Customer',
    //     //   children: [
    //     //     {
    //     //       icon: imgCustomer,
    //     //       path: '/Customer/InterdCustomerList',
    //     //       title: '客户列表',
    //     //     },
    //     //   ],
    //     // },
    //     ...this.convertRoutes2Menus(
    //       createRoutesByMenus(this.$store.state.poros.menus || [])
    //     ),
    //   ];
    // },
  },
  methods: {
    // convertRoutes2Menus(routes) {
    //   return routes
    //     .filter((route) => !(route.meta || {}).hidden)
    //     .map((route) => {
    //       const { meta = {} } = route;

    //       const menu = {
    //         title: meta.name,
    //         path: route.path,
    //       };
    //       if (Array.isArray(route.children)) {
    //         menu.children = this.convertRoutes2Menus(route.children);
    //       }

    //       return menu;
    //     });
    // },
    filterModules(modules) {
      const result = [];
      for (let i = 0, l = modules.length; i < l; i++) {
        const t = { ...modules[i] };
        if (this.menusMap.has(t.path) || t.auth === false) {
          result.push(t);

          const children = [...(t.children || [])];
          if (children.length > 0) {
            t.children = this.filterModules(children);
          }
        }
      }
      return result;
    },
    onClickLeft() {
      this.$root.goBack();
    },
    goto(item) {
      this.$router.push({
        path: item.path,
        query: item.query,
      });
    },
    initVConsole() {
      Debug.install({
        debug: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-index {
  .main {
    min-height: calc(100% - 24px);
  }

  .footer {
    height: 24px;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    color: #999999;
    background-color: #f4f4f4;
  }
}
</style>

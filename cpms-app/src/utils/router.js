import { pascalCase } from 'change-case';

/** 根据菜单创建动态路由 */
export function createRoutesByMenus(menus) {
  const routes = [];

  menus.forEach((menu) => {
    !!menu.url && routes.push(convertMenu2Route(menu));
  });

  return routes;
}

/** 递归展开动态路由 */
export function flattenRoutes(routes, validate = () => true, newRoutes = []) {
  routes.forEach((route) => {
    if (validate(route)) {
      newRoutes.push(route);
    }

    if (Array.isArray(route.children) && route.children.length > 0) {
      flattenRoutes(route.children, validate, newRoutes);
    }
  });

  return newRoutes;
}

function convertMenu2Route(menu) {
  const { url, hidden, name, keepAlive, target } = menu;

  const route = {
    path: url,
    meta: {
      hidden,
      name,
      auth: true,
      keepAlive,
      componentName: '',
    },
  };

  if (target === 'render') {
    route.name = (url || '')
      .split('/')
      .map((s) => pascalCase(s))
      .join('');

    if (!!menu.componentPath) {
      route.component = () =>
        new Promise((resolve) => {
          import(`@/views${menu.componentPath}`)
            .then(resolve)
            .catch((e) => {
              console.error(menu, e);
              import('@/views/404.vue').then(resolve);
            });
        });
    }
  } else {
    route.path = `/iframe/${menu.id}`;
    route.meta.url = menu.url;
    route.component = () => import('@/components/iframe-page');
  }

  if (Array.isArray(menu.children) && menu.children.length > 0) {
    route.children = menu.children.map((_menu) => convertMenu2Route(_menu));
  }

  return route;
}

/**
 * 路由配置
 */
export default [
  { path: '/', title: '首页', exact: true, component: '@/pages/index' },
  { path: '/login', title: '登录', exact: true, component: '@/pages/login' },
  {
    path: '/one',
    title: '菜单一',
    exact: false,
    component: '@/layouts/index',
    routes: [
      {
        path: '/drag',
        title: '拖拽',
        exact: true,
        component: '@/pages/drag/index',
      },
      {
        path: '/form',
        title: '动态表单',
        exact: true,
        component: '@/pages/dynamicForm',
      },
      {
        path: '/another',
        title: '另一个页面',
        exact: true,
        component: '@/pages/another',
      },
    ],
  },
  { component: '@/pages/404' },
];

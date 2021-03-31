/**
 * 路由配置
 */
export default [
  {
    path: '/', title: '首页', exact: false, component: '@/layouts/index', routes: [
      {path: '/drag', title: '拖拽', exact: true, component: '@/pages/drag/index'},
      {path: '/form', title: '动态表单', exact: true, component: '@/pages/dynamicForm'},
    ]
  },
  {component: '@/pages/404'}
]

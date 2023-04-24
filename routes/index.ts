/**
 * 路由配置
 */
export default [
  { path: "/login", title: "登录", exact: true, component: "@/pages/login" },
  { path: "/", exact: true, redirect: '/custom' },
  {
    path: "/custom",
    title: "菜单一",
    redirect: "/custom/drag",
    component: "@/layouts/index",
    routes: [
      {
        path: "/custom/drag",
        title: "拖拽",
        exact: true,
        component: "@/pages/drag"
      },
      {
        path: "/form",
        title: "动态表单",
        exact: true,
        component: "@/pages/dynamicForm"
      },
      {
        path: "/another",
        title: "另一个页面",
        exact: true,
        component: "@/pages/another"
      }
    ]
  },
  { component: "@/pages/404" }
];

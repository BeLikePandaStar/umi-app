/**
 * 获取面包屑参数
 * @param routes
 */
export function getRouteConfig(routes: Array<any>) {
  if (routes[0] && routes[0].routes.length) {
    return routes[0].routes.map((item: any) => ({
      path: item.path,
      breadcrumbName: item.name
    }))
  } else {
    return []
  }
}

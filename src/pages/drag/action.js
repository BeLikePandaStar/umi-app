export const get_store_list = () => {
  return [
    {
      id: '1', name: '调度专题', children: [
        {
          id: '11',
          name: '今日工作安排',
          templateTypeCode: 'custom',
          templateConfig: "{\"isSize\":true,\"maxX\":64,\"maxY\":40,\"minX\":4,\"minY\":4}",
          thumbnail: '@pages/drag/images/workflow.png'
        }
      ]
    }
  ]
}

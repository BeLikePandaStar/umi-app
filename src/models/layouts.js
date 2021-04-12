import commonRequest from '../tools/commonRequest';

/**
 * 请求菜单
 * @param params
 * @returns {Promise<*>}
 */
const get_menu_list = (params = {}) => {
  const menuData = [
    {
      id: '100',
      order: 1,
      name: '自定义一级菜单',
      url: '/father1',
      children: [
        {
          id: '110',
          order: 1,
          name: '拖拽模块',
          url: '/son1',
          children: [{ id: '111', order: 1, name: '拖拽', url: '/drag' }],
        },
        {
          id: '120',
          order: 2,
          name: '动态表单模块',
          url: '/son2',
          children: [{ id: '121', order: 1, name: '动态表单', url: '/form' }],
        },
      ],
    },
    {
      id: '200',
      order: 2,
      name: '自定义一级菜单2',
      url: '/father2',
      children: [
        { id: '210', order: 1, name: '拖拽模块', url: '/drag', children: null },
      ],
    },
  ];
  return commonRequest('', params, 'get', menuData).then((res) => {
    if (res.ret === 0) {
      return res.data;
    }
  });
};

/**
 * 对后台返回的菜单进行处理
 * 方便路由跳转时匹配菜单
 * @param data
 * @returns {[]}
 */
function filterMenu(data) {
  let menus = [];
  if (data && data.length) {
    data.forEach((father) => {
      if (father.children) {
        father.children.forEach((son) => {
          if (son.children) {
            son.children.forEach((grandson) => {
              menus.push({
                fatherId: father.id,
                sonId: son.id,
                grandsonId: grandson.id,
                url: grandson.url,
              });
            });
          } else {
            menus.push({
              fatherId: father.id,
              sonId: son.id,
              grandsonId: '',
              url: son.url,
            });
          }
        });
      } else {
        menus.push({
          fatherId: father.id,
          sonId: '',
          grandsonId: '',
          url: father.url,
        });
      }
    });
  }
  return menus;
}

export default {
  name: 'layouts',
  state: {
    menuData: [],
    filterMenuData: [],
    subMenus: [],
    curFatherKeys: [],
    curSonKeys: [],
    curGrandsonKeys: [],
  },
  effects: {
    *getMenuList({ payload }, { call, put }) {
      const menuData = yield call(get_menu_list, payload);
      yield put({
        type: 'save',
        payload: { menuData, filterMenuData: filterMenu(menuData) },
      });
    },
  },
  reducers: {
    save: (state, { payload: { menuData, filterMenuData } }) => {
      const curFather = menuData && menuData.length ? menuData[0] : null;
      const curSon =
        curFather && curFather.children ? curFather['children'][0] : null;
      const curGrandson =
        curSon && curSon.children ? curSon['children'][0] : null;
      return {
        menuData,
        filterMenuData,
        subMenus: menuData[0]['children'],
        curFatherKeys: [curFather ? curFather.id : ''],
        curSonKeys: [curSon ? curSon.id : ''],
        curGrandsonKeys: [curGrandson ? curGrandson.id : ''],
      };
    },
    change: ({ menuData, filterMenuData }, { payload: { curPath } }) => {
      const keys = filterMenuData.filter((item) => item.url === curPath);
      const fatherMenu = keys.length
        ? menuData.filter((item) => item.id === keys[0]['fatherId'])
        : [];
      console.log(keys, fatherMenu, 'fatherMenu');
      return {
        menuData,
        filterMenuData,
        subMenus: fatherMenu.length ? fatherMenu[0]['children'] : [],
        curFatherKeys: keys.length ? [keys[0]['fatherId']] : [''],
        curSonKeys: keys.length ? [keys[0]['sonId']] : [''],
        curGrandsonKeys: keys.length ? [keys[0]['grandsonId']] : [''],
      };
    },
    getSubMenu: (
      { menuData, filterMenuData },
      { payload: { id: curFatherId } },
    ) => {
      const curFather =
        menuData.filter((father) => father.id === curFatherId)[0] || null;
      const curSon =
        curFather && curFather.children ? curFather['children'][0] : null;
      const curGrandson =
        curSon && curSon.children ? curSon['children'][0] : null;
      return {
        menuData,
        filterMenuData,
        subMenus: curFather ? curFather.children : [],
        curFatherKeys: curFather ? [curFather.id] : [],
        curSonKeys: curSon ? [curSon.id] : [],
        curGrandsonKeys: curGrandson ? [curGrandson.id] : [],
      };
    },
  },
  subscriptions: {
    /*onRouterChange: ({dispatch, history}) => {
      return history.listen(({pathname}) => {
        dispatch({type: 'change', payload: {curPath: pathname}});
      });
    },*/
  },
};

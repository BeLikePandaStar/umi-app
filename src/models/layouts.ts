import { Effect, Reducer, Subscription } from "umi";

interface GrandSon {
  id: string;
  order: number;
  name: string;
  url: string;
}

interface Son {
  id: string;
  order: number;
  name: string;
  url: string;
  children?: GrandSon[];
}

interface Father {
  id: string;
  order: number;
  name: string;
  url: string;
  children?: Son[];
}

interface FilterMenu {
  fatherId: string;
  sonId: string;
  grandsonId: string;
  url: string;
}

interface LayoutsModelState {
  menuData: [];
  filterMenuData: [];
  subMenus: [];
  curFatherKeys: [];
  curSonKeys: [];
  curGrandsonKeys: [];
}

interface LayoutsModel {
  namespace: string;
  state: LayoutsModelState;
  effects: {
    getMenuList: Effect;
  };
  reducers: {
    save: Reducer;
    getSubMenu: Reducer;
    openSubMenu: Reducer;
    onChange: Reducer;
  };
  subscriptions: {
    onRouterChange: Subscription;
  };
}

/**
 * 请求菜单
 * @param params
 * @returns {Promise<*>}
 */
const get_menu_list = (params = {}) => {
  return [
    {
      id: "100",
      order: 1,
      name: "菜单一",
      url: "/one",
      children: [
        {
          id: "110",
          order: 1,
          name: "拖拽模块",
          url: "/son1",
          children: [{ id: "111", order: 1, name: "拖拽", url: "/drag" }]
        },
        {
          id: "120",
          order: 2,
          name: "动态表单模块",
          url: "/son2",
          children: [{ id: "121", order: 1, name: "动态表单", url: "/form" }]
        }
      ]
    },
    {
      id: "200",
      order: 2,
      name: "菜单二",
      url: "/two",
      children: [{ id: "210", order: 1, name: "另一个页面", url: "/another" }]
    }
  ];
};

/**
 * 对后台返回的菜单进行处理
 * 方便路由跳转时匹配菜单
 * @param data
 * @returns {[]}
 */
function filterMenu(data: Father[]) {
  let menus: FilterMenu[] = [];
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
                url: grandson.url
              });
            });
          } else {
            menus.push({
              fatherId: father.id,
              sonId: son.id,
              grandsonId: "",
              url: son.url
            });
          }
        });
      } else {
        menus.push({
          fatherId: father.id,
          sonId: "",
          grandsonId: "",
          url: father.url
        });
      }
    });
  }
  return menus;
}

const layoutModel: LayoutsModel = {
  namespace: "layouts",
  state: {
    menuData: [],
    filterMenuData: [],
    subMenus: [],
    curFatherKeys: [],
    curSonKeys: [],
    curGrandsonKeys: []
  },
  effects: {
    * getMenuList({ payload }, { call, put }) {
      const menuData = yield call(get_menu_list, payload);
      yield put({
        type: "save",
        payload: { menuData, filterMenuData: filterMenu(menuData) }
      });
    }
  },
  reducers: {
    // 初始化菜单
    save: (state, { payload: { menuData, filterMenuData } }) => {
      // 请求到的菜单缓存起来
      localStorage.setItem(
        "menuObj",
        JSON.stringify({ menuData, filterMenuData })
      );
      const curFather = menuData && menuData.length ? menuData[0] : null;
      const curSon =
        curFather && curFather.children ? curFather["children"][0] : null;
      const curGrandson =
        curSon && curSon.children ? curSon["children"][0] : null;
      return {
        menuData,
        filterMenuData,
        subMenus: menuData[0]["children"],
        curFatherKeys: [curFather ? curFather.id : ""],
        curSonKeys: [curSon ? curSon.id : ""],
        curGrandsonKeys: [curGrandson ? curGrandson.id : ""]
      };
    },
    // 获取当前一级菜单下的二级和三级菜单
    getSubMenu: (
      { menuData, filterMenuData, curFatherKeys, curSonKeys, curGrandsonKeys },
      { payload: { id: curFatherId } }
    ) => {
      const curFather =
        menuData.filter((father: Father) => father.id === curFatherId)[0] ||
        null;
      return {
        menuData,
        filterMenuData,
        subMenus: curFather ? curFather.children : [],
        curFatherKeys: [curFatherId],
        curSonKeys,
        curGrandsonKeys
      };
    },
    // 点击二级菜单的action
    openSubMenu: (state, { payload: { id: curSonId } }) => {
      const {
        menuData,
        filterMenuData,
        subMenus,
        curFatherKeys,
        curSonKeys,
        curGrandsonKeys
      } = state;
      let newCurSonKeys = curSonKeys;
      if (curSonKeys.includes(curSonId)) {
        newCurSonKeys = newCurSonKeys.filter(
          (item: string) => item !== curSonId
        );
      } else {
        newCurSonKeys.push(curSonId);
      }
      return {
        menuData,
        filterMenuData,
        subMenus,
        curFatherKeys,
        curSonKeys: newCurSonKeys,
        curGrandsonKeys
      };
    },
    // 当路由发生变化时触发的action
    onChange: (state, { payload: { curPath, menuData, filterMenuData } }) => {
      const keys = filterMenuData.filter(
        (item: FilterMenu) => item.url === curPath
      );
      const fatherMenu = keys.length
        ? menuData.filter((item: Father) => item.id === keys[0]["fatherId"])
        : [];
      return {
        menuData,
        filterMenuData,
        subMenus: fatherMenu.length ? fatherMenu[0]["children"] : [],
        curFatherKeys: keys.length ? [keys[0]["fatherId"]] : [""],
        curSonKeys: keys.length ? [keys[0]["sonId"]] : [""],
        curGrandsonKeys: keys.length ? [keys[0]["grandsonId"]] : [""]
      };
    }
  },
  subscriptions: {
    // 监听路由变化,保证菜单显示正确以及路由锁定
    onRouterChange: ({ dispatch, history }) => {
      return history.listen(({ pathname }) => {
        // 如果菜单有缓存的话就取缓存的菜单
        const menuObj = localStorage.getItem("menuObj")
          ? JSON.parse(localStorage.getItem("menuObj")!)
          : null;
        if (menuObj) {
          dispatch({
            type: "onChange",
            payload: { curPath: pathname, ...menuObj }
          });
        } else {
          dispatch({ type: "getMenuList", payload: {} });
        }
      });
    }
  }
};

export default layoutModel;

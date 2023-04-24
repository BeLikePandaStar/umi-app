import { getStoreList } from "@/services/drag";
import { DataItem, DragModel } from "@/interfaces/drag";

/**
 * 拖拽模型
 */
const dragModel: DragModel = {
  namespace: "drag",
  state: {
    data: [],
    options: [{ label: "全部应用磁贴", value: "" }]
  },
  effects: {
    /**
     * 获取拖拽数据
     * @param payload
     * @param call
     * @param put
     * @param select
     */
    * getStoreList({ payload }, { call, put, select }) {
      const { options } = yield select((state: any) => state.drag);
      const data: Array<DataItem> = yield call(getStoreList, payload);
      const newOptions = data.map((item: DataItem) => ({
        label: item.title,
        value: item.id
      }));
      yield put({ type: "setStoreList", payload: { data, options: [...options, ...newOptions] } });
    }
  },
  reducers: {
    commonSetState(state, { payload: newData }) {
      return { ...state, ...newData };
    }
  }
};

export default dragModel;

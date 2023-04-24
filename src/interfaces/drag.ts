import { Effect, Reducer } from "umi";
// import { Effect, Reducer } from "@@/plugin-dva/connect";

export interface GoodsItemDataList {
  id: string;
  name: string;
  gender: string;
  age: string;
}

export interface GoodsItemDataObj {
  title: string;
  list?: string[];
  content?: string;
  url?: string;
  imgSrc?: string;
}

export interface GoodsItem {
  id: string;
  title: string;
  templateTypeCode: string;
  templateConfig: string;
  thumbnail: string;
  data: GoodsItemDataObj | string[] | GoodsItemDataList[] | string[][];
}

export interface DataItem {
  id: string;
  title: string;
  children: GoodsItem[];
}

export interface Option {
  label: string;
  value: string;
}

export interface DragModelState {
  data: DataItem[];
  options: Option[];
}

export interface DragModel {
  namespace: string;
  state: DragModelState;
  effects: {
    getStoreList: Effect;
  };
  reducers: {
    commonSetState: Reducer;
  };
}

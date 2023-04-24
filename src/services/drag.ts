import {request} from "umi";

/**
 * 获取商店列表数据
 */
export const getStoreList = () => {
  return request("/api/getDragData")
};

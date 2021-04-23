interface Params {
  [name: string]: string | number;
}

// 通用的请求
export default function commonRequest(
  url: string,
  params: Params,
  method: string,
  data: any,
) {
  return new Promise((resolve, reject) => {
    // 发起请求...
    try {
      resolve({ ret: 0, msg: '请求成功', data });
    } catch (err) {
      reject({ ret: -1, msg: '请求失败', err });
    }
  });
}

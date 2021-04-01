// 通用的请求

export default function commonRequest(url, params, method, data) {
  return new Promise((resolve, reject) => {
    // 发起请求...
    try {
      resolve({ret: 0, msg: '请求成功', data})
    } catch (e) {
      reject({ret: -1, msg: '请求失败', e})
    }
  })
}

import commonRequest from '../tools/commonRequest';

// 获取商店列表数据
const get_store_list = (params = {}) => {
  const data = [
    {
      id: '1',
      title: '调度专题',
      children: [
        {
          id: '11',
          title: '今日工作安排',
          templateTypeCode: 'list',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":6,"minH":4}',
          thumbnail: require('../pages/drag/images/workflow.png'),
          data: {
            title: '今日工作安排',
            list: [
              '脱臭精制油硫:59.1、35.5、35mg/kg，焦化:柴油KK:333、336℃，渣加:柴油KK:332℃；',
              '聚丙烯:聚合进料15t/h，造粒13t/h。乙苯:干气13000Nm3/h，产量6t/h。',
              '溶脱:进料52t/h。1#气分:进料17t/h；2#气分:进料29t/h。',
              '水务:含油处理量360t/h；含盐处理量170t/h；碱渣:进料0.4t/h；WAR:停运。',
              '低氮外供量:14000Nm3/h。液氮罐:8.7m，液氧罐:9.7m。',
            ],
          },
        },
      ],
    },
    {
      id: '999',
      title: '其他',
      children: [
        {
          id: '9991',
          title: '文本',
          templateTypeCode: 'text',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/text.png'),
          data: {
            title: '文本',
            content:
              '清明节，是中华民族最隆重盛大的祭祖大节，属于礼敬祖先、慎终追远的一种文化传统节日。清明节凝聚着民族精神，传承了中华文明的祭祀文化，抒发人们尊祖敬宗、继志述事的道德情怀。扫墓，即为“墓祭”，谓之对祖先的“思时之敬”，春秋二祭，古已有之。清明节历史悠久，源自上古时代的祖先信仰与春祭礼俗。据现代人类学、考古学的研究成果，人类最原始的两种信仰，一是天地信仰，二是祖先信仰。据考古发掘，广东英德青塘遗址发现了万年前的墓葬，是中国年代最早的可确认葬式的墓葬，表明上古先民在万年前已具有明确的有意识墓葬行为与礼俗观念。“墓祭”礼俗有着久远的历史源头，清明“墓祭”是传统春季节俗的综合与升华。上古干支历法的制定为节日形成提供了前决条件，祖先信仰与祭祀文化是清明祭祖礼俗形成的重要因素。清明节俗丰富，归纳起来是两大节令传统：一是礼敬祖先，慎终追远；二是踏青郊游、亲近自然。清明节不仅有祭扫、缅怀、追思的主题，也有踏青郊游、愉悦身心的主题，“天人合一”传统理念在清明节中得到了生动体现。经历史发展，清明节在唐宋时期融汇了寒食节与上巳节的习俗，杂糅了多地多种民俗为一体，具有极为丰富的文化内涵。',
          },
        },
        {
          id: '9992',
          title: '链接',
          templateTypeCode: 'link',
          templateConfig:
            '{"isSize":false,"maxW":2,"maxH":2,"minW":2,"minH":2}',
          thumbnail: require('../pages/drag/images/link.png'),
          data: {
            title: '表单页面',
            url: '/form',
            imgSrc: require('../pages/drag/images/form.png'),
          },
        },
        {
          id: '9993',
          title: '列表',
          templateTypeCode: 'table',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/table.png'),
          data: [
            { id: 't1', name: '张三', gender: 'male', age: '18' },
            { id: 't2', name: '李思', gender: 'female', age: '16' },
            { id: 't3', name: '王武', gender: 'male', age: '21' },
          ],
        },
        {
          id: '9994',
          title: '轮播图',
          templateTypeCode: 'banner',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/image.png'),
          data: [
            'https://image.baidu.com/search/detail?tn=baiduimagedetail&word=%E5%9F%8E%E5%B8%82%E5%BB%BA%E7%AD%91%E6%91%84%E5%BD%B1%E4%B8%93%E9%A2%98&album_tab=%E5%BB%BA%E7%AD%91&album_id=7&ie=utf-8&fr=albumsdetail&cs=2511982910,2454873241&pi=3982&pn=5&ic=0&objurl=https%3A%2F%2Ft7.baidu.com%2Fit%2Fu%3D2511982910%2C2454873241%26fm%3D193%26f%3DGIF',
            'https://image.baidu.com/search/detail?tn=baiduimagedetail&word=%E5%9F%8E%E5%B8%82%E5%BB%BA%E7%AD%91%E6%91%84%E5%BD%B1%E4%B8%93%E9%A2%98&album_tab=%E5%BB%BA%E7%AD%91&album_id=7&ie=utf-8&fr=albumsdetail&cs=3908717,2002330211&pi=3990&pn=13&ic=0&objurl=https%3A%2F%2Ft7.baidu.com%2Fit%2Fu%3D3908717%2C2002330211%26fm%3D193%26f%3DGIF',
            'https://image.baidu.com/search/detail?tn=baiduimagedetail&word=%E5%9F%8E%E5%B8%82%E5%BB%BA%E7%AD%91%E6%91%84%E5%BD%B1%E4%B8%93%E9%A2%98&album_tab=%E5%BB%BA%E7%AD%91&album_id=7&ie=utf-8&fr=albumsdetail&cs=3691080281,11347921&pi=3994&pn=17&ic=0&objurl=https%3A%2F%2Ft7.baidu.com%2Fit%2Fu%3D3691080281%2C11347921%26fm%3D193%26f%3DGIF',
          ],
        },
        {
          id: '9995',
          title: '选项卡',
          templateTypeCode: 'tab',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/tab.png'),
          data: [
            [
              '吾爱孟夫子，风流天下闻。',
              '红颜弃轩冕，白首卧松云。',
              '醉月频中圣，迷花不事君。',
              '高山安可仰，徒此揖清芬。',
            ],
            [
              '清川带长薄，车马去闲闲。',
              '流水如有意，暮禽相与还。',
              '荒城临古渡，落日满秋山。',
              '迢递嵩高下，归来且闭关。',
            ],
          ],
        },
        {
          id: '9996',
          title: '柱图',
          templateTypeCode: 'barChart',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/barChart.png'),
          data: [
            ['科目', '语文', '数学', '英语'],
            ['小明', '108', '125', '103'],
            ['小红', '112', '102', '118'],
            ['小兰', '115', '108', '134'],
            ['小强', '126', '139', '130'],
            ['小智', '86', '78', '58'],
          ],
        },
        {
          id: '9997',
          title: '线图',
          templateTypeCode: 'lineChart',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/lineChart.png'),
          data: [
            ['科目', '语文', '数学', '英语'],
            ['小明', '108', '125', '103'],
            ['小红', '112', '102', '118'],
            ['小兰', '115', '108', '134'],
            ['小强', '126', '139', '130'],
            ['小智', '86', '78', '58'],
          ],
        },
        {
          id: '9998',
          title: '饼图',
          templateTypeCode: 'pieChart',
          templateConfig:
            '{"isSize":true,"maxW":64,"maxH":40,"minW":4,"minH":4}',
          thumbnail: require('../pages/drag/images/pieChart.png'),
          data: [
            ['科目', '语文', '数学', '英语'],
            ['小明', '108', '125', '103'],
            ['小红', '112', '102', '118'],
            ['小兰', '115', '108', '134'],
            ['小强', '126', '139', '130'],
            ['小智', '86', '78', '58'],
          ],
        },
      ],
    },
  ];
  return commonRequest('', params, 'get', data)
    .then((res) => {
      if (Number(res.ret) === 0) {
        return res.data;
      } else {
        return [];
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

export default {
  namespace: 'drag',
  state: {
    data: [],
    options: [{ label: '全部应用磁贴', value: '' }],
  },
  effects: {
    *getStoreList({ payload }, { call, put }) {
      const data = yield call(get_store_list, payload);
      const options = data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      yield put({ type: 'setStoreList', payload: { data, options } });
    },
  },
  reducers: {
    setStoreList(state, { payload: newData }) {
      return {
        data: newData.data,
        options: [...state.options, ...newData.options],
      };
    },
  },
};

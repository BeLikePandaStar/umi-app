// import React, {Component} from "react";
// import style from "./index.css";
// import {Button, message, Tooltip} from 'antd';
// import {CloseOutlined, SwapOutlined} from '@ant-design/icons';
// import GridLayout, {WidthProvider} from 'react-grid-layout';
//
// const FixedGridLayout = WidthProvider(GridLayout);
// const originalLayout = getFromLS("layout") || [];
// const originalMirrorLayout = getFromLS("mirrorLayout") || [];
// const siderWidth = Number(localStorage.getItem('siderWidth'));
// const rowHeight = (document.documentElement.clientWidth - siderWidth - 24) / 20;
//
// interface Props {
//
// }
//
// interface State {
//   layout: any[],
//   mirrorLayout: any[],
//   isEdit: boolean,
//   isShopShow: boolean,
//   isDroppable: boolean,
//   currentChild: any,
// }
//
// export default class Content extends Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       layout: originalLayout,
//       mirrorLayout: originalMirrorLayout,
//       isEdit: false,
//       isShopShow: false,
//       isDroppable: true,
//       currentChild: {}
//     }
//   }
//
//   render() {
//     const {layout, isEdit, isShopShow, isDroppable} = this.state;
//     return (
//       <FixedGridLayout
//         {...this.props}
//         className={style["grid-layout"]}
//         layout={layout}
//         isDroppable={isEdit && isDroppable}
//         onLayoutChange={this.onLayoutChange}
//         onDrop={this.onDrop}
//         measureBeforeMount={false}
//         useCSSTransforms={true}
//         compactType={"vertical"}
//         cols={20}
//         rowHeight={rowHeight}
//       >
//         {this.getLayouts()}
//       </FixedGridLayout>
//     )
//   }
//
//   // 获取布局
//   getLayouts = () => {
//     const {mirrorLayout: layout, isEdit} = this.state;
//     return layout.length ? layout.map((item: any) => {
//       let children;
//       if (item.children && item.children.length) {
//         children = item.children.map((child: any) => {
//           return this.getChildDom(child, item)
//         })
//       }
//
//       return (
//         <div key={item.i} className={style['domWrap']}>
//           {isEdit ?
//             <>
//               <div className={style['domMask']}
//                    style={item.type === 'group' ? {width: '80%', height: 30, margin: 0} : {}}
//                    onMouseDown={isEdit && item.type !== 'group' ? this.onDomMouseDown : undefined}
//                    onMouseUp={isEdit && item.type !== 'group' ? (e: any) => this.onDomMouseUp(e, item) : undefined}
//               />
//               <span className={style['delete']} onClick={() => this.handleDelete(item)}>{<CloseOutlined/>}</span>
//             </>
//             : null}
//           {this.getDom(item, item.children, children)}
//         </div>
//       )
//     }) : null
//   }
//
//   // 根据不同的type生成不同的dom
//   getDom = (item: any, layout?: any, children?: any) => {
//     switch (item.type) {
//       case 'group' :
//         return (
//           <div className={style['groupWrap']}>
//             <h2>
//               {item.title}（{item.children ? item.children.length : 0}）
//               {this.state.isEdit &&
//               <Tooltip title={'点击切换分组及其子级的状态'} defaultVisible={true}>
//                 <Button style={{float: 'right', marginTop: 3, marginRight: 10}}
//                         type={'default'} size={'small'} shape={'circle'}
//                         onClick={() => this.onGroupStaticChange(item.i)}
//                         icon={<SwapOutlined/>}/>
//               </Tooltip>}
//             </h2>
//             <FixedGridLayout
//               {...this.props}
//               className={style["grid-layout--group"]}
//               layout={layout}
//               isDroppable={this.state.isEdit}
//               onDrop={(layoutList: any, dropItem: any, e: any) => this.onGroupDrop(layoutList, dropItem, e, item.i)}
//               onLayoutChange={(layout: any[]) => this.onGroupLayoutChange(layout, item.i)}
//               measureBeforeMount={false}
//               useCSSTransforms={true}
//               compactType={"vertical"}
//               cols={item.w}
//               rowHeight={rowHeight}
//             >
//               {children}
//             </FixedGridLayout>
//             <div id={'substitute-' + item.i} className={style['substitute']}
//                  onMouseUp={(e: any) => this.onSubMouseUp(e, item)}/>
//           </div>
//         );
//       case  'link':
//         return <a href={'https://www.baidu.com/'} target={'_blank'}>{item.i}</a>
//       case 'general':
//         return <p>{item.i}</p>
//       default:
//         return <p>{item.i}</p>
//     }
//   }
//
//   // 获取childDom
//   getChildDom = (item: any, father: any) => {
//     const {isEdit} = this.state;
//     let dom;
//     switch (item.type) {
//       case 'link':
//         dom = <a href={'https://www.baidu.com/'} target={'_blank'}>{item.i}</a>;
//         break
//       case 'general':
//         dom = <p>{item.i}</p>
//         break
//       default:
//         dom = <p>{item.i}</p>;
//     }
//
//     return (
//       <div key={item.i} data-grid={{...item, isBounded: true}} className={style['domWrap']}>
//         {isEdit && !item.static ?
//           <>
//             <div className={style['domMask']}
//                  onMouseDown={(e: any) => this.onChildMouseDown(e, item, father)}
//                  onMouseUp={this.onChildDomMouseUp}
//             />
//             <span className={style['delete']} onClick={() => this.handleChildDelete(item.i, father.i)}>
//               {<CloseOutlined/>}
//             </span>
//           </>
//           : null}
//         {dom}
//       </div>
//     )
//   }
//
//   // 鼠标按下
//   onDomMouseDown = (e: any) => {
//     // console.log(e.type, e)
//     // this.setState({isDroppable: false})
//   }
//
//   // 外部元素拖拽近group事件
//   onDomMouseUp = (e: any, child: any) => {
//     const {mirrorLayout} = this.state;
//     const groups = mirrorLayout.filter((item: any) => item.type === 'group');
//     if (!!groups.length) {
//       groups.forEach((item: any) => {
//         const xMin = item.x * rowHeight + siderWidth + 12, xMax = xMin + item.w * rowHeight;
//         const yMin = item.y * rowHeight + 64 + 12, yMax = yMin + item.h * rowHeight;
//
//         if (e.clientX > xMin && e.clientX < xMax && e.clientY > yMin && e.clientY < yMax) {
//           const {mirrorLayout, layout} = this.state;
//           const childX = Math.min(Math.max(0, Math.round((e.clientX - xMin) / rowHeight) - 1), xMax);
//           const childY = Math.min(Math.max(0, Math.round((e.clientY - yMin) / rowHeight) - 1), yMax);
//
//           const newMirrorLayout = mirrorLayout.filter((dom: any) => dom.i !== child.i);
//           const newLayout = layout.filter((dom: any) => dom.i !== child.i);
//           newMirrorLayout.forEach((group: any) => {
//             if (group.i === item.i) {
//               group.children.push({...child, x: childX, y: childY, isChild: true, static: !group.static})
//             }
//           })
//           this.setState({mirrorLayout: newMirrorLayout, layout: newLayout})
//         }
//       })
//     }
//   }
//
//   onChildMouseDown = (e: any, item: any, father: any) => {
//     const xMin = father.x * rowHeight + siderWidth + 12, xMax = xMin + father.w * rowHeight;
//     const yMin = father.y * rowHeight + 64 + 12, yMax = yMin + father.h * rowHeight;
//     const offsetX = e.nativeEvent.offsetX, offsetY = e.nativeEvent.offsetY;
//
//     document.onmousemove = (e: any) => {
//       const sub = document.getElementById('substitute-' + father.i) || {
//         style: {
//           display: 'none',
//           width: 0,
//           height: 0,
//           left: 0,
//           top: 0
//         }
//       };
//       if (e.clientX < xMin || e.clientX > xMax || e.clientY < yMin || e.clientY > yMax) {
//         const left = e.clientX - xMin - offsetX, top = e.clientY - yMin - offsetY;
//         sub.style.display = 'block';
//         sub.style.width = item.w * rowHeight + 'px';
//         sub.style.height = item.h * rowHeight + 'px';
//         sub.style.left = left + 'px';
//         sub.style.top = top + 'px';
//         this.setState({currentChild: item})
//       } else {
//         if (sub.style.display === 'block') {
//           sub.style.display = 'none'
//         }
//       }
//     }
//   }
//
//   // group内部元素往外拖拽事件
//   onChildDomMouseUp = () => {
//     document.onmousemove = null;
//   }
//
//   onSubMouseUp = (e: any, father: any) => {
//     document.onmousemove = null;
//     const sub = document.getElementById('substitute-' + father.i) || {style: {display: 'none'}};
//     sub.style.display = 'none';
//     const {currentChild, layout, mirrorLayout} = this.state;
//     const x = Math.max(0, Math.floor((e.clientX - siderWidth) / rowHeight) - 1);
//     const y = Math.max(0, Math.floor((e.clientY - 64) / rowHeight) - 1);
//     mirrorLayout.forEach((item: any, index: number) => {
//       if (item.i === father.i) {
//         mirrorLayout[index].children = mirrorLayout[index].children.filter((child: any) => child.i !== currentChild.i)
//       }
//     })
//     layout.push({...currentChild, x, y});
//     mirrorLayout.push({...currentChild, x, y})
//     this.setState({layout, mirrorLayout, currentChild: {}})
//   }
//
//   // 切换group及其子级的static值
//   onGroupStaticChange = (fatherI: string) => {
//     const {layout, mirrorLayout} = this.state;
//     mirrorLayout.forEach((item: any, index: number) => {
//       if (item.i === fatherI) {
//         layout[index].static = !item.static;
//         item.static = !item.static;
//         !!item.children.length && item.children.forEach((child: any) => {
//           child.static = !child.static;
//         })
//       }
//     })
//     this.setState({layout: [], mirrorLayout: []}, () => {
//       this.setState({layout, mirrorLayout})
//     })
//   }
//
//   // group的drop事件
//   onGroupDrop = (layoutList: any, dropItem: any, e: any, i: string) => {
//     const params = JSON.parse(e.dataTransfer.getData('text'));
//     const {layout, mirrorLayout} = this.state;
//     const newOne = {...params, x: dropItem.x, y: dropItem.y, static: false, isChild: true};
//     mirrorLayout.forEach((item: any) => {
//       if (item.i === i) {
//         item.children.push({...newOne, static: !item.static});
//       }
//     })
//     this.setState({mirrorLayout}, () => {
//       this.setState({
//         layout: layout.filter((item: any) => item.i !== newOne.i),
//         mirrorLayout: mirrorLayout.filter((item: any) => item.i !== newOne.i)
//       })
//     })
//   }
//
//   // group的layout发生变化
//   onGroupLayoutChange = (newLayout: any, groupI: string) => {
//     const {mirrorLayout} = this.state;
//     mirrorLayout.forEach((item: any) => {
//       if (item.i === groupI) {
//         !!item.children.length && item.children.forEach((lay: any, index: number) => {
//           const cur = newLayout[index];
//           item.children[index] = {...lay, w: cur['w'], h: cur['h'], x: cur['x'], y: cur['y']}
//         })
//       }
//     })
//     this.setState({mirrorLayout})
//   }
//
//   // 模块删除
//   handleDelete = ({i, children}: any) => {
//     if (children && !!children.length) {
//       message.error('请先删除分组的子级').then(r => r);
//       return
//     }
//     const {layout, mirrorLayout} = this.state;
//     const newLayout = layout.filter(item => item.i !== i);
//     const newMirrorLayout = mirrorLayout.filter(item => item.i !== i);
//     this.setState({layout: newLayout, mirrorLayout: newMirrorLayout})
//   }
//
//   // 分组内的元素删除
//   handleChildDelete = (childI: string, fatherI: string) => {
//     const {mirrorLayout} = this.state;
//     mirrorLayout.forEach((item: any) => {
//       if (item.i === fatherI) {
//         item.children = item.children.filter((child: any) => child.i !== childI)
//       }
//     })
//     this.setState({mirrorLayout})
//   }
//
//   // 拖拽放下时触发
//   onDrop = (layoutList: any, item: any, e: any) => {
//     const params = JSON.parse(e.dataTransfer.getData('text'));
//     const {layout, mirrorLayout} = this.state;
//     const newOne = {...params, x: item.x, y: item.y, static: false};
//     layout.push(newOne);
//     mirrorLayout.push(newOne);
//     this.setState({layout, mirrorLayout})
//   }
//
//   // 页面布局发生改变时触发
//   onLayoutChange = (layout: any[]) => {
//     const lay = layout.filter((item: any) => item.i !== "__dropping-elem__");
//     const {mirrorLayout} = this.state;
//     if (lay.length) {
//       lay.forEach((item: any, index: number) => {
//         mirrorLayout[index] = {...mirrorLayout[index], w: item.w, h: item.h, x: item.x, y: item.y}
//       })
//     }
//     this.setState({layout: lay, mirrorLayout})
//   }
// }
//
// // 从localstorage中取出布局
// function getFromLS(key: string) {
//   if (global.localStorage) {
//     const item = global.localStorage.getItem(key);
//     return item ? JSON.parse(item) : null
//   } else {
//     return null
//   }
// }
//
// // 将布局存入localstorage
// function setFormLS(key: string, value: any) {
//   if (global.localStorage) {
//     global.localStorage.setItem(key, JSON.stringify(value))
//   }
// }

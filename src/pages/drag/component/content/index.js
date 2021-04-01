import React, {Component} from "react";
import style from "./index.css";
import {Button, message, Tooltip} from 'antd';
import {CloseOutlined, SwapOutlined} from '@ant-design/icons';
import GridLayout, {WidthProvider} from 'react-grid-layout';
import {Chart, getBarOption} from "../index";

const FixedGridLayout = WidthProvider(GridLayout);
const originalLayout = getFromLS("layout") || [];
const originalMirrorLayout = getFromLS("mirrorLayout") || [];
const siderWidth = Number(localStorage.getItem('siderWidth'));
const rowHeight = (document.documentElement.clientWidth - siderWidth) / 30;

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: originalLayout,
      mirrorLayout: originalMirrorLayout,
      currentChild: {}
    }
  }

  render() {
    const {layout} = this.state, {isEdit} = this.props;
    return (
      <FixedGridLayout
        {...this.props}
        className={style["grid-layout"]}
        layout={layout}
        isDroppable={isEdit}
        onLayoutChange={this.onLayoutChange}
        onDrop={this.onDrop}
        measureBeforeMount={false}
        useCSSTransforms={true}
        compactType={"vertical"}
        cols={30}
        rowHeight={rowHeight}>
        {this.getLayouts()}
      </FixedGridLayout>
    )
  }

  // 获取布局
  getLayouts = () => {
    const {mirrorLayout: layout} = this.state, {isEdit} = this.props;
    return layout.length ? layout.map((item) => {
      let children;
      if (item.children && item.children.length) {
        children = item.children.map((child) => {
          return this.getChildDom(child, item)
        })
      }

      return (
        <div key={item.i} className={style['domWrap']}>
          {isEdit ?
            <>
              <div
                className={style['domMask']}
                style={item.type === 'group' ? {width: '80%', height: 30, margin: 0} : {}}
                onMouseUp={isEdit && item.type !== 'group' ? (e) => this.onDomMouseUp(e, item) : undefined}/>
              <span className={style['delete']} onClick={() => this.handleDelete(item)}>{<CloseOutlined/>}</span>
            </>
            : null}
          {this.getDom(item, item.children, children)}
        </div>
      )
    }) : null
  }

  // 根据不同的type生成不同的dom
  getDom = (item, layout, children) => {
    const {isEdit} = this.props;
    switch (item.type) {
      case 'group' :
        return (
          <div className={style['groupWrap']}>
            <h2>
              {item.title}（{item.children ? item.children.length : 0}）
              {isEdit &&
              <Tooltip title={'点击切换分组及其子级的状态'} defaultVisible={true}>
                <Button style={{float: 'right', marginTop: 3, marginRight: 10}}
                        type={'default'} size={'small'} shape={'circle'}
                        onClick={() => this.onGroupStaticChange(item.i)}
                        icon={<SwapOutlined/>}/>
              </Tooltip>}
            </h2>
            <FixedGridLayout
              {...this.props}
              className={style["grid-layout--group"]}
              layout={layout}
              isDroppable={isEdit}
              onDrop={(layoutList, dropItem, e) => this.onGroupDrop(layoutList, dropItem, e, item.i)}
              onLayoutChange={(layout) => this.onGroupLayoutChange(layout, item.i)}
              measureBeforeMount={false}
              useCSSTransforms={true}
              compactType={"vertical"}
              cols={item.w}
              rowHeight={rowHeight}
            >
              {children}
            </FixedGridLayout>
            <div id={'substitute-' + item.i} className={style['substitute']}
                 onMouseUp={(e) => this.onSubMouseUp(e, item)}/>
          </div>
        );
      case 'test':
        return <p>{item.i}</p>
      case  'link':
        return <a href={'https://www.baidu.com/'} target={'_blank'}>{item.i}</a>
      case 'bar':
        const option = getBarOption();
        return <Chart id={item.i} option={option} w={item.w} h={item.h}/>
      default:
        return <p>{item.i}</p>
    }
  }

  // 获取childDom
  getChildDom = (item, father) => {
    const {isEdit} = this.props;
    let dom;
    switch (item.type) {
      case 'link':
        dom = <a href={'https://www.baidu.com/'} target={'_blank'}>{item.i}</a>;
        break
      case 'general':
        dom = <p>{item.i}</p>
        break
      default:
        dom = <p>{item.i}</p>;
    }

    return (
      <div key={item.i} data-grid={{...item, isBounded: true}} className={style['domWrap']}>
        {isEdit && !item.static ?
          <>
            <div className={style['domMask']}
                 onMouseDown={(e) => this.onChildMouseDown(e, item, father)}
                 onMouseUp={this.onChildDomMouseUp}
            />
            <span className={style['delete']} onClick={() => this.handleChildDelete(item.i, father.i)}>
              {<CloseOutlined/>}
            </span>
          </>
          : null}
        {dom}
      </div>
    )
  }

  // 外部元素拖拽进group事件
  onDomMouseUp = (e, child) => {
    const {mirrorLayout} = this.state;
    const groups = mirrorLayout.filter((item) => item.type === 'group');
    if (!!groups.length) {
      groups.forEach((item) => {
        const xMin = item.x * rowHeight + siderWidth + 10, xMax = xMin + item.w * rowHeight;
        const yMin = item.y * rowHeight + 64 + 10, yMax = yMin + item.h * rowHeight;

        if (e.clientX > xMin && e.clientX < xMax && e.clientY > yMin && e.clientY < yMax) {
          const {mirrorLayout, layout} = this.state;
          const childX = Math.min(Math.max(0, Math.round((e.clientX - xMin) / rowHeight) - 1), xMax);
          const childY = Math.min(Math.max(0, Math.round((e.clientY - yMin) / rowHeight) - 1), yMax);

          const newMirrorLayout = mirrorLayout.filter((dom) => dom.i !== child.i);
          const newLayout = layout.filter((dom) => dom.i !== child.i);
          newMirrorLayout.forEach((group) => {
            if (group.i === item.i) {
              group.children.push({...child, x: childX, y: childY, isChild: true, static: !group.static})
            }
          })
          this.setState({mirrorLayout: newMirrorLayout, layout: newLayout})
        }
      })
    }
  }

  // group内部元素往外拖的down事件
  onChildMouseDown = (e, item, father) => {
    const xMin = father.x * rowHeight + siderWidth + 10, xMax = xMin + father.w * rowHeight;
    const yMin = father.y * rowHeight + 64 + 10, yMax = yMin + father.h * rowHeight;
    const offsetX = e.nativeEvent.offsetX, offsetY = e.nativeEvent.offsetY;

    document.onmousemove = (e) => {
      const sub = document.getElementById('substitute-' + father.i) || {
        style: {
          display: 'none',
          width: 0,
          height: 0,
          left: 0,
          top: 0
        }
      };
      if (e.clientX < xMin || e.clientX > xMax || e.clientY < yMin || e.clientY > yMax) {
        const left = e.clientX - xMin - offsetX, top = e.clientY - yMin - offsetY;
        sub.style.display = 'block';
        sub.style.width = item.w * rowHeight + 'px';
        sub.style.height = item.h * rowHeight + 'px';
        sub.style.left = left + 'px';
        sub.style.top = top + 'px';
        this.setState({currentChild: item})
      } else {
        if (sub.style.display === 'block') {
          sub.style.display = 'none'
        }
      }
    }
  }

  // 在group内部up事件
  onChildDomMouseUp = () => {
    document.onmousemove = null;
  }

  // group内部元素往外拖拽事件
  // ps:内部元素无法直接移出group,需要一个色块做承接;
  onSubMouseUp = (e, father) => {
    document.onmousemove = null;
    const sub = document.getElementById('substitute-' + father.i) || {style: {display: 'none'}};
    sub.style.display = 'none';
    const {currentChild, layout, mirrorLayout} = this.state;
    const x = Math.max(0, Math.floor((e.clientX - siderWidth) / rowHeight) - 1);
    const y = Math.max(0, Math.floor((e.clientY - 64) / rowHeight) - 1);
    mirrorLayout.forEach((item, index) => {
      if (item.i === father.i) {
        mirrorLayout[index].children = mirrorLayout[index].children.filter((child) => child.i !== currentChild.i)
      }
    })
    layout.push({...currentChild, x, y});
    mirrorLayout.push({...currentChild, x, y})
    this.setState({layout, mirrorLayout, currentChild: {}})
  }

  // 切换group及其子级的static值
  onGroupStaticChange = (fatherI) => {
    const {layout, mirrorLayout} = this.state;
    mirrorLayout.forEach((item, index) => {
      if (item.i === fatherI) {
        layout[index].static = !item.static;
        item.static = !item.static;
        !!item.children.length && item.children.forEach((child) => {
          child.static = !child.static;
        })
      }
    })
    this.setState({layout: [], mirrorLayout: []}, () => {
      this.setState({layout, mirrorLayout})
    })
  }

  // group的drop事件
  onGroupDrop = (layoutList, dropItem, e, i) => {
    const params = JSON.parse(e.dataTransfer.getData('text'));
    const {layout, mirrorLayout} = this.state;
    const newOne = {...params, x: dropItem.x, y: dropItem.y, static: false, isChild: true};
    mirrorLayout.forEach((item) => {
      if (item.i === i) {
        item.children.push({...newOne, static: !item.static});
      }
    })
    this.setState({mirrorLayout}, () => {
      this.setState({
        layout: layout.filter((item) => item.i !== newOne.i),
        mirrorLayout: mirrorLayout.filter((item) => item.i !== newOne.i)
      })
    })
  }

  // group的layout发生变化
  onGroupLayoutChange = (newLayout, groupI) => {
    const {mirrorLayout} = this.state;
    mirrorLayout.forEach((item) => {
      if (item.i === groupI) {
        !!item.children.length && item.children.forEach((lay, index) => {
          const cur = newLayout[index];
          item.children[index] = {...lay, w: cur['w'], h: cur['h'], x: cur['x'], y: cur['y']}
        })
      }
    })
    this.setState({mirrorLayout})
  }

  // 模块删除
  handleDelete = ({i, children}) => {
    if (children && !!children.length) {
      message.error('请先删除分组的子级').then(r => r);
      return
    }
    const {layout, mirrorLayout} = this.state;
    const newLayout = layout.filter(item => item.i !== i);
    const newMirrorLayout = mirrorLayout.filter(item => item.i !== i);
    this.setState({layout: newLayout, mirrorLayout: newMirrorLayout})
  }

  // 分组内的元素删除
  handleChildDelete = (childI, fatherI) => {
    const {mirrorLayout} = this.state;
    mirrorLayout.forEach((item) => {
      if (item.i === fatherI) {
        item.children = item.children.filter((child) => child.i !== childI)
      }
    })
    this.setState({mirrorLayout})
  }

  // 拖拽放下时触发
  onDrop = (layoutList, item, e) => {
    const params = JSON.parse(e.dataTransfer.getData('text'));
    const {layout, mirrorLayout} = this.state;
    const newOne = {...params, x: item.x, y: item.y, static: false};
    layout.push(newOne);
    mirrorLayout.push(newOne);
    this.setState({layout, mirrorLayout})
  }

  // 页面布局发生改变时触发
  onLayoutChange = (layout) => {
    const lay = layout.filter((item) => item.i !== "__dropping-elem__");
    const {mirrorLayout} = this.state;
    if (lay.length) {
      lay.forEach((item, index) => {
        mirrorLayout[index] = {...mirrorLayout[index], w: item.w, h: item.h, x: item.x, y: item.y}
      })
    }
    this.setState({layout: lay, mirrorLayout})
  }

  // 新增分组
  handleAddGroup = (item) => {
    const {layout, mirrorLayout} = this.state;
    const group = {i: new Date().getTime().toString(), ...item};
    layout.push(group);
    mirrorLayout.push(group);
    this.setState({layout, mirrorLayout})
  }

  handleSetState = (status) => {
    if (status === 'cancel') {
      this.setState({
        layout: getFromLS('layout'),
        mirrorLayout: getFromLS('mirrorLayout')
      })
    } else {
      const {layout, mirrorLayout} = this.state;
      const newLayout = this.changeLayoutStatic(layout, status === 'edit');
      const newMirrorLayout = this.changeLayoutStatic(mirrorLayout, status === 'edit');
      this.setState({layout: [], mirrorLayout: []}, () => {
        this.setState({
          layout: newLayout,
          mirrorLayout: newMirrorLayout
        })
      })
      if (status === 'save') {
        setFormLS('layout', newLayout);
        setFormLS('mirrorLayout', newMirrorLayout);
      }
    }

  }

  // 将layout转成静态/动态
  changeLayoutStatic = (list, isEdit) => {
    list.forEach((item) => {
      item.static = !isEdit;
      if (item.children && item.children.length && !isEdit) {
        item.children.forEach((child) => {
          child.static = true;
        })
      }
    });
    return list
  }
}

// 从localstorage中取出布局
function getFromLS(key) {
  if (global.localStorage) {
    const item = global.localStorage.getItem(key);
    return item ? JSON.parse(item) : null
  } else {
    return null
  }
}

// 将布局存入localstorage
function setFormLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(key, JSON.stringify(value))
  }
}

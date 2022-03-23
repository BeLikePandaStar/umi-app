import React, { Component, MouseEvent, ReactElement } from 'react';
import style from './index.css';
import { Button, message, Tooltip } from 'antd';
import { CloseOutlined, SwapOutlined } from '@ant-design/icons';
import GridLayout from 'react-grid-layout';
import { Chart, getBarOption } from '../index';
import { ListComponent, TextComponent, LinkComponent } from '../goods';

const siderWidth = Number(localStorage.getItem('siderWidth'));
const topBarHeight = 64;
const originalLayout = getFromLS('layout') || [];
const originalMirrorLayout = getFromLS('mirrorLayout') || [];
const contentWidth = document.documentElement.offsetWidth - siderWidth;
const rowHeight = contentWidth / 30;

interface GoodsItemDataList {
  id: string;
  name: string;
  gender: string;
  age: string;
}

interface GoodsItemDataObj {
  title: string;
  list?: string[];
  content?: string;
  url?: string;
  imgSrc?: string;
}

export interface LayoutChild {
  i: string;
  w: number;
  minW: number;
  maxW: number;
  h: number;
  minH: number;
  maxH: number;
  x: number;
  y: number;
  static: boolean;
  isResizable?: boolean;
  isSize: boolean;
  type?: string;
  data: GoodsItemDataObj | string[] | GoodsItemDataList[] | string[][];
}

export interface Layout extends LayoutChild {
  title?: string;
  children?: LayoutChild[];
}

interface Props {
  isEdit: boolean;
}

interface State {
  layout: Layout[];
  mirrorLayout: Layout[];
  currentChild: LayoutChild | {};
}

export default class Content extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      layout: originalLayout,
      mirrorLayout: originalMirrorLayout,
      currentChild: {},
    };
  }

  render() {
    const { layout } = this.state,
      { isEdit } = this.props;
    return (
      <GridLayout
        {...this.props}
        width={contentWidth}
        className={style['grid-layout']}
        layout={layout}
        isDroppable={isEdit}
        onLayoutChange={this.onLayoutChange}
        onDrop={this.onDrop}
        useCSSTransforms={true}
        compactType={'vertical'}
        cols={30}
        margin={[0, 0]}
        containerPadding={[10, 10]}
        rowHeight={rowHeight}
      >
        {this.getLayouts()}
      </GridLayout>
    );
  }

  // 获取布局
  getLayouts = () => {
    const { mirrorLayout: layout } = this.state,
      { isEdit } = this.props;
    return layout.length
      ? layout.map((item) => {
          let children;
          if (item.children && item.children.length) {
            children = item.children.map((child) => {
              return this.getChildDom(child, item);
            });
          }

          return (
            <div
              key={item.i}
              className={style['domWrap']}
              onClick={(e) => e.stopPropagation()}
            >
              {isEdit && (
                <span
                  className={style['delete']}
                  onClick={(e) => this.handleDelete(e, item)}
                >
                  {<CloseOutlined />}
                </span>
              )}
              {isEdit && (
                <div
                  className={style['domMask']}
                  style={item.type === 'group' ? { height: 20 } : {}}
                  onMouseUp={
                    item.type !== 'group'
                      ? (e) => this.onDomMouseUp(e, item)
                      : undefined
                  }
                />
              )}
              <div className={style['domContent']}>
                {this.getDom(item, item.children, children)}
              </div>
            </div>
          );
        })
      : null;
  };

  // 根据不同的type生成不同的dom
  getDom = (
    item: Layout,
    layout: LayoutChild[] | undefined,
    children: ReactElement[] | undefined,
  ) => {
    const { isEdit } = this.props;
    switch (item.type) {
      case 'group':
        return (
          <div className={style['groupWrap']}>
            <h2>
              {item.title}（{item.children ? item.children.length : 0}）
              {isEdit && (
                <Tooltip
                  title={'点击切换分组及其子级的状态'}
                  defaultVisible={false}
                >
                  <Button
                    style={{
                      float: 'right',
                      marginTop: 3,
                      marginRight: 10,
                      zIndex: 100,
                    }}
                    type={'default'}
                    size={'small'}
                    shape={'circle'}
                    onClick={() => this.onGroupStaticChange(item.i)}
                    icon={<SwapOutlined />}
                  />
                </Tooltip>
              )}
            </h2>
            <GridLayout
              {...this.props}
              className={style['grid-layout--group']}
              layout={layout}
              isDroppable={isEdit}
              onDrop={(
                layoutList: LayoutChild[],
                dropItem: LayoutChild,
                e: DragEvent,
              ) => this.onGroupDrop(layoutList, dropItem, e, item.i)}
              onLayoutChange={(layout: LayoutChild[]) =>
                this.onGroupLayoutChange(layout, item.i)
              }
              useCSSTransforms={true}
              compactType={'vertical'}
              width={rowHeight * item.w}
              cols={item.w}
              margin={[0, 0]}
              containerPadding={[0, 0]}
              rowHeight={rowHeight}
            >
              {children}
            </GridLayout>
            <div
              id={'substitute-' + item.i}
              className={style['substitute']}
              onMouseUp={(e) => this.onSubMouseUp(e, item)}
            />
          </div>
        );
      case 'list':
        // @ts-ignore
        return <ListComponent data={item.data} />;
      case 'text':
        // @ts-ignore
        return <TextComponent data={item.data} />;
      case 'link':
        // @ts-ignore
        return <LinkComponent data={item.data} />;
      case 'bar':
        const option = getBarOption();
        return <Chart id={item.i} option={option} w={item.w} h={item.h} />;
      default:
        return <p>{item.i}</p>;
    }
  };

  // 获取childDom
  getChildDom = (item: LayoutChild, father: Layout) => {
    const { isEdit } = this.props;
    let dom;
    switch (item.type) {
      case 'link':
        dom = (
          <a href={'https://www.baidu.com/'} target={'_blank'}>
            {item.i}
          </a>
        );
        break;
      case 'general':
        dom = <p>{item.i}</p>;
        break;
      default:
        dom = <p>{item.i}</p>;
    }

    return (
      <div
        key={item.i}
        data-grid={{ ...item, isBounded: true }}
        className={style['domWrap']}
      >
        {isEdit && !item.static ? (
          <>
            <div
              className={style['domMask']}
              onMouseDown={(e) => this.onChildMouseDown(e, item, father)}
              onMouseUp={this.onChildDomMouseUp}
            />
            <span
              className={style['delete']}
              onClick={() => this.handleChildDelete(item.i, father.i)}
            >
              {<CloseOutlined />}
            </span>
          </>
        ) : null}
        <div className={style['domContent']}>{dom}</div>
      </div>
    );
  };

  // 外部元素拖拽进group事件
  onDomMouseUp = (e: MouseEvent, child: LayoutChild) => {
    const { mirrorLayout } = this.state;
    const groups = mirrorLayout.filter((item) => item.type === 'group');
    if (!!groups.length) {
      groups.forEach((item) => {
        const xMin = siderWidth + 10 + item.x * rowHeight + 5, // 距屏幕的左边距 = 侧边栏宽度 + containerPadding + x + margin
          xMax = xMin + item.w * rowHeight - 10;
        const yMin = topBarHeight + 10 + item.y * rowHeight + 5,
          yMax = yMin + item.h * rowHeight - 10;

        if (
          e.clientX > xMin &&
          e.clientX < xMax &&
          e.clientY > yMin &&
          e.clientY < yMax
        ) {
          const { mirrorLayout, layout } = this.state;
          const childX = Math.min(
            Math.max(0, Math.round((e.clientX - xMin) / rowHeight) - 1),
            xMax,
          );
          const childY = Math.min(
            Math.max(0, Math.round((e.clientY - yMin) / rowHeight) - 1),
            yMax,
          );

          const newMirrorLayout = mirrorLayout.filter(
            (dom) => dom.i !== child.i,
          );
          const newLayout = layout.filter((dom) => dom.i !== child.i);
          newMirrorLayout.forEach((group) => {
            if (group.i === item.i) {
              group.children!.push({
                ...child,
                x: childX,
                y: childY,
                static: !group.static,
              });
            }
          });
          this.setState({ mirrorLayout: newMirrorLayout, layout: newLayout });
        }
      });
    }
  };

  // group内部元素往外拖的down事件
  onChildMouseDown = (e: MouseEvent, item: LayoutChild, father: Layout) => {
    const xMin = siderWidth + 10 + father.x * rowHeight + 5,
      xMax = xMin + father.w * rowHeight - 10;
    const yMin = topBarHeight + 10 + father.y * rowHeight + 5,
      yMax = yMin + father.h * rowHeight - 10;
    const offsetX = e.nativeEvent.offsetX,
      offsetY = e.nativeEvent.offsetY;

    document.onmousemove = (e) => {
      const sub = document.getElementById('substitute-' + father.i) || {
        style: {
          display: 'none',
          width: 0,
          height: 0,
          left: 0,
          top: 0,
        },
      };
      if (
        e.clientX < xMin ||
        e.clientX > xMax ||
        e.clientY < yMin ||
        e.clientY > yMax
      ) {
        const left = e.clientX - xMin - offsetX - 10,
          top = e.clientY - yMin - offsetY - 10;
        sub.style.display = 'block';
        sub.style.width = item.w * rowHeight + 'px';
        sub.style.height = item.h * rowHeight + 'px';
        sub.style.left = left + 'px';
        sub.style.top = top + 'px';
        this.setState({ currentChild: item });
      } else {
        if (sub.style.display === 'block') {
          sub.style.display = 'none';
        }
      }
    };
  };

  // 在group内部up事件
  onChildDomMouseUp = () => {
    document.onmousemove = null;
  };

  // group内部元素往外拖拽事件
  // ps:内部元素无法直接移出group,需要一个色块做承接;
  onSubMouseUp = (e: MouseEvent, father: Layout) => {
    document.onmousemove = null;
    const sub = document.getElementById('substitute-' + father.i) || {
      style: { display: 'none' },
    };
    sub.style.display = 'none';
    const { currentChild, layout, mirrorLayout } = this.state;
    const x = Math.max(0, Math.floor((e.clientX - siderWidth) / rowHeight) - 1);
    const y = Math.max(0, Math.floor((e.clientY - 64) / rowHeight) - 1);
    mirrorLayout.forEach((item, index) => {
      if (item.i === father.i) {
        if ('i' in currentChild) {
          mirrorLayout[index].children = mirrorLayout[index].children!.filter(
            (child) => child.i !== currentChild.i,
          );
        }
      }
    });
    // @ts-ignore
    layout.push({ ...currentChild, x, y });
    // @ts-ignore
    mirrorLayout.push({ ...currentChild, x, y });
    this.setState({ layout: [], mirrorLayout: [], currentChild: {} }, () => {
      this.setState({ layout, mirrorLayout });
    });
  };

  // 切换group及其子级的static值
  onGroupStaticChange = (fatherI: string) => {
    const { layout, mirrorLayout } = this.state;
    mirrorLayout.forEach((item, index) => {
      if (item.i === fatherI) {
        layout[index].static = !item.static;
        item.static = !item.static;
        item.children!.length &&
          item.children!.forEach((child) => {
            child.static = !item.static;
            child.isResizable = !item.static ? false : child.isSize;
          });
      }
    });
    this.setState({ layout: [], mirrorLayout: [] }, () => {
      this.setState({ layout, mirrorLayout });
    });
  };

  // group的drop事件
  onGroupDrop = (
    layoutList: LayoutChild[],
    dropItem: LayoutChild,
    e: DragEvent,
    i: string,
  ) => {
    const params = JSON.parse(e.dataTransfer!.getData('text'));
    const { layout, mirrorLayout } = this.state;
    const newOne = {
      ...params,
      x: dropItem.x,
      y: dropItem.y,
      static: false,
      isResizable: params.isSize,
    };
    mirrorLayout.forEach((item) => {
      if (item.i === i) {
        item.children!.push({ ...newOne, static: !item.static });
      }
    });
    this.setState({ mirrorLayout }, () => {
      this.setState({
        layout: layout.filter((item) => item.i !== newOne.i),
        mirrorLayout: mirrorLayout.filter((item) => item.i !== newOne.i),
      });
    });
  };

  // group的layout发生变化
  onGroupLayoutChange = (newLayout: LayoutChild[], groupI: string) => {
    const { mirrorLayout } = this.state;
    mirrorLayout.forEach((item) => {
      if (item.i === groupI) {
        item.children!.length &&
          item.children!.forEach((lay, index) => {
            const cur = newLayout[index];
            item.children![index] = {
              ...lay,
              w: cur['w'],
              h: cur['h'],
              x: cur['x'],
              y: cur['y'],
            };
          });
      }
    });
    this.setState({ mirrorLayout });
  };

  // 模块删除
  handleDelete = (e: MouseEvent, item: Layout) => {
    e.stopPropagation();
    const { i, children } = item;
    if (children && !!children.length) {
      message.error('请先删除分组的子级').then((r) => r);
      return;
    }
    const { layout, mirrorLayout } = this.state;
    const newLayout = layout.filter((item) => item.i !== i);
    const newMirrorLayout = mirrorLayout.filter((item) => item.i !== i);
    this.setState({ layout: newLayout, mirrorLayout: newMirrorLayout });
  };

  // 分组内的元素删除
  handleChildDelete = (childI: string, fatherI: string) => {
    const { mirrorLayout } = this.state;
    mirrorLayout.forEach((item) => {
      if (item.i === fatherI) {
        item.children = item.children!.filter((child) => child.i !== childI);
      }
    });
    this.setState({ mirrorLayout });
  };

  // 拖拽放下时触发
  onDrop = (layoutList: LayoutChild[], item: LayoutChild, e: DragEvent) => {
    const params = JSON.parse(e.dataTransfer!.getData('text'));
    const { layout, mirrorLayout } = this.state;
    const newOne = {
      ...params,
      x: item.x,
      y: item.y,
      static: false,
      isResizable: params.isSize,
    };
    layout.push(newOne);
    mirrorLayout.push(newOne);
    this.setState({ layout, mirrorLayout });
  };

  // 页面布局发生改变时触发
  onLayoutChange = (layout: Layout[]) => {
    const lay = layout.filter((item) => item.i !== '__dropping-elem__');
    const { mirrorLayout } = this.state;
    if (lay.length) {
      lay.forEach((item, index) => {
        mirrorLayout[index] = {
          ...mirrorLayout[index],
          w: item.w,
          h: item.h,
          x: item.x,
          y: item.y,
        };
      });
    }
    this.setState({ layout: lay, mirrorLayout });
  };

  // 新增分组
  handleAddGroup = (item: Layout) => {
    const { layout, mirrorLayout } = this.state;
    layout.push(item);
    mirrorLayout.push(item);
    this.setState({ layout: [], mirrorLayout: [] }, () => {
      this.setState({ layout, mirrorLayout });
    });
  };

  // 点击取消、返回以及保存的事件
  handleSetState = (status: string) => {
    if (status === 'cancel') {
      this.setState({
        layout: getFromLS('layout'),
        mirrorLayout: getFromLS('mirrorLayout'),
      });
    } else {
      const { newLayout, newMirrorLayout } = this.changeLayoutStatic(
        status === 'edit',
      );
      this.setState({ layout: [], mirrorLayout: [] }, () => {
        this.setState({
          layout: newLayout,
          mirrorLayout: newMirrorLayout,
        });
      });
      if (status === 'save') {
        setFormLS('layout', newLayout);
        setFormLS('mirrorLayout', newMirrorLayout);
      }
    }
  };

  // 将layout转成静态/动态
  changeLayoutStatic = (isEdit: boolean) => {
    const { layout, mirrorLayout } = this.state;
    mirrorLayout.forEach((item, index) => {
      item.static = !isEdit;
      layout[index].static = !isEdit;
      item.isResizable = isEdit ? item.isSize : false;
      layout[index].isResizable = isEdit ? item.isSize : false;
      if (item.children && item.children.length && !isEdit) {
        item.children.forEach((child) => {
          child.static = true;
          child.isResizable = false;
        });
      }
    });
    return { newLayout: layout, newMirrorLayout: mirrorLayout };
  };
}

// 从localstorage中取出布局
function getFromLS(key: string) {
  if (global.localStorage) {
    const item = global.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } else {
    return null;
  }
}

// 将布局存入localstorage
function setFormLS(key: string, value: Layout[]) {
  if (global.localStorage) {
    global.localStorage.setItem(key, JSON.stringify(value));
  }
}

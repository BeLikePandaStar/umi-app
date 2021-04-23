import React, { Component, DragEvent } from 'react';
import { connect, DragModelState, Dispatch } from 'umi';
import style from './index.css';
import { Select, Input, Button, Collapse } from 'antd';
import {
  AppstoreOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { LayoutChild } from '../content';

const { Panel } = Collapse;

interface Props {
  handleShopToggle: (isShow: boolean) => void;
  isShow: boolean;
  isEdit: boolean;
  options: DragModelState['options'];
  getStoreList: (payload: {}) => void;
  data: DragModelState['data'];
}

interface State {}

// 右侧工具条
class ToolBar extends Component<Props, State> {
  render() {
    const { handleShopToggle, isShow, isEdit, options } = this.props;
    return (
      <div
        className={style['shopWrap']}
        style={isEdit ? { display: 'block' } : { display: 'none' }}
      >
        <Button
          className={style['toggleBtn']}
          icon={isShow ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => handleShopToggle(!isShow)}
        />
        <div
          className={style['toolBar__wrap']}
          style={
            isShow
              ? { width: 460, visibility: 'visible' }
              : { width: 0, visibility: 'hidden' }
          }
        >
          <h2 className={style['toolBar__title']}>
            <AppstoreOutlined className={style['toolBar__title__icon']} />
            磁贴商店()
          </h2>
          <div className={style['toolBar__content']}>
            <div className={style['toolBar__searchBar']}>
              <Select
                className={style['toolBar__searchBar--select']}
                defaultValue={''}
                options={options}
              />
              <Input
                className={style['toolBar__searchBar--input']}
                suffix={<SearchOutlined />}
              />
            </div>
            <div className={style['toolBar__listWrap']}>
              {this.getCollapse()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.getStoreList({});
  }

  // 获取磁贴折叠面板
  getCollapse = () => {
    const { data } = this.props;
    return !!data.length ? (
      <Collapse>
        {data.map((item) => (
          <Panel key={item.id} header={item.title}>
            <div className={style['panel__content']}>
              {item.children.map((child) => {
                const { isSize, minW, maxW, minH, maxH } = JSON.parse(
                  child.templateConfig,
                );
                return (
                  <div
                    key={child.id}
                    className={style['goodsItem']}
                    draggable={true}
                    onDragStart={(e: DragEvent) =>
                      this.onDragStart(e, {
                        i: new Date().getTime().toString(),
                        w: minW,
                        h: minH,
                        minW,
                        maxW,
                        minH,
                        maxH,
                        x: 0,
                        y: 0,
                        isSize,
                        static: false,
                        type: child.templateTypeCode,
                        data: child.data,
                      })
                    }
                    onDragEnd={(e) => this.onDragEnd(e)}
                  >
                    <p title={child.title}>{child.title}</p>
                    <img src={child.thumbnail} alt="" />
                  </div>
                );
              })}
            </div>
          </Panel>
        ))}
      </Collapse>
    ) : (
      []
    );
  };

  // model
  onDragStart = (e: DragEvent, params: LayoutChild) => {
    // e.currentTarget.style.border = '2px dashed rgb(240, 194, 199)';
    e.dataTransfer!.setData('text/plain', JSON.stringify(params));
  };

  onDragEnd = (e: DragEvent) => {
    // e.currentTarget.style.border = 'none';
  };
}

const mapStateToProps = ({ drag }: { drag: DragModelState }) => drag;

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getStoreList: (payload: any) => {
      dispatch({ type: 'drag/getStoreList', payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);

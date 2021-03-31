import React, {Component} from 'react';
import style from "./index.css";
import {Select, Input, Button} from 'antd';
import {AppstoreOutlined, SearchOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons';

const options = [
  {label: '全部应用磁贴', value: ''},
  {label: '个人工作台', value: 'workbench'},
  {label: '演示', value: 'zlproforce'},
  {label: '调度专题', value: 'ddzt'}
];

interface Props {
  onDragStart: any,
  onDragEnd: any,
  isShow: boolean,
  isEdit: boolean,
  handleShopToggle: any,
}

interface State {

}

// 右侧工具条
export default class ToolBar extends Component<Props, State> {
  render() {
    const {onDragStart, onDragEnd, handleShopToggle, isShow, isEdit} = this.props;
    return (
      <div className={style['shopWrap']} style={isEdit ? {display: 'block'} : {display: 'none'}}>
        <Button
          className={style['toggleBtn']}
          icon={isShow ? <RightOutlined/> : <LeftOutlined/>}
          onClick={() => handleShopToggle(!isShow)}/>
        <div className={style['toolBar__wrap']}
             style={isShow ? {width: 460, visibility: 'visible'} : {width: 0, visibility: 'hidden'}}>
          <h2 className={style['toolBar__title']}>
            <AppstoreOutlined className={style['toolBar__title__icon']}/>磁贴商店()
          </h2>
          <div className={style['toolBar__content']}>
            <div className={style['toolBar__searchBar']}>
              <Select
                className={style['toolBar__searchBar--select']}
                defaultValue={''}
                options={options}/>
              <Input
                className={style['toolBar__searchBar--input']}
                suffix={<SearchOutlined/>}/>
            </div>
            <div className={style['toolBar__listWrap']}>
              <div className={style['model-1']}
                   draggable={true}
                   onDragStart={(e) => onDragStart(e, {w: 2, h: 2, type: 'text'})}
                   onDragEnd={(e) => onDragEnd(e)}>
                <p>
                  2*2-文本
                </p>
              </div>
              <div className={style['model-1']}
                   draggable={true}
                   onDragStart={(e) => onDragStart(e, {w: 2, h: 2, type: 'link'})}
                   onDragEnd={(e) => onDragEnd(e)}>
                <p>
                  2*2-链接
                </p>
              </div>
              <div className={style['model-1']}
                   draggable={true}
                   onDragStart={(e) => onDragStart(e, {w: 3, h: 3, type: 'bar'})}
                   onDragEnd={(e) => onDragEnd(e)}>
                <p>
                  3*3-柱图
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

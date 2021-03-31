import React, {Component} from 'react';
import style from './index.css';
import {Content, ActionArea, ToolBar} from './component';

// 拖拽
export default class Drag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      isShopShow: false,
    }
  }

  render() {
    const {isEdit, isShopShow} = this.state;
    return (
      <div className={style['dragPage__content']}>
        <div className={style['content__left']}>
          <Content
            ref={ele => this.contentEle = ele}
            isEdit={isEdit}/>
        </div>
        <div className={style['content__right']}>
          {/*右侧工具栏*/}
          <ToolBar
            isEdit={isEdit}
            isShow={isShopShow}
            handleShopToggle={this.handleShopToggle}/>
          {/*右下角操作按钮*/}
          <ActionArea
            isEdit={isEdit}
            handleEdit={this.handleEdit}
            handleAddGroup={(item) => this.contentEle.handleAddGroup(item)}
            handleSave={this.handleSave}
            handleCancel={this.handleCancel}
            handleShopToggle={this.handleShopToggle}/>
        </div>
      </div>
    )
  }

  componentDidMount() {
    // if (global.localStorage) {
    //   global.localStorage.clear();
    // }
  }

  // 点击编辑按钮
  handleEdit = () => {
    this.setState({isEdit: true}, () => {
      this.contentEle.handleSetState('edit')
    })
  }

  // 保存当前布局
  handleSave = () => {
    this.setState({isEdit: false}, () => {
      this.contentEle.handleSetState('save')
    })
  }

  // 不保存当前布局
  handleCancel = () => {
    this.setState({isEdit: false}, () => {
      this.contentEle.handleSetState('cancel')
    })
  }

  // 控制磁贴商店的显示或隐藏
  handleShopToggle = (isShow) => {
    this.setState({isShopShow: isShow})
  }
}

import React, { Component, createRef } from 'react';
import style from './index.css';
import { Content, ActionArea, ToolBar } from './component';
import { Layout } from './component/content';

interface Props {}

interface State {
  isEdit: boolean;
  isShopShow: boolean;
}

// 拖拽
export default class Drag extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEdit: false,
      isShopShow: false,
    };
  }

  private contentEle = createRef<Content>();

  render() {
    const { isEdit, isShopShow } = this.state;
    return (
      <div className={style['dragPage__content']}>
        <div className={style['content__left']}>
          <Content ref={this.contentEle} isEdit={isEdit} />
        </div>
        <div className={style['content__right']}>
          {/*右侧工具栏*/}
          <ToolBar
            isEdit={isEdit}
            isShow={isShopShow}
            handleShopToggle={this.handleShopToggle}
          />
          {/*右下角操作按钮*/}
          <ActionArea
            isEdit={isEdit}
            handleEdit={this.handleEdit}
            handleAddGroup={(item: Layout) =>
              this.contentEle.current!.handleAddGroup(item)
            }
            handleSave={this.handleSave}
            handleCancel={this.handleCancel}
            handleShopToggle={this.handleShopToggle}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    // if (global.localStorage) {
    //   global.localStorage.clear();
    // }
  }

  // 点击编辑按钮
  handleEdit = () => {
    this.setState({ isEdit: true }, () => {
      this.contentEle.current!.handleSetState('edit');
    });
  };

  // 保存当前布局
  handleSave = () => {
    this.setState({ isEdit: false }, () => {
      this.contentEle.current!.handleSetState('save');
    });
  };

  // 不保存当前布局
  handleCancel = () => {
    this.setState({ isEdit: false }, () => {
      this.contentEle.current!.handleSetState('cancel');
    });
  };

  // 控制磁贴商店的显示或隐藏
  handleShopToggle = (isShow: boolean) => {
    this.setState({ isShopShow: isShow });
  };
}

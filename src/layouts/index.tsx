import React, { Component } from 'react';
import { connect } from 'umi';
import { Layout, Menu, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import './index.css';

const { SubMenu } = Menu,
  MenuItem = Menu.Item;
const { Header, Content, Sider } = Layout;

interface Props {
  menuData: any[];
  subMenus: any[];
  curFatherKeys: string[];
  curSonKeys: string[];
  curGrandsonKeys: string[];
  handleMenuItemClick: any;
  getSubMenu: any;
  openSubMenu: any;
}

interface State {
  sideMenuHidden: boolean;
}

class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sideMenuHidden: false,
    };
  }

  render() {
    const {
      menuData,
      subMenus,
      curFatherKeys,
      curSonKeys,
      curGrandsonKeys,
      getSubMenu,
      openSubMenu,
    } = this.props;
    console.log('menuData:', menuData);
    const { sideMenuHidden } = this.state;
    return (
      <Layout className={'wrap'}>
        <Header className="header">
          {/*Logo*/}
          <div className="logo">Logo</div>
          {/*一级菜单*/}
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={curFatherKeys}
            selectedKeys={curFatherKeys}
          >
            {menuData.length
              ? menuData.map((item: any) => (
                  <MenuItem
                    key={item.id}
                    onClick={() => getSubMenu({ id: item.id })}
                  >
                    {item.name}
                  </MenuItem>
                ))
              : null}
          </Menu>
        </Header>
        <Layout>
          {/*侧边菜单栏*/}
          <Sider
            width={200}
            className="site-layout-background"
            collapsedWidth={0}
            collapsed={sideMenuHidden}
          >
            <Menu
              mode="inline"
              defaultOpenKeys={curSonKeys}
              openKeys={curSonKeys}
              defaultSelectedKeys={curGrandsonKeys}
              selectedKeys={
                curGrandsonKeys && curGrandsonKeys[0]
                  ? curGrandsonKeys
                  : curSonKeys
              }
              style={{ height: '100%', borderRight: 0 }}
            >
              {subMenus && subMenus.length
                ? subMenus.map((item: any) => {
                    if (item.children && item.children.length) {
                      return (
                        <SubMenu
                          key={item.id}
                          title={item.name}
                          onTitleClick={() => openSubMenu({ id: item.id })}
                        >
                          {item.children.map((subItem: any) => (
                            <MenuItem key={subItem.id}>
                              <Link to={subItem.url || subItem.path}>
                                {subItem.name}
                              </Link>
                            </MenuItem>
                          ))}
                        </SubMenu>
                      );
                    } else {
                      return (
                        <MenuItem key={item.id}>
                          <Link to={item.url || item.path}>{item.name}</Link>
                        </MenuItem>
                      );
                    }
                  })
                : null}
            </Menu>
            {/*折叠按钮*/}
            <Button
              className={'fold'}
              type={'primary'}
              onClick={this.handleToggle}
            >
              {sideMenuHidden ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </Sider>
          {/*正文区域*/}
          <Content
            className="site-layout-background"
            style={{ padding: 0, margin: 0, minHeight: 280 }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }

  componentDidMount() {
    localStorage.setItem('siderWidth', '200');
  }

  componentWillUnmount() {
    // localStorage.clear();
  }

  // 显示|隐藏侧边菜单
  handleToggle = () => {
    this.setState({ sideMenuHidden: !this.state.sideMenuHidden }, () => {
      localStorage.setItem(
        'siderWidth',
        this.state.sideMenuHidden ? '0' : '200',
      );
    });
  };
}

const mapStateToProps = (state: any) => state.layouts;

const mapDispatchToProps = (dispatch: any) => {
  return {
    getSubMenu: (payload: any) => {
      dispatch({ type: 'layouts/getSubMenu', payload });
    },
    openSubMenu: (payload: any) => {
      dispatch({ type: 'layouts/openSubMenu', payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);

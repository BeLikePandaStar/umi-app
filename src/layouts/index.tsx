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
  getMenuList: any;
  handleMenuItemClick: any;
  getSubMenu: any;
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
      menuData = [],
      subMenus = [],
      curFatherKeys = [],
      curSonKeys = [],
      curGrandsonKeys = [],
      handleMenuItemClick,
      getSubMenu,
    } = this.props;
    console.log(menuData, subMenus);
    const { sideMenuHidden } = this.state;
    return (
      <Layout className={'wrap'}>
        <Header className="header">
          <div className="logo">Logo</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={curFatherKeys}
            selectedKeys={curFatherKeys}
          >
            {menuData.length
              ? menuData.map((item: any) => {
                  return (
                    <MenuItem
                      key={item.id}
                      onClick={() => getSubMenu({ id: item.id })}
                    >
                      {item.name}
                    </MenuItem>
                  );
                })
              : null}
          </Menu>
        </Header>
        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            collapsedWidth={0}
            defaultCollapsed={false}
            collapsed={sideMenuHidden}
          >
            <Menu
              mode="inline"
              defaultOpenKeys={curSonKeys}
              openKeys={curSonKeys}
              defaultSelectedKeys={curGrandsonKeys}
              selectedKeys={
                curGrandsonKeys.length ? curGrandsonKeys : curSonKeys
              }
              style={{ height: '100%', borderRight: 0 }}
            >
              {subMenus && subMenus.length
                ? subMenus.map((item: any) => {
                    if (item.children && item.children.length) {
                      return (
                        <SubMenu key={item.id} title={item.name}>
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
            <Button
              className={'fold'}
              type={'primary'}
              onClick={this.handleToggle}
              icon={
                sideMenuHidden ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
            />
          </Sider>
          <Content
            className="site-layout-background"
            style={{
              padding: 0,
              margin: 0,
              minHeight: 280,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }

  componentDidMount() {
    this.props.getMenuList();
    localStorage.setItem('siderWidth', '200');
  }

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
    getMenuList: (payload: any) => {
      dispatch({ type: 'layouts/getMenuList', payload });
    },
    handleMenuItemClick: (payload: any) => {
      dispatch({ type: 'layouts/change', payload });
    },
    getSubMenu: (payload: any) => {
      dispatch({ type: 'layouts/getSubMenu', payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);

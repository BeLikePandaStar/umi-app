import React, { Component } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import './index.css';

const { SubMenu } = Menu,
  MenuItem = Menu.Item;
const { Header, Content, Sider } = Layout;

const menuData = [
  {
    id: '100',
    order: 1,
    name: '自定义一级菜单',
    url: '/menu1',
    children: [
      {
        id: '110',
        order: 1,
        name: '拖拽模块',
        url: '/menu2',
        children: [{ id: '111', order: 1, name: '拖拽', url: '/drag' }],
      },
      {
        id: '120',
        order: 2,
        name: '动态表单模块',
        url: '/menu2',
        children: [{ id: '121', order: 1, name: '动态表单', url: '/form' }],
      },
    ],
  },
  {
    id: '200',
    order: 2,
    name: '自定义一级菜单2',
    url: '/menu1',
    children: [
      { id: '210', order: 1, name: '拖拽模块', url: '/drag', children: null },
    ],
  },
];

interface Props {
  routes: any;
}

interface State {
  menus: any;
  subMenus: any;
  openKey: string;
  selectKey: string;
  sideMenuHidden: boolean;
}

export default class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      menus: [],
      subMenus: [],
      openKey: '',
      selectKey: '',
      sideMenuHidden: false,
    };
  }

  render() {
    const { menus, subMenus, openKey, selectKey, sideMenuHidden } = this.state;
    return (
      <Layout className={'wrap'}>
        <Header className="header">
          <div className="logo">Logo</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[menuData[0]['id']]}
          >
            {!!menus.length &&
              menus.map((item: any) => (
                <MenuItem
                  key={item.id}
                  onClick={() => this.handleMenuClick(item.id)}
                >
                  {item.name}
                </MenuItem>
              ))}
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
            {selectKey && (
              <Menu
                mode="inline"
                defaultSelectedKeys={[selectKey]}
                defaultOpenKeys={[openKey]}
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
            )}
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
    this.setState({ menus: menuData }, () =>
      this.handleMenuClick(menuData[0]['id']),
    );
    localStorage.setItem('siderWidth', '200');
  }

  handleMenuClick = (current: string) => {
    const { menus } = this.state;
    const subMenus = menus.filter((item: any) => item.id === current)[0]
      ? menus.filter((item: any) => item.id === current)[0]['children']
      : [];
    const openKey = !!subMenus.length
      ? subMenus[0] && subMenus[0]['children']
        ? subMenus[0]['id']
        : ''
      : '';
    const selectKey = !!subMenus.length
      ? subMenus[0] && subMenus[0]['children']
        ? subMenus[0]['children'][0]['id']
        : subMenus[0]['id']
      : '';

    this.setState({ subMenus, openKey, selectKey, sideMenuHidden: false });
  };

  handleToggle = () => {
    this.setState({ sideMenuHidden: !this.state.sideMenuHidden }, () => {
      localStorage.setItem(
        'siderWidth',
        this.state.sideMenuHidden ? '0' : '200',
      );
    });
  };
}

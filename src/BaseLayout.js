import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {Link, NavLink} from "react-router-dom";
import {Layout, Menu, Icon, Row, Spin} from "antd";
import appConfig from "./config/app";
import {AUTH_STORE, CATEGORY_STORE, KEY_STORE, USER_STORE} from "./stores/storeConstants";
import {ADMINISTRATION, ROOT} from "./routes/routeConstants";
import {
  ROUTE_SIGNOUT,
  ROUTE_DASHBOARD,
  ROUTE_ADMINISTRATION_USERS,
  ROUTE_ADMINISTRATION_CATEGORIES,
  ROUTE_ADMINISTRATION_KEYS
} from "./routes/routeMappings";
import "antd/lib/layout/style/index.less";
import "antd/lib/menu/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "./BaseLayout.less";

@inject(AUTH_STORE, CATEGORY_STORE, KEY_STORE, USER_STORE) @observer
class BaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storesInitialized: false,
      isSidebarCollapsed: true,
      sidebarMenuMode: "inline",
      sidebarCurrentSelected: props.location.pathname === ROOT ? ROUTE_DASHBOARD : props.location.pathname,
      sidebarOpenKeys: []
    };
  }

  componentDidMount() {
    this.props.authStore.fetch().then(() => {
      this.initializeStores();
    });
  }

  initializeStores = () => {
    axios.all([
      this.props.categoryStore.getAll(),
      this.props.userStore.getAll(),
      this.props.keyStore.getAll()
    ]).then(() => {
      this.setState({storesInitialized: true});
    });
  };

  onSidebarCollapse = () => {
    this.setState({
      isSidebarCollapsed: !this.state.isSidebarCollapsed,
      menuMode: this.state.isSidebarCollapsed ? "inline" : "vertical"
    });
  };

  handleSidebarClick = (event) => this.setState({sidebarCurrentSelected: event.key});

  onSidebarOpenChange = (openKeys) => {
    const {sidebarOpenKeys} = this.state;
    const latestOpenKey = openKeys.find(key => !(sidebarOpenKeys.indexOf(key) > -1));
    const latestCloseKey = sidebarOpenKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({sidebarOpenKeys: nextOpenKeys});
  };

  getAncestorKeys = (key) => {
    const map = {};
    return map[key] || [];
  };

  isActiveSidebarNavLink = (menuItemKeyName) => this.state.sidebarCurrentSelected === menuItemKeyName;

  render() {
    const sidebar = () => (
      <Layout.Sider className="sidebar" collapsible={true} collapsed={this.state.isSidebarCollapsed} onCollapse={this.onSidebarCollapse}>
        <div className="logo">
          <img src={appConfig.assets.logoLightDropshadow}/>
          <span>communikey</span>
        </div>
        <Menu
          mode={this.state.menuMode}
          defaultSelectedKeys={[ROUTE_DASHBOARD]}
          openKeys={this.state.sidebarOpenKeys}
          selectedKeys={[this.state.sidebarCurrentSelected]}
          onOpenChange={this.onSidebarOpenChange}
          onClick={this.handleSidebarClick}
        >
          <Menu.Item key={ROUTE_DASHBOARD}>
            <NavLink to={ROUTE_DASHBOARD} isActive={() => this.isActiveSidebarNavLink(ROUTE_DASHBOARD)}>
              <span><Icon type="laptop"/><span className="nav-text">Dashboard</span></span>
            </NavLink>
          </Menu.Item>
          {
            this.props.authStore.privileged &&
            <Menu.SubMenu key={ADMINISTRATION} title={<span><Icon type="setting"/><span className="nav-text">Administration</span></span>}>
              <Menu.Item key={ROUTE_ADMINISTRATION_CATEGORIES}>
                <NavLink to={ROUTE_ADMINISTRATION_CATEGORIES} isActive={() => this.isActiveSidebarNavLink(ROUTE_ADMINISTRATION_CATEGORIES)}>Categories</NavLink>
              </Menu.Item>
              <Menu.Item key={ROUTE_ADMINISTRATION_KEYS}>
                <NavLink to={ROUTE_ADMINISTRATION_KEYS} isActive={() => this.isActiveSidebarNavLink(ROUTE_ADMINISTRATION_KEYS)}>Keys</NavLink>
              </Menu.Item>
              <Menu.Item key={ROUTE_ADMINISTRATION_USERS}>
                <NavLink to={ROUTE_ADMINISTRATION_USERS} isActive={() => this.isActiveSidebarNavLink(ROUTE_ADMINISTRATION_USERS)}>Users</NavLink>
              </Menu.Item>
            </Menu.SubMenu>
          }
        </Menu>
      </Layout.Sider>
    );

    const header = () => (
      <Layout.Header className="cckey-base-layout-header">
        <Row type="flex" justify="end" align="bottom">
          <Menu mode="horizontal">
            <Menu.SubMenu title={this.props.authStore.firstName}>
              <Menu.Item key="sign-out">
                <Link to={ROUTE_SIGNOUT}>Sign out</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Row>
      </Layout.Header>
    );

    const spinner = () => {
      return <div className="cckey-layout-center-div"><Spin spinning={true} size="large"/></div>;
    };

    const renderBaseLayout = () => (
      <Layout className="cckey-base-layout">
        {sidebar()}
        <Layout className="cckey-base-layout">
          {header()}
          <Layout.Content>
            {this.props.children}
          </Layout.Content>
        </Layout>
      </Layout>
    );

    return this.state.storesInitialized ? renderBaseLayout() : spinner();
  }
}

BaseLayout.propTypes = {
  /**
   * @type {ObservableArray} authStore - The injected authentication store
   */
  authStore: MobXPropTypes.observableArray,

  /**
   * @type {ObservableArray} categoryStore - The injected category store
   */
  categoryStore: MobXPropTypes.observableArray,

  /**
   * @type {function} children - The passed children
   */
  children: PropTypes.node,

  /**
   * @type {ObservableArray} keyStore - The injected key store
   */
  keyStore: MobXPropTypes.observableArray,

  /**
   * @type {object} location - The location object injected by React Router
   */
  location: PropTypes.object,

  /**
   * @type {ObservableArray} userStore - The injected user store
   */
  userStore: MobXPropTypes.observableArray
};

export default BaseLayout;

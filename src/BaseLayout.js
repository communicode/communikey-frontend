import React from "react";
import apiService from "./services/ApiService";
import PropTypes from "prop-types";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {Link, NavLink} from "react-router-dom";
import {Layout, Menu, Icon, Row, Spin, Button} from "antd";
import QueueAnim from "rc-queue-anim";
import appConfig from "./config/app";
import motionConfig from "./config/motion";
import {
  AUTHORITY_STORE,
  AUTH_STORE,
  CATEGORY_STORE,
  KEY_STORE,
  USER_STORE,
  USER_GROUP_STORE,
  ENCRYPTION_JOB_STORE, INVOCATION_HELPER
} from "./stores/storeConstants";
import {ADMINISTRATION, ROOT} from "./routes/routeConstants";
import {
  ROUTE_SIGNOUT,
  ROUTE_DASHBOARD,
  ROUTE_ADMINISTRATION_USER_GROUPS,
  ROUTE_ADMINISTRATION_USERS,
  ROUTE_KEYS
} from "./routes/routeMappings";
import {
  VERSION,
  webSocketService,
  crowdEncryptionService,
  notificationService,
  encryptionService,
  liveEntityUpdateService
} from "./Communikey";
import ProfileModal from "./components/data/ProfileModal";
import PassphraseModal from "./components/data/PassphraseModal";
import ConfirmationModal from "./components/data/ConfirmationModal";
import "antd/lib/layout/style/index.less";
import "antd/lib/button/style/index.less";
import "antd/lib/menu/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "./BaseLayout.less";

@inject(AUTHORITY_STORE, AUTH_STORE, CATEGORY_STORE, KEY_STORE, USER_STORE, USER_GROUP_STORE, ENCRYPTION_JOB_STORE, INVOCATION_HELPER) @observer
class BaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      storesInitialized: false,
      isSidebarCollapsed: false,
      sidebarMenuMode: "inline",
      sidebarCurrentSelected: props.location.pathname === ROOT ? ROUTE_DASHBOARD : props.location.pathname,
      sidebarOpenKeys: [],
      sidebarLastOpenedKeys: [],
      profileModalVisible: false,
      processing: false,
      wizardSelected: false,
      maskClosable: true,
      confirmSignOutModalVisible: false
    };
  }

  componentDidMount() {
    this.props.authStore.fetch()
      .then(() => {
        this.props.authStore.privileged
          ? this.initializeStores()
              .then(() => {
                this.setState({storesInitialized: true});
                this.initializeWebSocket();
              })
              .catch(() => this.setState({initialized: false}))
          : this.initializeUserStores()
              .then(() => {
                this.setState({storesInitialized: true});
                this.initializeWebSocket();
              })
              .catch(() => this.setState({initialized: false}));
      })
      .catch(() => this.setState({initialized: true}));
  }

  /**
   * Initializes websocket and the crowd encryption service
   *
   * @since 0.15.0
   */
  initializeWebSocket = () => {
    webSocketService.initialize()
      .then(() => {
        crowdEncryptionService.initialize();
        liveEntityUpdateService.initialize();
        this.props.authStore.privileged && liveEntityUpdateService.initializeAdminSubscriptions();
      })
      .catch((error) => {
        notificationService.error("Websocket connection failed", error, 10);
      });
  };

  initializeStores = () => {
    return apiService.all([
      this.props.authorityStore.fetchAll(),
      this.props.categoryStore.fetchAll(),
      this.props.keyStore.fetchAll(),
      this.props.userStore.fetchAll(),
      this.props.userGroupStore.fetchAll()
    ]);
  };

  initializeUserStores = () => {
    return apiService.all([
      this.props.categoryStore.fetchAll(),
      this.props.keyStore.fetchAll()
    ]);
  };

  onSidebarCollapse = () => {
    this.setState(prevState => ({
      isSidebarCollapsed: !prevState.isSidebarCollapsed,
      sidebarLastOpenedKeys: prevState.sidebarOpenKeys,
      sidebarOpenKeys: !prevState.isSidebarCollapsed ? [] : prevState.sidebarLastOpenedKeys,
      sidebarMenuMode: prevState.isSidebarCollapsed ? "inline" : "vertical"
    }));
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

  /**
   * Toggles the profile modal.
   */
  toggleProfileModal = () => this.setState(prevState => ({profileModalVisible: !prevState.profileModalVisible}));

  /**
   * Toggles the sign out modal
   */
  toggleConfirmSignOutModal = () => this.setState(prevState => ({confirmSignOutModalVisible: !prevState.confirmSignOutModalVisible}));

  /**
   * Handles the user modal close event.
   *
   * @callback handleProfileModalClose
   */
  handleProfileModalClose = () => {
    // this.toggleProfileModal();
    this.props.invocationHelper.toggleProfileModalState();
  };

  /**
   * Handles the passphrase modal close event.
   *
   * @callback handlePassphraseModalClose
   */
  handlePassphraseModalClose = () => {
    this.props.onPassphraseModalClose();
  };

  /**
   * Handles the profile modal password reset event.
   *
   * @callback handleProfileModalUserPasswordReset
   * @param {string} newPassword - The new password
   */
  handleProfileModalUserPasswordReset = (newPassword) => {
    this.setProcessingStatus(true);
    if (!this.state.user.resetToken) {
      return this._generatePasswordResetToken(this.state.user.email, this.state.user.login)
        .then(resetToken => {
          return this._resetPassword(resetToken.resetToken, newPassword, this.state.user.login)
            .then(() => this.setProcessingStatus(false))
            .catch(error => {
              this.setProcessingStatus(false);
              return Promise.reject(error);
            });
        })
        .catch(error => {
          this.setProcessingStatus(false);
          return Promise.reject(error);
        });
    } else {
      return this._resetPassword(this.state.user.resetToken, newPassword, this.state.user.login)
        .then(() => this.setProcessingStatus(false))
        .catch(error => {
          this.setProcessingStatus(false);
          return Promise.reject(error);
        });
    }
  };

  render() {
    const {initialized, isSidebarCollapsed, sidebarCurrentSelected, sidebarMenuMode, sidebarOpenKeys, storesInitialized, confirmSignOutModalVisible} = this.state;
    const {authStore, children} = this.props;

    const sidebar = () => (
      <Layout.Sider className="sidebar" collapsible={true} collapsed={isSidebarCollapsed} onCollapse={this.onSidebarCollapse}>
        <div className="logo">
          <img src={appConfig.assets.logoLightDropshadow}/>
          <span>communikey</span>
        </div>
        <Menu
          mode={sidebarMenuMode}
          defaultSelectedKeys={[ROUTE_DASHBOARD]}
          openKeys={sidebarOpenKeys}
          selectedKeys={[sidebarCurrentSelected]}
          onOpenChange={this.onSidebarOpenChange}
          onClick={this.handleSidebarClick}
        >
          <Menu.Item key={ROUTE_DASHBOARD}>
            <NavLink to={ROUTE_DASHBOARD} isActive={() => this.isActiveSidebarNavLink(ROUTE_DASHBOARD)}>
              <span><Icon type="laptop"/><span className="nav-text">Dashboard</span></span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key={ROUTE_KEYS}>
            <NavLink to={ROUTE_KEYS} isActive={() => this.isActiveSidebarNavLink(ROUTE_KEYS)}>
              <span><Icon type="key"/><span className="nav-text">Keys</span></span>
            </NavLink>
          </Menu.Item>
          {
            authStore.privileged &&
            <Menu.SubMenu key={ADMINISTRATION} title={<span><Icon type="setting"/><span className="nav-text">Administration</span></span>}>
              <Menu.Item key={ROUTE_ADMINISTRATION_USERS}>
                <NavLink to={ROUTE_ADMINISTRATION_USERS} isActive={() => this.isActiveSidebarNavLink(ROUTE_ADMINISTRATION_USERS)}>Users</NavLink>
              </Menu.Item>
              <Menu.Item key={ROUTE_ADMINISTRATION_USER_GROUPS}>
                <NavLink
                  to={ROUTE_ADMINISTRATION_USER_GROUPS}
                  isActive={() => this.isActiveSidebarNavLink(ROUTE_ADMINISTRATION_USER_GROUPS)}>User Groups
                </NavLink>
              </Menu.Item>
            </Menu.SubMenu>
          }
        </Menu>
      </Layout.Sider>
    );
    sidebar.__ANT_LAYOUT_SIDER = true;

    /**
     * Operations name constants and the name of the callback function.
     */
    const OPERATION_TYPES = {
      SETTINGS_PAGE: {
        keyName: "SETTINGS_PAGE",
        handler: this.props.invocationHelper.toggleProfileModalState
      },
      CONFIRM_SIGNOUT: {
        keyName: "CONFIRM_SIGNOUT",
        handler: this.toggleConfirmSignOutModal
      }
    };

    const setCloseable = (state) => {
      this.setState({maskClosable: state});
    };

    const header = () => (
      <Layout.Header className="cckey-base-layout-header">
        <Row type="flex" justify="end" align="bottom">
          {
            this.props.encryptionJobStore.jobNotice && encryptionService.getPrivateKey() &&
            <Button
              type="dashed"
              size="large"
              icon="exclamation-circle-o"
              onClick={encryptionService.checkForPassphrase}
            >
              Interaction required
            </Button>
          }
          <Menu mode="horizontal" onClick={(key) => OPERATION_TYPES[key.key].handler()} selectable={false}>
            <Menu.SubMenu title={authStore.firstName}>
              <Menu.Item key={OPERATION_TYPES.SETTINGS_PAGE.keyName}>Settings</Menu.Item>
              <Menu.Item key={OPERATION_TYPES.CONFIRM_SIGNOUT.keyName}>Sign Out</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Row>
      </Layout.Header>
    );

    const footer = () => (
      <div className="cckey-base-layout-footer-container">
        <p className="version">version {VERSION}</p>
      </div>
    );

    const spinner = () => (
      <QueueAnim
        delay={motionConfig.baseLayout.delay}
        duration={motionConfig.baseLayout.duration}
        ease={motionConfig.baseLayout.ease}
        type={motionConfig.baseLayout.type}
      >
        <div key="cckey-base-layout-spinner" className="cckey-layout-center-div"><Spin spinning={true} size="large"/></div>
      </QueueAnim>
    );

    const cancelButton = () => (
      <Button size="large" onClick={this.toggleConfirmSignOutModal}>Stay</Button>
    );

    const confirmButton = () => (
      <Link to={ROUTE_SIGNOUT}><Button size="large" type="danger">Sign out</Button></Link>
    );

    const renderBaseLayout = () => (
      <QueueAnim
        delay={motionConfig.baseLayout.delay}
        duration={motionConfig.baseLayout.duration}
        ease={motionConfig.baseLayout.ease}
        type={motionConfig.baseLayout.type}
      >
      <Layout key="cckey-base-layout" className="cckey-base-layout">
        {sidebar()}
        <Layout className="cckey-base-layout">
          {header()}
          <Layout.Content>
            <ConfirmationModal
              cancel={cancelButton()}
              proceed={confirmButton()}
              visible={confirmSignOutModalVisible}
              header="Do you really want to sign out?"
              content=
                {
                  "While signing out might be a good idea on other services. Here its not beneficial."
                  + "Signing out clears your private key from the local storage, requiring you to install it again. If you dont want to use"
                  + "communikey anymore, just close the application/tab."
                }
            />
            <PassphraseModal
              visible={this.props.passphraseNeeded}
              onClose={this.handlePassphraseModalClose}
              passphraseNeededResolve={this.props.passphraseNeededResolve}
              passphraseNeededReject={this.props.passphraseNeededReject}
            />
            <ProfileModal
              visible={this.props.invocationHelper.showProfileModal}
              onClose={this.handleProfileModalClose}
              maskClosable={this.state.maskClosable}
              onUserPasswordReset={this.handleProfileModalUserPasswordReset}
              loading={this.state.processing}
              setCloseable={setCloseable}
            />
            {children}
          </Layout.Content>
          <Layout.Footer>
            {footer()}
          </Layout.Footer>
        </Layout>
      </Layout>
      </QueueAnim>
    );

    return storesInitialized || initialized ? renderBaseLayout() : spinner();
  }
}

BaseLayout.propTypes = {
  /**
   * @type {ObservableArray} authorityStore - The injected authority store
   * @since 0.11.0
   */
  authorityStore: MobXPropTypes.observableArray,

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
  userStore: MobXPropTypes.observableArray,

  /**
   * @type {ObservableArray} userStore - The injected user group store
   */
  userGroupStore: MobXPropTypes.observableArray,

  /**
   * @type {ObservableArray} invocationHelper - The injected invocation helper instance
   */
  invocationHelper: MobXPropTypes.observableArray,
  /**
   * @type {ObservableArray} encryptionJobStore - The injected encryption job store
   */
  encryptionJobStore: MobXPropTypes.objectOrObservableObject,

  /**
   * @type {object} passphraseNeeded - The state object that invokes a passphrase modal
   */
  passphraseNeeded: PropTypes.bool,

  /**
   * @type {object} passphraseNeededResolve - The state object that resolves the passphraseNeeded promise
   */
  passphraseNeededResolve: PropTypes.func,

  /**
   * @type {object} passphraseNeededReject - The state object that rejects the passphraseNeeded promise
   */
  passphraseNeededReject: PropTypes.func,

  /**
   * @type {object} onModalClose - The function that closes the modal
   */
  onPassphraseModalClose: PropTypes.func,

  /**
   * The flag if the user comes from the wizard route
   *
   * @type {Boolean}
   */
  openWizard: PropTypes.bool
};

export default BaseLayout;

import React from "react";
import update from "immutability-helper";
import {Badge, Button, Col, Icon, Row, Table} from "antd";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {toJS} from "mobx";
import UserModal from "./../../components/data/UserModal";
import NoDataMessageBox from "./../../components/feedback/NoDataMessageBox";
import appConfig from "./../../config/app";
import themeSizeConfig from "./../../config/theme/sizes";
import {AUTHORITY_STORE, AUTH_STORE, USER_STORE} from "./../../stores/storeConstants";
import "antd/lib/badge/style/index.less";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "antd/lib/table/style/index.less";
import "./UserAdministration.less";
import "./../../BaseLayout.less";

/**
 * A badge component to show the current activation status of a user.
 *
 * @param {object} record - The user table record
 * @constructor
 */
export const USER_TABLE_DEFAULT_ACTIVATION_BADGE_RECORD = (record) =>
  <Badge status={record.activated ? "success" : "error"} text={record.activated ? "Activated" : "Deactivated"}/>;

/**
 * The default table column configuration.
 */
export const USER_TABLE_DEFAULT_COLUMNS = [
  {title: "Login", dataIndex: "login", key: "login", fixed: true},
  {title: "Email", dataIndex: "email", key: "email"},
  {title: "First name", dataIndex: "firstName", key: "firstName"},
  {title: "Last name", dataIndex: "lastName", key: "lastName"},
  {
    title: "Status", render: USER_TABLE_DEFAULT_ACTIVATION_BADGE_RECORD
  }
];

/**
 * The administration for user.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
@inject(AUTHORITY_STORE, AUTH_STORE, USER_STORE) @observer
class UserAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      processing: false,
      userModalVisible: false,
      userModalCreationMode: false,
      userModalLocked: true
    };
  }

  /**
   * Handles the user modal close event.
   *
   * @callback handleUserModalClose
   */
  handleUserModalClose = () => {
    this.toggleUserModal();
    this.setUserModalLockStatus(true);
    this.resetUserObject();
  };

  /**
   * Handles the user modal creation event.
   *
   * @callback handleUserModalCreation
   */
  handleUserModalCreation = () => {
    this.setUserModalCreationMode(true);
    this.toggleUserModal();
  };

  /**
   * Handles the user modal deletion event.
   *
   * @callback handleUserModalDelete
   */
  handleUserModalDelete = () => {
    this.setProcessingStatus(true);
    this.props.userStore.deleteOne(this.state.user.login)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleUserModalClose();
      });
  };

  /**
   * Handles the user modal save event.
   *
   * @param {object} payload - The key payload
   * @callback handleUserModalSave
   */
  handleUserModalSave = (payload) => {
    this.setProcessingStatus(true);
    const {user, userModalCreationMode} = this.state;
    const updatedUser = update(user, {$merge: payload});
    this.setState({user: updatedUser});
    userModalCreationMode
      ?
      this.props.userStore.create(updatedUser.firstName, updatedUser.lastName, updatedUser.email + appConfig.EMAIL_PREFIX, updatedUser.password)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleUserModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        })
      :
      this.props.userStore.update(updatedUser.login, updatedUser.email, updatedUser.firstName, updatedUser.lastName)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleUserModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        });
  };

  /**
   * Handles the user modal activation event.
   *
   * @callback handleUserModalUserActivation
   */
  handleUserModalUserActivation = () => {
    this.setProcessingStatus(true);
    this.props.userStore.activate(this.state.user.activationKey)
      .then(updatedUser => {
        this.setState({user: update(this.state.user, {$merge: updatedUser})});
        this.setProcessingStatus(false);
      })
      .catch(error => {
        console.error(error);
        this.setProcessingStatus(false);
      });
  };

  /**
   * Handles the user modal deactivation event.
   *
   * @callback handleUserModalUserDeactivation
   */
  handleUserModalUserDeactivation = () => {
    this.setProcessingStatus(true);
    this.props.userStore.deactivate(this.state.user.login)
      .then(updatedUser => {
        this.setState({user: update(this.state.user, {$merge: updatedUser})});
        this.setProcessingStatus(false);
      })
      .catch(error => {
        console.error(error);
        this.setProcessingStatus(false);
      });
  };

  /**
   * Handles the event to add a authority to the user.
   *
   * @callback handleUserModalOnAuthorityAdd
   * @param {object} authority - The authority to add to the user
   * @since 0.11.0
   */
  handleUserModalOnAuthorityAdd = (authority) => {
    this.setProcessingStatus(true);
    this.props.userStore.addAuthority(this.state.user.login, authority.name)
      .then(updatedUser => {
        this.setState({user: update(this.state.user, {$merge: updatedUser})});
        this.setProcessingStatus(false);
      })
      .catch(() => this.setProcessingStatus(false));
  };

  /**
   * Handles the event to remove a authority from the user.
   *
   * @callback handleUserModalOnAuthorityRemove
   * @param {object} authority - The authority to remove from the user
   * @since 0.11.0
   */
  handleUserModalOnAuthorityRemove = (authority) => {
    this.setProcessingStatus(true);
    this.props.userStore.removeAuthority(this.state.user.login, authority.name)
      .then(updatedUser => {
        this.setState({user: update(this.state.user, {$merge: updatedUser})});
        this.setProcessingStatus(false);
      })
      .catch(() => this.setProcessingStatus(false));
  };

  /**
   * Handles the user modal password reset event.
   *
   * @callback handleUserModalUserPasswordReset
   * @param {string} newPassword - The new password
   */
  handleUserModalUserPasswordReset = (newPassword) => {
    this.setProcessingStatus(true);
    if (!this.state.user.resetKey) {
      return this._generatePasswordResetToken(this.state.user.email, this.state.user.login)
        .then(resetToken => {
          return this._resetPassword(resetToken.resetKey, newPassword, this.state.user.login)
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
      return this._resetPassword(this.state.user.resetKey, newPassword, this.state.user.login)
        .then(() => this.setProcessingStatus(false))
        .catch(error => {
          this.setProcessingStatus(false);
          return Promise.reject(error);
        });
    }
  };

  /**
   * Handles a user table record selection event.
   *
   * @callback handleUserTableRecordSelect
   * @param {object} record - The selected user table record
   */
  handleUserTableRecordSelect = (record) =>
    this.setState({user: this.props.userStore.users[this.props.userStore.users.findIndex(user => user.id === record.id)]});

  /**
   * Resets the state user object.
   */
  resetUserObject = () => this.setState({user: {}});

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Sets the user modal mode status.
   *
   * @param {boolean} status - The new user modal mode status value
   */
  setUserModalCreationMode = (status) => this.setState({userModalCreationMode: status});

  /**
   * Sets the user modal lock status.
   *
   * @param {boolean} status - The new user modal lock status value
   */
  setUserModalLockStatus = (status) => this.setState({userModalLocked: status});

  /**
   * Toggles the user modal.
   */
  toggleUserModal = () => this.setState(prevState => ({userModalVisible: !prevState.userModalVisible}));

  /**
   * Toggles the user modal lock status.
   */
  toggleUserModalLockStatus = () => {
    this.setState(prevState => ({userModalLocked: !prevState.userModalLocked}));
  };

  /**
   * Generates a password reset token.
   *
   * @param {string} email - The email of the user to get a password reset token for
   * @param {string} login - The login of the user to get a password reset token for
   * @return {Promise<R>|Promise.<T>|*} - The reset token as promise
   * @private
   * @since 0.10.0
   */
  _generatePasswordResetToken = (email, login) => {
    return this.props.userStore.getPasswordResetToken(email, login)
      .then(resetToken => resetToken);
  };

  /**
   * Resets the password for the user with the specified login.
   *
   * @param {string} resetToken - The generated reset token
   * @param {string} newPassword - The new password
   * @param {string} login - The login of the user to reset the password of
   * @return {Promise<R>|Promise.<T>|*} - The updated token as promise
   * @private
   * @since 0.10.0
   */
  _resetPassword = (resetToken, newPassword, login) => {
    return this.props.userStore.resetPassword(resetToken, newPassword, login)
      .then(updatedUser => {
        this.setState({user: update(this.state.user, {$merge: updatedUser})});
        this.setProcessingStatus(false);
      })
      .catch(error => {
        this.setProcessingStatus(false);
        return Promise.reject(error);
      });
  };

  render() {
    const {processing, user, userModalVisible, userModalCreationMode, userModalLocked} = this.state;
    const {authorityStore, authStore, userStore} = this.props;

    const mainDataView = () => (
      <div>
        <div className="header">
          <Row>
            <Col span={4} offset={20}>
              <div className="operations">
                <Button.Group>
                  <Button type="primary" ghost={true} icon="plus" onClick={this.handleUserModalCreation}>User</Button>
                </Button.Group>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Table
            dataSource={toJS(userStore.users)}
            columns={USER_TABLE_DEFAULT_COLUMNS}
            rowKey={record => record.id}
            onRowClick={(record) => this.handleUserTableRecordSelect(record)}
            onRowDoubleClick={this.toggleUserModal}
            scroll={{x: themeSizeConfig.mediaQueryBreakpoints.screenMD}}
          />
        </Row>
      </div>
    );

    const userModal = () => (
      <UserModal
        visible={userModalVisible}
        key={user.id}
        user={user}
        authorities={toJS(authorityStore.authorities)}
        administrationMode={authStore.privileged}
        locked={userModalLocked}
        creationMode={userModalCreationMode}
        loading={processing}
        afterClose={() => this.setUserModalCreationMode(false)}
        onClose={this.handleUserModalClose}
        onDelete={this.handleUserModalDelete}
        onSave={this.handleUserModalSave}
        onUserActivate={this.handleUserModalUserActivation}
        onAuthorityAdd={this.handleUserModalOnAuthorityAdd}
        onAuthorityRemove={this.handleUserModalOnAuthorityRemove}
        onUserDeactivate={this.handleUserModalUserDeactivation}
        onUserPasswordReset={this.handleUserModalUserPasswordReset}
        toggleLockStatus={this.toggleUserModalLockStatus}
      />
    );

    const noDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          callToActionButtonVisible={true}
          onCallToActionButtonClick={this.handleUserModalCreation}
          icon={<Icon type="user"/>}
          headlineText="There are no users yet."
          subHeadlineText="You can create one by clicking on the button below."
        />
      </Row>
    );

    return (
      <div id="cckey-routes-administration-user" className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          {userStore.users.length ? mainDataView() : noDataMessageBox()}
          {userModal()}
        </div>
      </div>
    );
  }
}

export default UserAdministration;

UserAdministration.propTypes = {
  /**
   * The authority store injected by the MobX provider.
   *
   * @type {ObservableArray}
   * @since 0.11.0
   */
  authorityStore: MobXPropTypes.observableArray,

  /**
   * The authentication store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  authStore: MobXPropTypes.observableArray,
  /**
   * The user store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  userStore: MobXPropTypes.observableArray
};

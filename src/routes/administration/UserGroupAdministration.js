import React from "react";
import update from "immutability-helper";
import _ from "lodash";
import {Button, Col, Icon, Row, Table} from "antd";
import {inject, observer, PropTypes as MobXPropTypes} from "mobx-react";
import {toJS} from "mobx";
import UserGroupModal from "./../../components/data/UserGroupModal";
import NoDataMessageBox from "./../../components/feedback/NoDataMessageBox";
import {screenMD} from "./../../config/theme/sizes";
import {AUTH_STORE, USER_STORE, USER_GROUP_STORE} from "./../../stores/storeConstants";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/icon/style/css";
import "antd/lib/row/style/css";
import "antd/lib/table/style/index.less";
import "./UserGroupAdministration.less";
import "./../../BaseLayout.less";

/**
 * The default user group table column configuration.
 */
export const USER_GROUP_TABLE_DEFAULT_COLUMNS = [
  {title: "Name", dataIndex: "name", key: "name", fixed: true}
];

/**
 * The administration for user groups.
 *
 * @author sgreb@communicode.de
 * @since 0.9.0
 */
@inject(AUTH_STORE, USER_STORE, USER_GROUP_STORE) @observer
class UserGroupAdministration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userGroup: {},
      processing: false,
      userGroupModalCreationMode: false,
      userGroupModalLocked: true,
      userGroupModalVisible: false
    };
  }

  /**
   * Handles the user group modal close event.
   *
   * @callback handleUserGroupModalClose
   */
  handleUserGroupModalClose = () => {
    this.toggleUserGroupModal();
    this.setUserGroupModalLockStatus(true);
    this.resetUserGroupObject();
  };

  /**
   * Handles the user group modal creation event.
   *
   * @callback handleUserGroupModalCreation
   */
  handleUserGroupModalCreation = () => {
    this.resetUserGroupObject();
    this.setUserGroupModalCreationMode(true);
    this.toggleUserGroupModal();
  };

  /**
   * Handles the user group modal deletion event.
   *
   * @callback handleUserGroupModalDelete
   */
  handleUserGroupModalDelete = () => {
    this.setProcessingStatus(true);
    this.props.userGroupStore.deleteOne(this.state.userGroup.id)
      .then(() => {
        this.setProcessingStatus(false);
        this.handleUserGroupModalClose();
      });
  };

  /**
   * Handles the user group modal save event.
   *
   * @param {object} payload - The key payload
   * @callback handleUserGroupModalSave
   */
  handleUserGroupModalSave = (payload) => {
    this.setProcessingStatus(true);
    const {userGroup, userGroupModalCreationMode} = this.state;
    const updatedUserGroup = update(userGroup, {$merge: payload});
    this.setState({userGroup: updatedUserGroup});
    userGroupModalCreationMode
      ?
      this.props.userGroupStore.create(updatedUserGroup.name)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleUserGroupModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        })
      :
      this.props.userGroupStore.update(updatedUserGroup.id, updatedUserGroup)
        .then(() => {
          this.setProcessingStatus(false);
          this.handleUserGroupModalClose();
        })
        .catch(error => {
          console.error(error);
          this.setProcessingStatus(false);
        });

  };

  /**
   * Handles the event to add a user to the user group.
   *
   * @callback handleUserGroupModalOnUserAdd
   * @param {object} user - The user to add to the user group
   */
  handleUserGroupModalOnUserAdd = (user) => {
    this.setProcessingStatus(true);
    this.props.userGroupStore.addUser(this.state.userGroup.id, user.login)
      .then(updatedUserGroup => {
        this.setState({userGroup: update(this.state.userGroup, {$merge: updatedUserGroup})});
        this.setProcessingStatus(false);
      })
      .catch(error => {
        this.setProcessingStatus(false);
        console.error(error);
      });
  };

  /**
   * Handles the event to remove a user from the user group.
   *
   * @callback handleUserGroupModalOnUserAdd
   * @param {object} user - The user to add to the user group
   */
  handleUserGroupModalOnUserRemove = (user) => {
    this.setProcessingStatus(true);
    this.props.userGroupStore.removeUser(this.state.userGroup.id, user.login)
      .then(updatedUserGroup => {
        this.setState({userGroup: update(this.state.userGroup, {$merge: updatedUserGroup})});
        this.setProcessingStatus(false);
      })
      .catch(()=> this.setProcessingStatus(false));
  };

  /**
   * Handles a user group table record selection event.
   *
   * @callback handleUserGroupTableRecordSelect
   * @param {object} record - The selected user group table record
   */
  handleUserGroupTableRecordSelect = (record) =>
    this.setState({userGroup: _.find(this.props.userGroupStore.userGroups, userGroup => userGroup.id === record.id)});

  /**
   * Resets the user group state object.
   */
  resetUserGroupObject = () => this.setState({userGroup: {}});

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Sets the user group modal mode status.
   *
   * @param {boolean} status - The new user group modal mode status value
   */
  setUserGroupModalCreationMode = (status) => this.setState({userGroupModalCreationMode: status});

  /**
   * Sets the user group modal lock status.
   *
   * @param {boolean} status - The new user group modal lock status value
   */
  setUserGroupModalLockStatus = (status) => this.setState({userGroupModalLocked: status});

  /**
   * Toggles the user group modal.
   */
  toggleUserGroupModal = () => this.setState(prevState => ({userGroupModalVisible: !prevState.userGroupModalVisible}));

  /**
   * Toggles the user group modal lock status.
   */
  toggleUserGroupModalLockStatus = () => {
    this.setState(prevState => ({userGroupModalLocked: !prevState.userGroupModalLocked}));
  };

  render() {
    const {processing, userGroup, userGroupModalCreationMode, userGroupModalLocked, userGroupModalVisible} = this.state;
    const {authStore, userStore, userGroupStore} = this.props;

    const mainDataView = () => (
      <div>
        <div className="header">
          <Row>
            <Col span={24}>
              <div className="action-button-bar">
                <Button.Group>
                  <Button type="primary" ghost={true} icon="plus" onClick={this.handleUserGroupModalCreation}>User Group</Button>
                </Button.Group>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Table
            dataSource={toJS(userGroupStore.userGroups)}
            columns={USER_GROUP_TABLE_DEFAULT_COLUMNS}
            rowKey={record => record.id}
            onRowClick={(record) => this.handleUserGroupTableRecordSelect(record)}
            onRowDoubleClick={this.toggleUserGroupModal}
            scroll={{x: screenMD}}
          />
        </Row>
      </div>
    );

    const userGroupModal = () => (
      <UserGroupModal
        visible={userGroupModalVisible}
        key={userGroup.id}
        userGroup={userGroup}
        users={toJS(userStore.users)}
        administrationMode={authStore.privileged}
        locked={userGroupModalLocked}
        creationMode={userGroupModalCreationMode}
        loading={processing}
        afterClose={() => this.setUserGroupModalCreationMode(false)}
        onClose={this.handleUserGroupModalClose}
        onDelete={this.handleUserGroupModalDelete}
        onSave={this.handleUserGroupModalSave}
        onUserAdd={this.handleUserGroupModalOnUserAdd}
        onUserRemove={this.handleUserGroupModalOnUserRemove}
        toggleLockStatus={this.toggleUserGroupModalLockStatus}
      />
    );

    const noDataMessageBox = () => (
      <Row type="flex" justify="center">
        <NoDataMessageBox
          callToActionButtonVisible={true}
          onCallToActionButtonClick={this.handleUserGroupModalCreation}
          icon={<Icon type="usergroup-add"/>}
          headlineText="There are no user groups yet."
          subHeadlineText="You can create one by clicking on the button below."
        />
      </Row>
    );

    return (
      <div id="cckey-routes-administration-user-group" className="cckey-base-layout-content-container">
        <div className="cckey-base-layout-content-container-inner">
          {userGroupStore.userGroups.length ? mainDataView() : noDataMessageBox()}
          {userGroupModal()}
        </div>
      </div>
    );
  }
}

export default UserGroupAdministration;

UserGroupAdministration.propTypes = {
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
  userStore: MobXPropTypes.observableArray,

  /**
   * The user group store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  userGroupStore: MobXPropTypes.observableArray
};

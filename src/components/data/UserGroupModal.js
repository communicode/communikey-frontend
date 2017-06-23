import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import _ from "lodash";
import {Button, Col, Form, Icon, Input, Modal, Row, Table, Tabs, Tooltip} from "antd";
import themeSizeConfig from "./../../config/theme/sizes";
import "antd/lib/button/style/index.less";
import "antd/lib/checkbox/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/form/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/pagination/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/table/style/index.less";
import "antd/lib/tabs/style/index.less";
import "antd/lib/tooltip/style/index.less";
import "./UserGroupModal.less";

/**
 * The default user table column configuration.
 */
export const USER_TABLE_DEFAULT_COLUMNS = [
  {title: "Login", dataIndex: "login", key: "login", fixed: true},
  {title: "Email", dataIndex: "email", key: "email"},
  {title: "First name", dataIndex: "firstName", key: "firstName"},
  {title: "Last name", dataIndex: "lastName", key: "lastName"}
];

/**
 * The name of the React key for the general tab.
 *
 * @type {string}
 * @since 0.9.0
 */
const TAB_PANE_REACT_KEY_GENERAL = "general";

/**
 * The name of the React key for the users tab.
 *
 * @type {string}
 * @since 0.9.0
 */
const TAB_PANE_REACT_KEY_USERS = "users";

/**
 * A modal for user groups.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.9.0
 */
class UserGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The key of the active tab.
       *
       * @type {string}
       */
      activeTabViewKey: TAB_PANE_REACT_KEY_GENERAL,

      /**
       * The original user group object.
       * Used to compare changes.
       *
       * @type {object}
       */
      originalUserGroup: props.userGroup
    };
  }

  /**
   * Handles the table record selection event of the users tab view.
   *
   * @param {object} record - The selected user table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   */
  handleTabViewUsersOnRecordSelect = (record, selected) => selected ? this.props.onUserAdd(record) : this.props.onUserRemove(record);

  render() {
    const {
      administrationMode,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      onValueChange,
      toggleLockStatus,
      userGroup,
      users,
      ...modalProps
    } = this.props;
    const {activeTabViewKey, originalUserGroup} = this.state;

    const tabViewUsersTableConfig = {
      selectedRowKeys: userGroup.users,
      onSelect: this.handleTabViewUsersOnRecordSelect
    };

    /**
     * Layout configurations for all editable form items.
     */
    const editableFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
      }
    };

    /**
     * Layout configurations for all read-only form items.
     */
    const readOnlyFormItemLayout = {
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18, offset: 4}
      }
    };

    const copyToClipboardIcon = (value) => (
      <CopyToClipboard text={value}>
        <Tooltip title="Copied to clipboard" trigger="click">
          <Icon type="copy" className="copy-to-clipboard-icon"/>
        </Tooltip>
      </CopyToClipboard>
    );

    const formItems = () => (
      <div>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="id"
            addonBefore="ID"
            value={userGroup.id}
            readOnly={true}
            disabled={!userGroup.id}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdBy"
            addonBefore="Created by"
            value={userGroup.createdBy}
            readOnly={true}
            disabled={!userGroup.createdBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdDate"
            addonBefore="Created on"
            value={userGroup.createdDate && new Date(userGroup.createdDate).toLocaleString()}
            readOnly={true}
            disabled={!userGroup.createdDate}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedBy"
            addonBefore="Modified by"
            value={userGroup.lastModifiedBy}
            readOnly={true}
            disabled={!userGroup.lastModifiedBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedDate"
            addonBefore="Modified on"
            value={userGroup.lastModifiedDate && new Date(userGroup.lastModifiedDate).toLocaleString()}
            readOnly={true}
            disabled={!userGroup.lastModifiedDate}
          />
        </Form.Item>
      </div>
    );

    const form = () => (
      <Form>
        <Form.Item {...editableFormItemLayout} label="Name" colon={false}>
          <Input
            name="name"
            onChange={onValueChange}
            placeholder="Name"
            readOnly={!administrationMode}
            value={userGroup.name ? userGroup.name : null}
            suffix={userGroup.name ? copyToClipboardIcon(userGroup.name) : null}
          />
        </Form.Item>
        {!creationMode && administrationMode && formItems()}
      </Form>
    );

    const lockStatusButton = () => (
      <Tooltip title={locked ? "Unlock" : "Lock"}>
        <Button key="lockStatus" type={locked ? "ghost" : "dashed"} onClick={toggleLockStatus} icon={locked ? "lock" : "unlock"}/>
      </Tooltip>
    );

    const footer = () => (
      <div className="footer">
        <Row type="flex" align="middle">
          <Col span={8}>
            <div className="operations">
              {!creationMode && administrationMode && !_.isEqual(activeTabViewKey, TAB_PANE_REACT_KEY_USERS) &&
              <Button.Group>
                <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>
              </Button.Group>
              }
            </div>
          </Col>
          <Col span={8} offset={8}>
            <div className="main">
              <Button key="cancel" size="large" onClick={onClose}>Cancel</Button>
              <Button
                key="save"
                type="primary"
                size="large"
                onClick={_.isEqual(userGroup, originalUserGroup) ? onClose : onSave}
                loading={loading}
              >
                {creationMode ? "Create" : "Done"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );

    const tabViewUsers = () => (
      <Tabs.TabPane tab="Users" key={TAB_PANE_REACT_KEY_USERS} disabled={creationMode}>
        <Row>
          <div>
            <Col span={24}>
              <Table
                dataSource={users}
                columns={USER_TABLE_DEFAULT_COLUMNS}
                rowKey={record => record.id}
                rowSelection={tabViewUsersTableConfig}
                scroll={{x: themeSizeConfig.mediaQueryBreakpoints.screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    const tabViewGeneral = () => (
      <Tabs.TabPane tab="General" key={TAB_PANE_REACT_KEY_GENERAL}>
        <Row>
          <Col span={24}>{form()}</Col>
        </Row>
        {!creationMode && administrationMode && <Row span={4}>{lockStatusButton()}</Row>}
      </Tabs.TabPane>
    );

    return (
      <Modal
        id="cckey-components-data-views-user-group-modal"
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-user-group-modal"
        {...modalProps}>
        <Tabs defaultActiveKey={TAB_PANE_REACT_KEY_GENERAL} onChange={(activeTabViewKey) => this.setState({activeTabViewKey})}>
          {tabViewGeneral()}
          {tabViewUsers()}
        </Tabs>
        <Row><Col>{footer()}</Col></Row>
      </Modal>
    );
  }
}

UserGroupModal.propTypes = {
  /**
   * Indicates if the user group modal is in administration mode.
   */
  administrationMode: PropTypes.bool,

  /**
   * Indicates if the user group modal is in creation mode.
   *
   * @type {boolean}
   */
  creationMode: PropTypes.bool,

  /**
   * The current processing status.
   *
   * @type {boolean}
   */
  loading: PropTypes.bool,

  /**
   * The current lock status.
   *
   * @type {boolean}
   */
  locked: PropTypes.bool,

  /**
   * Callback function to handle close events.
   *
   * @type {function}
   */
  onClose: PropTypes.func.isRequired,

  /**
   * Callback function to handle delete events.
   *
   * @type {function}
   */
  onDelete: PropTypes.func,

  /**
   * Callback function to handle the save event.
   *
   * @type {function}
   */
  onSave: PropTypes.func,

  /**
   * Callback function to handle the event to add a user to the user group.
   *
   * @type {function}
   */
  onUserAdd: PropTypes.func,

  /**
   * Callback function to handle the event to remove a user to from user group.
   *
   * @type {function}
   */
  onUserRemove: PropTypes.func,

  /**
   * Callback function to handle input value change events.
   *
   * @type {function}
   */
  onValueChange: PropTypes.func,

  /**
   * Callback function to toggle the user lock status.
   *
   * @type {function}
   */
  toggleLockStatus: PropTypes.func,

  /**
   * The user group.
   *
   * @type {object}
   */
  userGroup: PropTypes.object.isRequired,

  /**
   * The users.
   *
   * @type {Array}
   */
  users: PropTypes.array.isRequired
};

UserGroupModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default UserGroupModal;

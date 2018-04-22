/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import _ from "lodash";
import {Button, Col, Form, Icon, Input, Modal, Row, Table, Tabs, Tooltip} from "antd";
import {screenMD} from "./../../config/theme/sizes";
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
 * The managed form component.
 *
 * @since 0.10.0
 */
const ManagedForm = Form.create()(
  (props) => {
    const {administrationMode, userGroup, creationMode, form} = props;
    const {getFieldDecorator} = form;

    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("name") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("name", {
            initialValue: userGroup.name,
            rules: [{required: true, message: "Name is required"}]
          })(
            <Input
              addonBefore="Name"
              readOnly={!administrationMode}
              suffix={userGroup.name ? copyToClipboardIcon(userGroup.name) : null}
            />
          )}
        </Form.Item>
        {!creationMode && administrationMode &&
        <div>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="id"
              prefix={<Icon type="lock"/>}
              addonBefore="ID"
              value={userGroup.id}
              readOnly={true}
              disabled={!userGroup.id}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Created by"
              value={userGroup.createdBy}
              readOnly={true}
              disabled={!userGroup.createdBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Created on"
              value={userGroup.createdDate && new Date(userGroup.createdDate).toLocaleString()}
              readOnly={true}
              disabled={!userGroup.createdDate}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified by"
              value={userGroup.lastModifiedBy}
              readOnly={true}
              disabled={!userGroup.lastModifiedBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified on"
              value={userGroup.lastModifiedDate && new Date(userGroup.lastModifiedDate).toLocaleString()}
              readOnly={true}
              disabled={!userGroup.lastModifiedDate}
            />
          </Form.Item>
        </div>
        }
      </Form>
    );
  }
);

/**
 * The icon to copy a value to the clipboard.
 *
 * @param value - The value to copy
 */
const copyToClipboardIcon = (value) => (
  <CopyToClipboard text={value}>
    <Tooltip title="Copied to clipboard" trigger="click">
      <Icon type="copy" className="copy-to-clipboard-icon"/>
    </Tooltip>
  </CopyToClipboard>
);

/**
 * Layout configurations for all managed form items.
 */
const managedFormItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 18, offset: 4}
  }
};

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
      activeTabViewKey: TAB_PANE_REACT_KEY_GENERAL
    };
  }

  /**
   * Handles the action button click event.
   *
   * @since 0.10.0
   */
  handleActionButtonOnClick = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      this.props.onSave(payload);
      this.form.resetFields();
    }
  });

  /**
   * Handles the close event.
   *
   * @since 0.10.0
   */
  handleOnClose = () => {
    this.form.resetFields();
    this.props.onClose();
  };

  /**
   * Handles the table record selection event of the users tab view.
   *
   * @param {object} record - The selected user table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   */
  handleTabViewUsersOnRecordSelect = (record, selected) => selected ? this.props.onUserAdd(record) : this.props.onUserRemove(record);

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.10.0
   */
  saveManagedFormRef = (form) => this.form = form;

  render() {
    const {
      administrationMode,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      toggleLockStatus,
      userGroup,
      users,
      ...modalProps
    } = this.props;
    const {activeTabViewKey} = this.state;

    const tabViewUsersTableConfig = {
      selectedRowKeys: userGroup.users,
      onSelect: this.handleTabViewUsersOnRecordSelect
    };

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
              <Button size="large" onClick={this.handleOnClose}>Cancel</Button>
              <Button type="primary" size="large" onClick={this.handleActionButtonOnClick} loading={loading}>
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
                scroll={{x: screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    const tabViewGeneral = () => (
      <Tabs.TabPane tab="General" key={TAB_PANE_REACT_KEY_GENERAL}>
        <Row>
          <Col span={24}>
            <ManagedForm
              ref={this.saveManagedFormRef}
              userGroup={userGroup}
              administrationMode={administrationMode}
              creationMode={creationMode}
            />
          </Col>
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

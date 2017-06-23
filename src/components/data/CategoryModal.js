import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button, Col, Form, Icon, Input, Modal, Row, Table, Tabs, Tooltip} from "antd";
import themeSizeConfig from "./../../config/theme/sizes";
import "antd/lib/button/style/index.less";
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
import "./CategoryModal.less";

/**
 * The default user table column configuration.
 *
 * @since 0.10.0
 */
export const USER_GROUPS_TABLE_DEFAULT_COLUMNS = [{title: "Name", dataIndex: "name", key: "name", fixed: true}];

/**
 * The name of the React key for the general tab.
 *
 * @type {string}
 * @since 0.10.0
 */
const TAB_PANE_REACT_KEY_GENERAL = "general";

/**
 * The name of the React key for the user groups tab.
 *
 * @type {string}
 * @since 0.10.0
 */
const TAB_PANE_REACT_KEY_USER_GROUPS = "userGroups";

/**
 * A modal for categories.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class CategoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The React key of the active tab.
       *
       * @type {string}
       * @since 0.10.0
       */
      activeTabViewKey: TAB_PANE_REACT_KEY_GENERAL
    };
  }

  /**
   * Handles the table record selection event of the user groups tab view.
   *
   * @param {object} record - The selected user group table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   * @since 0.10.0
   */
  handleTabViewUserGroupsOnRecordSelect = (record, selected) => selected ? this.props.onUserGroupAdd(record) : this.props.onUserGroupRemove(record);

  render() {
    const {
      administrationMode,
      category,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      onValueChange,
      toggleLockStatus,
      userGroups,
      ...modalProps
    } = this.props;
    const {activeTabViewKey} = this.state;

    /**
     * The configuration object for the user group table of the user groups tab.
     *
     * @since 0.10.0
     */
    const tabViewUserGroupsTableConfig = {
      selectedRowKeys: category.groups,
      onSelect: this.handleTabViewUserGroupsOnRecordSelect
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
        <Form.Item>
          <Input
            name="id"
            addonBefore="ID"
            value={category.id}
            readOnly={true}
            disabled={!category.id}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="createdBy"
            addonBefore="Created by"
            value={category.createdBy}
            readOnly={true}
            disabled={!category.createdBy}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="createdDate"
            addonBefore="Created on"
            value={category.createdDate && new Date(category.createdDate).toLocaleString()}
            readOnly={true}
            disabled={!category.createdDate}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="lastModifiedBy"
            addonBefore="Modified by"
            value={category.lastModifiedBy}
            readOnly={true}
            disabled={!category.lastModifiedBy}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="lastModifiedDate"
            addonBefore="Modified on"
            value={category.lastModifiedDate && new Date(category.lastModifiedDate).toLocaleString()}
            readOnly={true}
            disabled={!category.lastModifiedDate}
          />
        </Form.Item>
      </div>
    );

    const form = () => (
      <Form>
        <Form.Item label="Name" colon={false}>
          <Input
            name="name"
            onChange={onValueChange}
            placeholder="Name"
            suffix={category.name ? copyToClipboardIcon(category.name) : null}
            readOnly={!administrationMode}
            value={category.name}
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
              {!creationMode && administrationMode && !_.isEqual(activeTabViewKey, TAB_PANE_REACT_KEY_USER_GROUPS) &&
                <Button.Group>
                  <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>
                </Button.Group>
              }
            </div>
          </Col>
          <Col span={8} offset={8}>
            <div className="main">
              <Button key="cancel" size="large" onClick={onClose}>Cancel</Button>
              <Button key="save" type="primary" size="large" onClick={onSave} loading={loading}>{creationMode ? "Create" : "Done"}</Button>
            </div>
          </Col>
        </Row>
      </div>
    );

    const tabViewGeneral = () => (
      <Tabs.TabPane tab="General" key={TAB_PANE_REACT_KEY_GENERAL}>
        <Row type="flex" align="center">
          <Col span={18}>{form()}</Col>
        </Row>
        {!creationMode && administrationMode && <Row span={4}>{lockStatusButton()}</Row>}
      </Tabs.TabPane>
    );

    const tabViewUserGroups = () => (
      <Tabs.TabPane tab="User Groups" key={TAB_PANE_REACT_KEY_USER_GROUPS} disabled={creationMode}>
        <Row>
          <div>
            <Col span={24}>
              <Table
                dataSource={userGroups}
                columns={USER_GROUPS_TABLE_DEFAULT_COLUMNS}
                rowKey={record => record.id}
                rowSelection={tabViewUserGroupsTableConfig}
                scroll={{x: themeSizeConfig.mediaQueryBreakpoints.screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    return (
      <Modal
        id="cckey-components-data-views-category-modal"
        {...modalProps}
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-category-modal"
      >
        <Tabs defaultActiveKey={TAB_PANE_REACT_KEY_GENERAL} onChange={(activeTabViewKey) => this.setState({activeTabViewKey})}>
          {tabViewGeneral()}
          {tabViewUserGroups()}
        </Tabs>
        <Row><Col>{footer()}</Col></Row>
      </Modal>
    );
  }
}

CategoryModal.propTypes = {
  /**
   * Indicates if the category modal is in administration mode.
   */
  administrationMode: PropTypes.bool,

  /**
   * Indicates if the user modal is in creation mode.
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
   * Callback function to handle the event to add a user group to the category.
   *
   * @type {function}
   * @since 0.10.0
   */
  onUserGroupAdd: PropTypes.func,

  /**
   * Callback function to handle the event to remove a user group from the category.
   *
   * @type {function}
   * @since 0.10.0
   */
  onUserGroupRemove: PropTypes.func,

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
   * The category.
   *
   * @type {object}
   */
  category: PropTypes.object.isRequired,

  /**
   * The user groups.
   *
   * @type {Array}
   * @since 0.10.0
   */
  userGroups: PropTypes.array.isRequired

};

CategoryModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default CategoryModal;

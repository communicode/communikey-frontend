import React from "react";
import PropTypes from "prop-types";
import {inject, PropTypes as MobXPropTypes} from "mobx-react";
import _ from "lodash";
import CopyToClipboard from "react-copy-to-clipboard";
import {CATEGORY_STORE} from "../../stores/storeConstants";
import {LINK_CATEGORY_SHARE, LINK_CATEGORY_BREADCRUMB} from "../../config/constants";
import {Button, Col, Form, Icon, Input, Modal, Row, Table, Tabs, Tooltip, Breadcrumb, Menu, Dropdown} from "antd";
import {Link} from "react-router-dom";
import {screenMD} from "./../../config/theme/sizes";
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
import "antd/lib/breadcrumb/style/index.less";
import "antd/lib/menu/style/index.less";
import "antd/lib/dropdown/style/index.less";
import "./CategoryModal.less";

/**
 * The managed form component.
 *
 * @since 0.10.0
 */
const ManagedForm = Form.create()(
  (props) => {
    const {administrationMode, category, creationMode, form} = props;
    const {getFieldDecorator} = form;

    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          validateStatus={form.getFieldError("name") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("name", {
            initialValue: category.name,
            rules: [{required: true, message: "Name is required"}]
          })(
          <Input
            addonBefore="Name"
            suffix={category.name ? copyToClipboardIcon(category.name) : null}
            readOnly={!administrationMode}
          />)
          }
        </Form.Item>
        {!creationMode && administrationMode &&
        <div>
          <Form.Item>
            <Input
              name="id"
              prefix={<Icon type="lock"/>}
              addonBefore="ID"
              value={category.id}
              readOnly={true}
              disabled={!category.id}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="createdBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Created by"
              value={category.createdBy}
              readOnly={true}
              disabled={!category.createdBy}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="createdDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Created on"
              value={category.createdDate && new Date(category.createdDate).toLocaleString()}
              readOnly={true}
              disabled={!category.createdDate}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="lastModifiedBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified by"
              value={category.lastModifiedBy}
              readOnly={true}
              disabled={!category.lastModifiedBy}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="lastModifiedDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified on"
              value={category.lastModifiedDate && new Date(category.lastModifiedDate).toLocaleString()}
              readOnly={true}
              disabled={!category.lastModifiedDate}
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
@inject(CATEGORY_STORE)
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
   * Handles the table record selection event of the user groups tab view.
   *
   * @param {object} record - The selected user group table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   * @since 0.10.0
   */
  handleTabViewUserGroupsOnRecordSelect = (record, selected) => selected ? this.props.onUserGroupAdd(record) : this.props.onUserGroupRemove(record);

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
      category,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
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

    const lockStatusButton = () => (
      <Tooltip title={locked ? "Unlock" : "Lock"}>
        <Button key="lockStatus" type={locked ? "ghost" : "dashed"} onClick={toggleLockStatus} icon={locked ? "lock" : "unlock"}/>
      </Tooltip>
    );

    const shareLink = LINK_CATEGORY_SHARE + category.id;
    const footerOperationsDropdownMenu = (
      <Menu selectable={false}>
        <CopyToClipboard text={shareLink}>
          <Menu.Item>
            <Tooltip title="Copied link to clipboard!" trigger="click">
              Copy link
            </Tooltip>
          </Menu.Item>
        </CopyToClipboard>
      </Menu>
    );

    const footer = () => (
      <div className="footer">
        <Row type="flex" align="middle">
          <Col span={8}>
            <div className="operations">
              {!creationMode && administrationMode && !_.isEqual(activeTabViewKey, TAB_PANE_REACT_KEY_USER_GROUPS) &&
                <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>
              }
              {
                !creationMode &&
                <Dropdown overlay={footerOperationsDropdownMenu} size="large" placement="topLeft" trigger={["click"]}>
                  <Button key="more" type="primary" ghost={true} size="large">
                    <Icon type="down"/>
                  </Button>
                </Dropdown>
              }
            </div>
          </Col>
          <Col span={8} offset={8}>
            <div className="main">
              <Button size="large" onClick={this.handleOnClose}>Cancel</Button>
              <Button
                type="primary"
                size="large"
                onClick={this.handleActionButtonOnClick}
                loading={loading}>{creationMode ? "Create" : "Done"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );

    const tabViewGeneral = () => (
      <Tabs.TabPane tab="General" key={TAB_PANE_REACT_KEY_GENERAL}>
        <Row type="flex" align="center">
          <Col span={18}>
            <ManagedForm
              ref={this.saveManagedFormRef}
              category={category}
              administrationMode={administrationMode}
              creationMode={creationMode}
            />
          </Col>
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
                scroll={{x: screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    const breadcrumb = () => {
      let queue = [];
      const findParents = (category) => {
        queue.push(category);
        category.parent && findParents(this.props.categoryStore._findById(category.parent));
      };
      findParents(category);
      queue.reverse();
      return (
        <div className="cckey-category-modal-breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item><Icon type="home"/></Breadcrumb.Item>
            {queue.map(function(object, id) {
              const shareLink = LINK_CATEGORY_BREADCRUMB + object.id;
              return (
                <Breadcrumb.Item key={id}>
                  <Link to={shareLink}>
                    {object.name}
                  </Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </div>
      );
    };

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
        {category.parent && breadcrumb(category)}
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
   * The category store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  categoryStore: MobXPropTypes.observableArray,

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

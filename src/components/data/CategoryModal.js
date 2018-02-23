import React from "react";
import PropTypes from "prop-types";
import {arrayToTree} from "performant-array-to-tree";
import {inject, PropTypes as MobXPropTypes} from "mobx-react";
import _ from "lodash";
import CopyToClipboard from "react-copy-to-clipboard";
import {CATEGORY_STORE} from "../../stores/storeConstants";
import {LINK_CATEGORY_SHARE, LINK_CATEGORY_BREADCRUMB} from "../../config/constants";
import {ROUTE_KEYS} from "../../routes/routeMappings";
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  Modal,
  Row,
  Table,
  Tabs,
  Tooltip,
  Breadcrumb,
  Menu,
  Dropdown,
  TreeSelect,
  Tree
} from "antd";
import {Link} from "react-router-dom";
import {screenMD} from "./../../config/theme/sizes";
import {getAncestors} from "../../services/StoreService";
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
import "antd/lib/tree-select/style/index.less";
import "antd/lib/tree/style/index.less";
import "./CategoryModal.less";

/**
 * The managed form component.
 *
 * @since 0.10.0
 */
const ManagedForm = Form.create()(
  (props) => {
    const {administrationMode, category, creationMode, form, categoryTreeSelect} = props;
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
        {creationMode &&
          categoryTreeSelect()
        }
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
 * The default tags table column configuration.
 *
 * @since 0.18.0
 */
export const TAGS_TABLE_DEFAULT_COLUMNS = [{title: "Name", dataIndex: "name", key: "name", fixed: true}];

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
 * The name of the React key for the tags tab.
 *
 * @type {string}
 * @since 0.18.0
 */
const TAB_PANE_REACT_KEY_TAGS = "tags";

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
      activeTabViewKey: TAB_PANE_REACT_KEY_GENERAL,

      /**
       * The selected node of the category tree select
       *
       * @type {string}
       * @since 0.17.0
       */
      selectedCategoryTreeNode: ""
    };
  }

  /**
   * Resets all fields of the modal.
   *
   * @since 0.17.0
   */
  resetFields = () => {
    this.setState({
      selectedCategoryTreeNode: ""
    });
    this.form.resetFields();
  };

  /**
   * Handles the action button click event.
   *
   * @since 0.10.0
   */
  handleActionButtonOnClick = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      this.props.onSave(payload)
        .then(() => {
          this.resetFields();
        });
    }
  });

  /**
   * Handles the close event.
   *
   * @since 0.10.0
   */
  handleOnClose = () => {
    this.props.onClose();
    this.resetFields();
  };

  /**
   * Handles the table record selection event of the user groups tab view.
   *
   * @param {object} record - The selected user group table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   * @since 0.10.0
   */
  handleTabViewUserGroupsOnRecordSelect = (record, selected) => selected ? this.props.onTagAdd(record) : this.props.onTagRemove(record);

  /**
   * Handles the table record selection event of the tags tab view.
   *
   * @param {object} record - The selected tag table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   * @since 0.18.0
   */
  handleTabViewTagsOnRecordSelect = (record, selected) => selected ? this.props.onTagAdd(record) : this.props.onTagRemove(record);

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.10.0
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Generates the category tree from the specified flat category data array.
   *
   * @param categories - The flat category data array to generate the tree structure of
   * @since 0.16.0
   */
  generateTreeFromFlatData = categories => arrayToTree(categories, {id: "id", parentId: "parent"});

  /**
   * Recursively generates all category tree select nodes.
   *
   * @param categories - The categories to generate the tree node structure of
   * @since 0.16.0
   */
  generateCategoryTreeSelectNodes = categories => categories.map(category => {
    if (category.children.length) {
      return (
        <Tree.TreeNode
          key={category.data.id}
          value={category.data.name}
          category={category.data}
          title={<span><Icon type="folder"/> {category.data.name}</span>}
        >
          {this.generateCategoryTreeSelectNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.data.id} value={category.data.name} category={category.data} title={category.data.name}/>;
  });

  /**
   * Saves the reference to the managed form component.
   *
   * @param label - Data from the change event
   * @param selectValue - Data from the change event
   * @param selectedTreeNode - Data from the change event
   * @since 0.17.0
   */
  onCategoryTreeSelectChange = (label, selectValue, selectedTreeNode) => {
    this.setState({
      selectedCategoryTreeNode: selectedTreeNode.triggerNode.props.category.name
    });
    this.props.onCategoryTreeSelectValueChange(label, selectValue, selectedTreeNode);
  };

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
      onMoveToRoot,
      toggleLockStatus,
      userGroups,
      categoryStore,
      tags,
      ...modalProps
    } = this.props;
    const {activeTabViewKey, selectedCategoryTreeNode} = this.state;

    /**
     * The configuration object for the user group table of the user groups tab.
     *
     * @since 0.10.0
     */
    const tabViewUserGroupsTableConfig = {
      selectedRowKeys: category.groups,
      onSelect: this.handleTabViewUserGroupsOnRecordSelect
    };

    /**
     * The configuration object for the tags table of the user tags tab.
     *
     * @since 0.18.0
     */
    const tabViewTagsTableConfig = {
      selectedRowKeys: category.tags,
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
              {
                !creationMode && administrationMode && category.parent &&
                <Tooltip placement="topLeft" title="Moves the current category to root level in the tree hierarchy">
                  <Button
                    disabled={locked}
                    type="secondary"
                    size="large"
                    onClick={onMoveToRoot}
                  >
                    Move to<Icon type="home"/>
                  </Button>
                </Tooltip>
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

    const categoryTreeSelect = () => (
      <Form.Item colon={false}>
        <TreeSelect
          placeholder="Parent category"
          showSearch={true}
          onChange={this.onCategoryTreeSelectChange}
          value={selectedCategoryTreeNode}
          allowClear={true}
          size="large"
        >
          {this.generateCategoryTreeSelectNodes(this.generateTreeFromFlatData(categoryStore.categories))}
        </TreeSelect>
      </Form.Item>
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
              categoryTreeSelect={categoryTreeSelect}
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

    const tabViewTags = () => (
      <Tabs.TabPane tab="Tags" key={TAB_PANE_REACT_KEY_TAGS} disabled={creationMode}>
        <Row>
          <div>
            <Col span={24}>
              <Table
                dataSource={tags}
                columns={TAGS_TABLE_DEFAULT_COLUMNS}
                rowKey={record => record.id}
                rowSelection={tabViewTagsTableConfig}
                scroll={{x: screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    const breadcrumb = () => {
      return (
        <div className="cckey-category-modal-breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to={ROUTE_KEYS}>
                <Icon type="home"/>
              </Link>
            </Breadcrumb.Item>
            {getAncestors(this.props.categoryStore.categories, category, "parent", false, true).map(function(object, id) {
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
          {tabViewTags()}
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
   * Callback function to handle the save event.
   *
   * @type {function}
   */
  onMoveToRoot: PropTypes.func,

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
   * Callback function to handle the event to add a tag to the category.
   *
   * @type {function}
   * @since 0.18.0
   */
  onTagAdd: PropTypes.func,

  /**
   * Callback function to handle the event to remove a tag from the category.
   *
   * @type {function}
   * @since 0.18.0
   */
  onTagRemove: PropTypes.func,

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
  userGroups: PropTypes.array.isRequired,

  /**
   * The tags.
   *
   * @type {Array}
   * @since 0.18.0
   */
  tags: PropTypes.array.isRequired,

  /**
   * Callback function to handle category tree select value change events.
   */
  onCategoryTreeSelectValueChange: PropTypes.func
};

CategoryModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default CategoryModal;

import React from "react";
import _ from "lodash";
import {arrayToTree} from "performant-array-to-tree";
import PropTypes from "prop-types";
import {inject, PropTypes as MobXPropTypes} from "mobx-react";
import {CATEGORY_STORE} from "../../stores/storeConstants";
import {LINK_CATEGORY_BREADCRUMB, LINK_KEY_SHARE} from "../../config/constants";
import {ROUTE_KEYS} from "../../routes/routeMappings";
import CopyToClipboard from "react-copy-to-clipboard";
import {getAncestors} from "../../services/StoreService";
import {Button, Col, Form, Icon, Input, Modal, Row, Tooltip, Tree, TreeSelect, Breadcrumb, Menu, Dropdown} from "antd";
import {Link} from "react-router-dom";
import appConfig from "./../../config/app";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/dropdown/style/index.less";
import "antd/lib/form/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/menu/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/select/style/index.less";
import "antd/lib/tooltip/style/index.less";
import "antd/lib/tree/style/index.less";
import "antd/lib/tree-select/style/index.less";
import "antd/lib/breadcrumb/style/index.less";
import "./KeyModal.less";

/**
 * The managed form component.
 *
 * @since 0.10.0
 */
const ManagedForm = Form.create()(
  (props) => {
    const {administrationMode, cckeyKey, creationMode, categoryTreeSelect, form, locked, keyPasswordVisible} = props;
    const {getFieldDecorator} = form;

    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("name") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("name", {
            initialValue: cckeyKey.name,
            rules: [{required: true, message: "Name is required"}]
          })(
            <Input
              addonBefore="Name"
              suffix={cckeyKey.name ? copyToClipboardIcon(cckeyKey.name) : null}
              readOnly={!administrationMode}
            />)}
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("login") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("login", {
            initialValue: cckeyKey.login,
            rules: [{required: true, message: "Login is required"}]
          })(
            <Input
              addonBefore="Login"
              suffix={cckeyKey.login ? copyToClipboardIcon(cckeyKey.login) : null}
              readOnly={!administrationMode}
            />
          )}
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("password") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("password", {
            initialValue: cckeyKey.password,
            rules: [{required: true, message: "Password is required"}]
          })(
            <Input
              addonBefore="Password"
              type={keyPasswordVisible ? "text" : "password"}
              readOnly={!administrationMode ? true : creationMode ? false : locked}
              suffix={cckeyKey.password ? copyToClipboardIcon(cckeyKey.password) : null}
            />
          )}
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("notes") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("notes", {
            initialValue: cckeyKey.notes
          })(
            <Input
              placeholder="Notes"
              type="textarea"
              autosize={{minRows: 2, maxRows: 6}}
              readOnly={!administrationMode}
            />
          )}
        </Form.Item>
        {creationMode && administrationMode && categoryTreeSelect()}
        {!creationMode && administrationMode &&
        <div>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="id"
              prefix={<Icon type="lock"/>}
              addonBefore="ID"
              value={cckeyKey.id}
              readOnly={true}
              disabled={!cckeyKey.id}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Created by"
              value={cckeyKey.createdBy}
              readOnly={true}
              disabled={!cckeyKey.createdBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Created on"
              value={cckeyKey.createdDate && new Date(cckeyKey.createdDate).toLocaleString()}
              readOnly={true}
              disabled={!cckeyKey.createdDate}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified by"
              value={cckeyKey.lastModifiedBy}
              readOnly={true}
              disabled={!cckeyKey.lastModifiedBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified on"
              value={cckeyKey.lastModifiedDate && new Date(cckeyKey.lastModifiedDate).toLocaleString()}
              readOnly={true}
              disabled={!cckeyKey.lastModifiedDate}
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
 * A modal for keys.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
@inject(CATEGORY_STORE)
class KeyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The selected category of the inner category modal tree select.
       *
       * @default {}
       * @type {object}
       */
      categoryTreeSelectModalSelectedCategory: null,

      /**
       * The visibility status of the category tree select modal.
       *
       * @default false
       * @type {boolean}
       */
      categoryTreeSelectModalVisible: false,

      /**
       * Determines if the the key password is visible.
       */
      keyPasswordVisible: false
    };
  }

  /**
   * Sets the selected category for the tree select modal if found in the passed categories.
   * This allows to show the correct category tree node for the passed communikey key when not in creation mode.
   *
   * @since 0.9.0
   */
  componentDidMount() {
    const category = _.find(this.props.categories, category => category.id === this.props.cckeyKey.category);
    this.setState({categoryTreeSelectModalSelectedCategory: category});
  }

  /**
   * Generates the category tree from the specified flat category data array.
   *
   * @param categories - The flat category data array to generate the tree structure of
   * @since 0.9.0
   */
  generateTreeFromFlatData = categories => arrayToTree(categories, {id: "id", parentId: "parent"});

  /**
   * Recursively generates all category tree select nodes.
   *
   * @param categories - The categories to generate the tree node structure of
   */
  generateCategoryTreeSelectNodes = categories => categories.map(category => {
    if (category.children.length) {
      return (
        <Tree.TreeNode
          key={category.data.id}
          value={category.data.name}
          category={category.data}
          title={<span><Icon type="folder"/>{category.data.name}</span>}
        >
          {this.generateCategoryTreeSelectNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.data.id} value={category.data.name} category={category.data} title={category.data.name}/>;
  });

  /**
   * Handles the action button click event.
   *
   * @since 0.10.0
   */
  handleActionButtonOnClick = () => this.form.validateFields((errors, payload) => {
    if (!errors && this.props.administrationMode) {
      this.props.onSave(payload)
        .then(() => this.handleOnClose());
    } else if (!errors) {
      this.handleOnClose();
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
   * Handles the category tree select modal change event.
   *
   * @param label - The label of the selected tree node
   * @param selectValue - The value of the selection
   * @param selectedTreeNode - The selected tree node
   */
  handleCategoryTreeSelectModalChange = (label, selectValue, selectedTreeNode) => {
    this.setState({categoryTreeSelectModalSelectedCategory: selectedTreeNode.triggerNode.props.category});
  };

  /**
   * Handles the category tree select modal close event.
   */
  handleCategoryTreeSelectModalClose = () => {
    this.toggleCategoryTreeSelectModal();
    this.resetCategoryTreeSelectObject();
  };

  /**
   * Handles the password reset modal save event.
   */
  handleCategoryTreeSelectModalSave = () => {
    this.props.onCategoryTreeSelectionSave(this.state.categoryTreeSelectModalSelectedCategory)
      .then(() => this.toggleCategoryTreeSelectModal())
      .catch(error => console.error(error));
  };

  /**
   * Resets the state user object.
   */
  resetCategoryTreeSelectObject = () => this.setState({categoryTreeSelectModalSelectedCategory: {}});

  /**
   * Toggles the password reset modal.
   */
  toggleCategoryTreeSelectModal = () => this.setState(prevState => ({categoryTreeSelectModalVisible: !prevState.categoryTreeSelectModalVisible}));

  /**
   * Toggles the password visibility.
   */
  togglePasswordVisibility = () => this.setState(prevState => ({keyPasswordVisible: !prevState.keyPasswordVisible}));

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
      categories,
      cckeyKey,
      creationMode,
      loading,
      locked,
      onCategoryTreeSelectValueChange,
      onClose,
      onDelete,
      onSave,
      toggleLockStatus,
      ...modalProps
    } = this.props;
    const {categoryTreeSelectModalSelectedCategory, categoryTreeSelectModalVisible, keyPasswordVisible} = this.state;

    const defaultKeyAvatar = () => <img src={appConfig.assets.logoTypographyGreen} className="key-logo"/>;

    const categoryTreeSelect = () => (
      <Form.Item {...managedFormItemLayout} colon={false}>
        <TreeSelect
          placeholder="Category"
          showSearch={true}
          onChange={onCategoryTreeSelectValueChange}
          allowClear={true}
          size="large"
        >
          {this.generateCategoryTreeSelectNodes(this.generateTreeFromFlatData(categories))}
        </TreeSelect>
      </Form.Item>
    );

    const lockStatusButton = () => (
      <Tooltip title={locked ? "Unlock" : "Lock"}>
        <Button key="lockStatus" type={locked ? "ghost" : "dashed"} onClick={toggleLockStatus} icon={locked ? "lock" : "unlock"}/>
      </Tooltip>
    );

    const shareLink = LINK_KEY_SHARE + cckeyKey.id;
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

    const passwordVisibilityModeButton = () => (
      <Tooltip title={keyPasswordVisible ? "Hide password" : "Show password"}>
        <Button
          key="passwordVisibilityMode"
          type={keyPasswordVisible ? "dashed" : "ghost"}
          onClick={this.togglePasswordVisibility}
          icon={keyPasswordVisible ? "eye" : "eye-o"}
        />
      </Tooltip>
    );

    const footer = () => (
      <div className="footer">
        <Row type="flex" align="middle">
          <Col span={8}>
            <div className="operations">
              {!creationMode && administrationMode &&
                <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>}
              {
                !creationMode && administrationMode &&
                <Button key="addToCategory" size="large" onClick={this.toggleCategoryTreeSelectModal}>Select category</Button>
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
              {administrationMode && <Button size="large" onClick={this.handleOnClose}>Cancel</Button>}
              <Button type="primary" size="large" onClick={this.handleActionButtonOnClick} loading={loading}>{creationMode ? "Create" : "Done"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );

    const categoryTreeSelectInnerModal = () => (
      <Modal
        visible={categoryTreeSelectModalVisible}
        footer={false}
        closable={false}
        className="category-tree-select-inner-modal">
        <Row type="flex" justify="center">
          <Col span={24}>
            <Form>
              <Form.Item>
                <TreeSelect
                  showSearch={true}
                  value={categoryTreeSelectModalSelectedCategory && categoryTreeSelectModalSelectedCategory.name}
                  onChange={this.handleCategoryTreeSelectModalChange}
                  size="large"
                >
                  {this.generateCategoryTreeSelectNodes(this.generateTreeFromFlatData(categories))}
                </TreeSelect>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="footer">
              <Row type="flex" justify="end">
                <Col>
                  <Button key="cancel-category-tree-select" size="large" onClick={this.handleCategoryTreeSelectModalClose}>Cancel</Button>
                  <Button
                    key="save-category-tree-select"
                    type="primary" size="large"
                    onClick={this.handleCategoryTreeSelectModalSave}
                    loading={loading}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Modal>
    );

    const categoryBreadcrumb = (key) => {
      return (
        <div className="cckey-key-modal-breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to={ROUTE_KEYS}>
                <Icon type="home"/>
              </Link>
            </Breadcrumb.Item>
            {getAncestors(this.props.categoryStore.categories, this.props.categoryStore._findById(key.category), "parent", false, true).map(function(object, id) {
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
        {...modalProps}
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-key-modal"
      >
        {cckeyKey.category && categoryBreadcrumb(cckeyKey)}
        <Row gutter={24}>
          <Col span={6}>
            {defaultKeyAvatar()}
          </Col>
          <Col span={18}>
            <ManagedForm
              ref={this.saveManagedFormRef}
              cckeyKey={cckeyKey}
              administrationMode={administrationMode}
              locked={locked}
              keyPasswordVisible={keyPasswordVisible}
              creationMode={creationMode}
              categoryTreeSelect={categoryTreeSelect}
            />
          </Col>
        </Row>
        <Row span={4}>
          {!creationMode && administrationMode && lockStatusButton()}
          {passwordVisibilityModeButton()}
        </Row>
        <Row><Col>{footer()}</Col></Row>
        {categoryTreeSelectInnerModal()}
      </Modal>
    );
  }
}

KeyModal.propTypes = {
  /**
   * Indicates if the key modal is in administration mode.
   */
  administrationMode: PropTypes.bool,

  /**
   * The category store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  categoryStore: MobXPropTypes.observableArray,

  /**
   * The categories for the category tree select.
   */
  categories: MobXPropTypes.observableArray,

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
   * Callback function to handle events to add a key to a category.
   *
   * @type {function}
   */
  onCategoryTreeSelectionSave: PropTypes.func,

  /**
   * Callback function to handle category tree select value change events.
   */
  onCategoryTreeSelectValueChange: PropTypes.func,

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
   * Callback function to toggle the user lock status.
   *
   * @type {function}
   */
  toggleLockStatus: PropTypes.func,

  /**
   * The passed communikey key.
   *
   * @type {object}
   */
  cckeyKey: PropTypes.object.isRequired
};

KeyModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default KeyModal;

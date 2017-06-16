import React from "react";
import PropTypes from "prop-types";
import {PropTypes as MobXPropTypes} from "mobx-react";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button, Col, Dropdown, Form, Icon, Input, Menu, Modal, Row, Tooltip, Tree, TreeSelect} from "antd";
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
import "./KeyModal.less";

/**
 * A modal for keys.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
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
   * Recursively generates all category tree select nodes.
   *
   * @param categories - The categories to generate the tree node structure of
   */
  generateCategoryTreeSelectNodes = categories => categories.map(category => {
    if (category.children.length) {
      return (
        <Tree.TreeNode key={category.id} value={category.name} category={category} title={<span><Icon type="folder"/> {category.name}</span>}>
          {this.generateCategoryTreeSelectNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.id} value={category.name} category={category} title={category.name}/>;
  });

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

  togglePasswordVisibility = () => this.setState(prevState => ({keyPasswordVisible: !prevState.keyPasswordVisible}));

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
      onInputValueChange,
      onSave,
      toggleLockStatus,
      ...modalProps
    } = this.props;

    const {categoryTreeSelectModalVisible, keyPasswordVisible} = this.state;

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

    /**
     * Operations name constants and the name of the callback function.
     */
    const OPERATION_TYPES = {
      ADD_TO_CATEGORY: {
        keyName: "ADD_TO_CATEGORY",
        handler: this.toggleCategoryTreeSelectModal
      }
    };

    const copyToClipboardIcon = (value) => (
      <CopyToClipboard text={value}>
        <Tooltip title="Copied to clipboard" trigger="click">
          <Icon type="copy" className="copy-to-clipboard-icon"/>
        </Tooltip>
      </CopyToClipboard>
    );

    const defaultKeyAvatar = () => <img src={appConfig.assets.logoTypographyGreen} className="key-logo"/>;

    const footerOperationsDropdownMenu = (
      <Menu onClick={(key) => OPERATION_TYPES[key.key].handler()} selectable={false}>
        <Menu.Item key={OPERATION_TYPES.ADD_TO_CATEGORY.keyName} disabled={locked}>Add to category</Menu.Item>
      </Menu>
    );

    const formItems = () => (
      <div>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="id"
            addonBefore="ID"
            value={cckeyKey.id}
            readOnly={true}
            disabled={!cckeyKey.id}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdBy"
            addonBefore="Created by"
            value={cckeyKey.createdBy}
            readOnly={true}
            disabled={!cckeyKey.createdBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdDate"
            addonBefore="Created on"
            value={cckeyKey.createdDate && new Date(cckeyKey.createdDate).toLocaleString()}
            readOnly={true}
            disabled={!cckeyKey.createdDate}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedBy"
            addonBefore="Modified by"
            value={cckeyKey.lastModifiedBy}
            readOnly={true}
            disabled={!cckeyKey.lastModifiedBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedDate"
            addonBefore="Modified on"
            value={cckeyKey.lastModifiedDate && new Date(cckeyKey.lastModifiedDate).toLocaleString()}
            readOnly={true}
            disabled={!cckeyKey.lastModifiedDate}
          />
        </Form.Item>
      </div>
    );

    const form = () => (
      <Form>
        <Form.Item {...editableFormItemLayout} label="Name" colon={false}>
          <Input
            name="name"
            onChange={onInputValueChange}
            placeholder="Name"
            suffix={cckeyKey.name ? copyToClipboardIcon(cckeyKey.name) : null}
            readOnly={!administrationMode}
            value={cckeyKey.name}
          />
        </Form.Item>
        <Form.Item {...editableFormItemLayout} label="Login" colon={false}>
          <Input
            name="login"
            onChange={onInputValueChange}
            placeholder="Login"
            suffix={cckeyKey.login ? copyToClipboardIcon(cckeyKey.login) : null}
            readOnly={!administrationMode}
            value={cckeyKey.login}
          />
        </Form.Item>
        <Form.Item {...editableFormItemLayout} label="Password" colon={false}>
          <Input
            name="password"
            onChange={onInputValueChange}
            placeholder="Password"
            type={keyPasswordVisible ? "text" : "password"}
            readOnly={!administrationMode ? true : creationMode ? false : locked}
            suffix={cckeyKey.password ? copyToClipboardIcon(cckeyKey.password) : null}
            value={cckeyKey.password}
          />
        </Form.Item>
        {creationMode && administrationMode && categoryTreeSelect()}
        {!creationMode && administrationMode && formItems()}
      </Form>
    );

    const categoryTreeSelect = () => (
      <Form.Item {...editableFormItemLayout} label="Category" colon={false}>
        <TreeSelect
          showSearch={true}
          defaultValue={cckeyKey.category && cckeyKey.category.name}
          onChange={onCategoryTreeSelectValueChange}
          size="large"
        >
          {this.generateCategoryTreeSelectNodes(categories)}
        </TreeSelect>
      </Form.Item>
    );

    const lockStatusButton = () => (
      <Tooltip title={locked ? "Unlock" : "Lock"}>
        <Button key="lockStatus" type={locked ? "ghost" : "dashed"} onClick={toggleLockStatus} icon={locked ? "unlock" : "lock"}/>
      </Tooltip>
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
                <Dropdown overlay={footerOperationsDropdownMenu} size="large" placement="topLeft" disabled={locked} trigger={["click"]}>
                  <Button key="operations" type="primary" ghost={true} size="large" disabled={locked}><Icon type="down"/></Button>
                </Dropdown>
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
                  defaultValue={cckeyKey.category && cckeyKey.category.name}
                  onChange={this.handleCategoryTreeSelectModalChange}
                  size="large"
                >
                  {this.generateCategoryTreeSelectNodes(categories)}
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

    return (
      <Modal
        {...modalProps}
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-key-modal"
      >
        <Row gutter={24}>
          <Col span={6}>
            {defaultKeyAvatar()}
          </Col>
          <Col span={18}>{form()}</Col>
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
   * Callback function to handle input value change events.
   *
   * @type {function}
   */
  onInputValueChange: PropTypes.func,

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

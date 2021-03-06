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
import _ from "lodash";
import {arrayToTree} from "performant-array-to-tree";
import PropTypes from "prop-types";
import {keyStore, notificationService, categoryStore} from "../../Communikey";
import {inject, PropTypes as MobXPropTypes} from "mobx-react";
import {CATEGORY_STORE} from "../../stores/storeConstants";
import {LINK_CATEGORY_BREADCRUMB, LINK_KEY_SHARE} from "../../config/constants";
import {ROUTE_KEYS} from "../../routes/routeMappings";
import CopyToClipboard from "react-copy-to-clipboard";
import copy from "copy-to-clipboard";
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
    const {administrationMode, cckeyKey, creationMode, categoryTreeSelect,
           form, locked, keyPasswordVisible, decryptedPassword} = props;
    const {getFieldDecorator} = form;

    const checkPassword = (rule, value, callback) => {
      if (value && value !== form.getFieldValue("password")) {
        callback("The passwords must match!");
      } else {
        callback();
      }
    };

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
          colon={false}
        >
          {getFieldDecorator("password", {
            initialValue: creationMode ? "" : decryptedPassword,
            rules: [{
              required: true, message: "Please input your password!"
            }, {
              validator: checkPassword
            }]
          })(
            <Input
              addonBefore="Password"
              type={keyPasswordVisible ? "text" : "password"}
              readOnly={!administrationMode ? true : creationMode ? false : locked}
              suffix={creationMode ? null : copyPasswordToClipboardIcon(cckeyKey.id)}
            />
          )}
        </Form.Item>
        {creationMode && administrationMode &&
        <Form.Item
          {...managedFormItemLayout}
          colon={false}
        >
          {getFieldDecorator("passwordConfirm", {
            initialValue: creationMode ? "" : decryptedPassword,
            rules: [{
              required: true, message: "Please retype your password!"
            }, {
              validator: checkPassword
            }]
          })(
            <Input
              addonBefore="Retype password"
              type={keyPasswordVisible ? "text" : "password"}
              readOnly={!administrationMode ? true : creationMode ? false : locked}
              suffix={creationMode ? null : copyPasswordToClipboardIcon(cckeyKey.id)}
            />
          )}
        </Form.Item>
        }
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
              name="Category"
              prefix={<Icon type="folder"/>}
              addonBefore="Category"
              value={cckeyKey.category ? getCategoryName(cckeyKey.category) : "No category assigned"}
              disabled={!cckeyKey.category}
              readOnly={true}
            />
          </Form.Item>
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
 * @param keyId - The keyId to copy
 * @since 0.15.0
 */
const copyPasswordToClipboardIcon = (keyId) => (
  <Tooltip title="Copied to clipboard" trigger="click">
    <Icon type="copy" className="copy-to-clipboard-icon" onClick={() => handlePasswordCopy(keyId)}/>
  </Tooltip>
);

/**
 * The function to copy the decrypted password to the clipboard
 *
 * @param keyId - The keyId to copy
 * @since 0.15.0
 */
const handlePasswordCopy = (keyId) => {
  keyStore.getPassword(keyId)
    .then((password) =>{
      copy(password);
    })
    .catch(error => {
      notificationService.error(error.title, error.message, 5);
    });
};

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
 * @param categoryId - The categoryId
 * @returns {String} - The name of the category
 */
const getCategoryName = (categoryId) => {
  return categoryStore._findById(categoryId).name;
};

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
      keyPasswordVisible: false,

      /**
       * Holds the current decrypted password if requested
       */
      decryptedPassword: "Decrypting password...",

      /**
       * The selected node of the category tree select
       */
      selectedCategoryTreeNode: ""
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
          title={<span><Icon type="folder"/> {category.data.name}</span>}
        >
          {this.generateCategoryTreeSelectNodes(category.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={category.data.id} value={category.data.name} category={category.data} title={category.data.name}/>;
  });

  /**
   * Resets all fields of the modal.
   *
   * @since 0.17.0
   */
  resetFields = () => {
    this.setState({
      decryptedPassword: "Decrypting password...",
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
    if (!errors && this.props.administrationMode) {
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
    this.resetFields();
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
   * @returns {Promise} - A promise
   */
  togglePasswordVisibility = () => {
    return new Promise((resolve, reject) => {
      this.setState(prevState => ({keyPasswordVisible: !prevState.keyPasswordVisible}));
      !this.state.keyPasswordVisible && !this.props.creationMode &&
      keyStore.getPassword(this.props.cckeyKey.id)
        .then((password) => {
          this.setState({
            decryptedPassword: password
          });
          resolve();
        })
        .catch((message) => {
          this.setState({
            keyPasswordVisible: false
          });
          notificationService.error(message.title, message.message, 5);
          reject();
        });
    });
  };

  /**
   * Toggles the locked state
   */
  toggleDataLockStatus = () => {
    if(!this.state.keyPasswordVisible && this.props.locked) {
      this.togglePasswordVisibility()
        .then(() => {
          this.props.toggleLockStatus();
        });
    } else {
      this.props.toggleLockStatus();
    }
  };

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.10.0
   */
  saveManagedFormRef = (form) => this.form = form;

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
      categories,
      cckeyKey,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      ...modalProps
    } = this.props;
    const {categoryTreeSelectModalSelectedCategory, categoryTreeSelectModalVisible,
           keyPasswordVisible, decryptedPassword, selectedCategoryTreeNode} = this.state;

    const defaultKeyAvatar = () => <img src={appConfig.assets.logoTypographyGreen} className="key-logo"/>;

    const categoryTreeSelect = () => (
      <Form.Item {...managedFormItemLayout} colon={false}>
        <TreeSelect
          placeholder="Category"
          showSearch={true}
          onChange={this.onCategoryTreeSelectChange}
          value={selectedCategoryTreeNode}
          allowClear={true}
          size="large"
        >
          {this.generateCategoryTreeSelectNodes(this.generateTreeFromFlatData(categories))}
        </TreeSelect>
      </Form.Item>
    );

    const lockStatusButton = () => (
      <Tooltip title={locked ? "Unlock" : "Lock"}>
        <Button key="lockStatus" type={locked ? "ghost" : "dashed"} onClick={this.toggleDataLockStatus} icon={locked ? "lock" : "unlock"}/>
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

    const saveCreateButton = () => {
      if(creationMode || (administrationMode && !locked)) {
        return (
          <Button
          type="primary"
          size="large"
          onClick={this.handleActionButtonOnClick}
          loading={loading}
        >
          {creationMode ? "Create" : "Save"}
        </Button>
        );
      }
    };

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
              <Button
                size="large"
                onClick={this.handleOnClose}
              >
                Close
              </Button>
              {saveCreateButton()}
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
              decryptedPassword={decryptedPassword}
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

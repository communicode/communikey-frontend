import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import _ from "lodash";
import {Badge, Button, Col, Dropdown, Form, Icon, Input, Menu, Modal, Row, Table, Tabs, Tooltip} from "antd";
import appConfig from "./../../config/app";
import {screenMD} from "./../../config/theme/sizes";
import "antd/lib/badge/style/index.less";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/dropdown/style/index.less";
import "antd/lib/form/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/menu/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/table/style/index.less";
import "antd/lib/tabs/style/index.less";
import "antd/lib/tooltip/style/index.less";
import "./UserModal.less";

/**
 * The managed form component.
 *
 * @since 0.10.0
 */
const ManagedForm = Form.create()(
  (props) => {
    const {administrationMode, user, creationMode, form} = props;
    const {getFieldDecorator} = form;

    return (
      <Form hideRequiredMark={true}>
        {creationMode &&
          <Form.Item
            {...managedFormItemLayout}
            validateStatus={form.getFieldError("email") ? "error" : ""}
            colon={false}>
            {getFieldDecorator("email", {
              initialValue: user.email,
              rules: [{required: true, message: "Email is required"}]
            })(
              <Input
                addonBefore="Email"
                addonAfter={appConfig.EMAIL_PREFIX}
                readOnly={!creationMode && administrationMode}
                suffix={user.email ? copyToClipboardIcon(user.email) : null}
              />
            )}
          </Form.Item>
        }
        {!creationMode &&
          <Form.Item
            {...managedFormItemLayout}
            validateStatus={form.getFieldError("login") ? "error" : ""}
            colon={false}>
            {getFieldDecorator("login", {
              initialValue: user.login,
              rules: [{required: true, message: "Email is required"}]
            })(
              <Input
                prefix={<Icon type="mail"/>}
                addonBefore="Email"
                addonAfter={appConfig.EMAIL_PREFIX}
                readOnly={!creationMode && administrationMode}
                suffix={user.email ? copyToClipboardIcon(user.email) : null}
              />
            )}
          </Form.Item>
        }
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("firstName") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("firstName", {
            initialValue: user.firstName,
            rules: [{required: true, message: "First name is required"}]
          })(
            <Input
              addonBefore="First name"
              readOnly={!administrationMode}
            />
          )}
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("lastName") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("lastName", {
            initialValue: user.lastName,
            rules: [{required: true, message: "Last name is required"}]
          })(
            <Input
              addonBefore="Last name"
              readOnly={!administrationMode}
            />
          )}
        </Form.Item>
        {creationMode &&
          <Form.Item
            {...managedFormItemLayout}
            validateStatus={form.getFieldError("password") ? "error" : ""}
            colon={false}>
            {getFieldDecorator("password", {
              initialValue: user.password,
              rules: [{required: true, message: "Password is required"}]
            })(
              <Input
                addonBefore="Password"
                type="password"
                readOnly={!administrationMode}
              />
            )}
          </Form.Item>
        }
        {!creationMode && administrationMode &&
        <div>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="id"
              prefix={<Icon type="lock"/>}
              addonBefore="ID"
              value={user.id}
              readOnly={true}
              disabled={!user.id}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Created by"
              value={user.createdBy}
              readOnly={true}
              disabled={!user.createdBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Created on"
              value={user.createdDate && new Date(user.createdDate).toLocaleString()}
              readOnly={true}
              disabled={!user.createdDate}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified by"
              value={user.lastModifiedBy}
              readOnly={true}
              disabled={!user.lastModifiedBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified on"
              value={user.lastModifiedDate && new Date(user.lastModifiedDate).toLocaleString()}
              readOnly={true}
              disabled={!user.lastModifiedDate}
            />
          </Form.Item>
          <Form.Item
            {...managedFormItemLayout}
            colon={false}
          >
            <Input
              placeholder="No Key set"
              type="textarea"
              autosize={{minRows: 2, maxRows: 6}}
              readOnly={true}
              value={user.publicKey}
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
 * The default authorities table column configuration.
 *
 * @since 0.11.0
 */
export const AUTHORITIES_TABLE_DEFAULT_COLUMNS = [{title: "Name", dataIndex: "name", key: "name", fixed: true}];

/**
 * The default groups table column configuration.
 *
 * @since 0.16.0
 */
export const GROUPS_TABLE_DEFAULT_COLUMNS = [{title: "Name", dataIndex: "name", key: "id", fixed: true}];

/**
 * The name of the React key for the general tab.
 *
 * @type {string}
 * @since 0.11.0
 */
const TAB_PANE_REACT_KEY_GENERAL = "general";

/**
 * The name of the React key for the authorities tab.
 *
 * @type {string}
 * @since 0.11.0
 */
const TAB_PANE_REACT_KEY_AUTHORITIES = "authorities";

/**
 * The name of the React key for the groups tab.
 *
 * @type {string}
 * @since 0.16.0
 */
const TAB_PANE_REACT_KEY_GROUPS = "groups";

/**
 * A modal for user.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class UserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The React key of the active tab.
       *
       * @type {string}
       * @since 0.11.0
       */
      activeTabViewKey: TAB_PANE_REACT_KEY_GENERAL,

      /**
       * The value of the password reset modal confirmation input.
       *
       * @default ""
       * @type {string}
       */
      passwordResetModalConfirmValue: "",

      /**
       * The value of the password reset modal password input.
       *
       * @default ""
       * @type {string}
       */
      passwordResetModalNewPasswordValue: "",

      /**
       * Indicates if the both password reset modal values are valid.
       *
       * @default false
       * @type {boolean}
       */
      passwordResetModalValuesValid: false,

      /**
       * The visibility status of the password reset modal.
       *
       * @default false
       * @type {boolean}
       */
      passwordResetModalVisible: false
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
   * Handles the table record selection event of the authorities tab view.
   *
   * @param {object} record - The selected authority table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   * @since 0.11.0
   */
  handleTabViewAuthoritiesOnRecordSelect = (record, selected) => selected ? this.props.onAuthorityAdd(record) : this.props.onAuthorityRemove(record);

  /**
   * Handles the table record selection event of the groups tab view.
   *
   * @param {object} record - The selected authority table record
   * @param {boolean} selected - Determines whether the record has been selected or unselected
   * @since 0.16.0
   */
  handleTabViewGroupsOnRecordSelect = (record, selected) => selected ? this.props.onGroupAdd(record) : this.props.onGroupRemove(record);

  /**
   * Handles the user modal close event.
   *
   * @callback handleUserModalClose
   */
  handlePasswordResetModalClose = () => {
    this.togglePasswordResetModal();
    this.resetPasswordResetModalValues();
  };

  /**
   * Handles all input value change events.
   *
   * @callback handleModalValueChange
   * @param event - The change event
   */
  handlePasswordResetModalValueChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
    this.validatePasswordResetValues();
  };

  /**
   * Handles the password reset modal save event.
   */
  handleUserPasswordResetSave = () => {
    this.props.onUserPasswordReset(this.state.passwordResetModalNewPasswordValue)
      .then(() => this.togglePasswordResetModal())
      .catch(error => console.error(error));
  };

  /**
   * Resets the state user object.
   */
  resetPasswordResetModalValues = () => this.setState({passwordResetModalConfirmValue: "", passwordResetModalNewPasswordValue: ""});

  /**
   * Toggles the password reset modal.
   */
  togglePasswordResetModal = () => this.setState(prevState => ({passwordResetModalVisible: !prevState.passwordResetModalVisible}));

  /**
   * Validates the password reset input values.
   */
  validatePasswordResetValues = () => {
    let newPassword = this.passwordResetModalNewPasswordInput.refs.input.value;
    let confirmedPassword = this.passwordResetModalConfirmInput.refs.input.value;
    this.setState({passwordResetModalValuesValid: _.isEqual(newPassword, confirmedPassword) && !_.isEmpty(newPassword, confirmedPassword)});
  };

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
      authorities,
      groups,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      onUserActivate,
      onUserDeactivate,
      onUserInvalidateKeypair,
      toggleLockStatus,
      user,
      ...modalProps
    } = this.props;
    const {activeTabViewKey, passwordResetModalValuesValid, passwordResetModalVisible} = this.state;

    /**
     * Operations name constants and the name of the callback function.
     */
    const OPERATION_TYPES = {
      RESET_PASSWORD: {
        keyName: "RESET_PASSWORD",
        handler: this.togglePasswordResetModal
      },
      USER_ACTIVATE: {
        keyName: "USER_ACTIVATE",
        handler: onUserActivate
      },
      USER_DEACTIVATE: {
        keyName: "USER_DEACTIVATE",
        handler: onUserDeactivate
      },
      USER_INVALIDATE_KEYPAIR: {
        keyName: "USER_INVALIDATE_KEYPAIR",
        handler: onUserInvalidateKeypair
      }
    };

    /**
     * The configuration object for the authority table of the authorities tab.
     *
     * @since 0.11.0
     */
    const tabViewAuthoritiesTableConfig = {
      selectedRowKeys: user.authorities,
      onSelect: this.handleTabViewAuthoritiesOnRecordSelect
    };

    /**
     * The configuration object for the authority table of the authorities tab.
     *
     * @since 0.16.0
     */
    const tabViewGroupsTableConfig = {
      selectedRowKeys: user.groups,
      onSelect: this.handleTabViewGroupsOnRecordSelect
    };

    const defaultUserAvatar = () => <img src={appConfig.assets.wireframe.avatars.matthew} className="user-avatar"/>;

    const footerOperationsDropdownMenu = (
      <Menu onClick={(key) => OPERATION_TYPES[key.key].handler()} selectable={false}>
        <Menu.Item key={OPERATION_TYPES.USER_INVALIDATE_KEYPAIR.keyName} disabled={user.publicKeyResetToken ? true : locked}>Reset Keypair</Menu.Item>
        <Menu.Item key={OPERATION_TYPES.RESET_PASSWORD.keyName} disabled={locked || !user.activated}>Reset password</Menu.Item>
        <Menu.Item key={OPERATION_TYPES.USER_ACTIVATE.keyName} disabled={locked || user.activated}>Activate</Menu.Item>
        <Menu.Item key={OPERATION_TYPES.USER_DEACTIVATE.keyName} disabled={locked || !user.activated}>Deactivate</Menu.Item>
      </Menu>
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
              {!creationMode && administrationMode && !_.isEqual(activeTabViewKey, TAB_PANE_REACT_KEY_AUTHORITIES) &&
                <div>
                  <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>
                  <Dropdown overlay={footerOperationsDropdownMenu} size="large" placement="topLeft" disabled={locked} trigger={["click"]}>
                    <Button key="more" type="primary" ghost={true} size="large" disabled={locked}><Icon type="down"/></Button>
                  </Dropdown>
                </div>
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
          <Col span={6}>
            {
              !creationMode && administrationMode
                ?
                <Badge dot={true} className={user.activated ? "badge-activated" : "badge-deactivated"}>
                  {defaultUserAvatar()}
                </Badge>
                :
                defaultUserAvatar()
            }
          </Col>
          <Col span={18}>
            <ManagedForm
              ref={this.saveManagedFormRef}
              user={user}
              administrationMode={administrationMode}
              creationMode={creationMode}
            />
          </Col>
        </Row>
        {!creationMode && administrationMode && <Row span={4}>{lockStatusButton()}</Row>}
      </Tabs.TabPane>
    );

    const tabViewAuthorities = () => (
      <Tabs.TabPane tab="Authorities" key={TAB_PANE_REACT_KEY_AUTHORITIES} disabled={creationMode}>
        <Row>
          <div>
            <Col span={24}>
              <Table
                dataSource={authorities}
                columns={AUTHORITIES_TABLE_DEFAULT_COLUMNS}
                rowKey={record => record.name}
                rowSelection={tabViewAuthoritiesTableConfig}
                scroll={{x: screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    const tabViewGroups = () => (
      <Tabs.TabPane tab="Groups" key={TAB_PANE_REACT_KEY_GROUPS} disabled={creationMode}>
        <Row>
          <div>
            <Col span={24}>
              <Table
                dataSource={groups}
                columns={GROUPS_TABLE_DEFAULT_COLUMNS}
                rowKey={record => record.id}
                rowSelection={tabViewGroupsTableConfig}
                scroll={{x: screenMD}}
              />
            </Col>
          </div>
        </Row>
      </Tabs.TabPane>
    );

    const passwordResetInnerModal = () => (
      <Modal
        visible={passwordResetModalVisible}
        footer={false}
        closable={false}
        className="password-reset-inner-modal">
        <Row>
          <Col span={24}>
            <Form>
              <Form.Item>
                <Input
                  name="passwordResetModalNewPasswordValue"
                  onChange={this.handlePasswordResetModalValueChange}
                  placeholder="New password"
                  value={this.state.passwordResetModalNewPasswordValue}
                  type="password"
                  ref={node => this.passwordResetModalNewPasswordInput = node}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  name="passwordResetModalConfirmValue"
                  onChange={this.handlePasswordResetModalValueChange}
                  value={this.state.passwordResetModalConfirmValue}
                  placeholder="Confirm new password"
                  type="password"
                  ref={node => this.passwordResetModalConfirmInput = node}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="footer">
              <Row type="flex" justify="end">
                <Col>
                  <Button key="cancel-password-reset" size="large" onClick={this.handlePasswordResetModalClose}>Cancel</Button>
                  <Button
                    key="save-password-reset"
                    type="primary" size="large"
                    onClick={this.handleUserPasswordResetSave}
                    loading={loading}
                    disabled={!passwordResetModalValuesValid}
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
        className="cckey-user-modal"
      >
        <Tabs defaultActiveKey={TAB_PANE_REACT_KEY_GENERAL} onChange={(activeTabViewKey) => this.setState({activeTabViewKey})}>
          {tabViewGeneral()}
          {tabViewAuthorities()}
          {tabViewGroups()}
        </Tabs>
        <Row><Col>{footer()}</Col></Row>
        {passwordResetInnerModal()}
      </Modal>
    );

  }
}

UserModal.propTypes = {
  /**
   * Indicates if the user modal is in administration mode.
   */
  administrationMode: PropTypes.bool,

  /**
   * The authorities.
   *
   * @type {Array}
   * @since 0.11.0
   */
  authorities: PropTypes.array.isRequired,

  /**
   * The groups.
   *
   * @type {Array}
   * @since 0.16.0
   */
  groups: PropTypes.array.isRequired,

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
   * Callback function to handle the event to add a authority to the user.
   *
   * @type {function}
   * @since 0.11.0
   */
  onAuthorityAdd: PropTypes.func,

  /**
   * Callback function to handle the event to remove a authority from the user.
   *
   * @type {function}
   * @since 0.11.0
   */
  onAuthorityRemove: PropTypes.func,


  /**
   * Callback function to handle the event to add a user to a group.
   *
   * @type {function}
   * @since 0.16.0
   */
  onGroupAdd: PropTypes.func,

  /**
   * Callback function to handle the event to remove a user from a group.
   *
   * @type {function}
   * @since 0.16.0
   */
  onGroupRemove: PropTypes.func,

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
   * Callback function to handle the user activation event.
   *
   * @type {function}
   */
  onUserActivate: PropTypes.func,

  /**
   * Callback function to handle the user deactivation event.
   *
   * @type {function}
   */
  onUserDeactivate: PropTypes.func,

  /**
   * Callback function to handle invalidation of private key for user
   *
   * @type {function}
   */
  onUserInvalidateKeypair: PropTypes.func,

  /**
   * Callback function to handle the user password reset event.
   *
   * @type {function}
   */
  onUserPasswordReset: PropTypes.func,

  /**
   * Callback function to toggle the user lock status.
   *
   * @type {function}
   */
  toggleLockStatus: PropTypes.func,

  /**
   * The user.
   *
   * @type {object}
   */
  user: PropTypes.object.isRequired
};

UserModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default UserModal;

import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import _ from "lodash";
import {Badge, Button, Col, Dropdown, Form, Icon, Input, Menu, Modal, Row, Tooltip} from "antd";
import appConfig from "./../../config/app";
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
import "antd/lib/tooltip/style/index.less";
import "./UserModal.less";

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

  render() {
    const {
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onGeneratePasswordResetToken,
      onSave,
      onUserActivate,
      onUserDeactivate,
      onValueChange,
      toggleLockStatus,
      user,
      ...modalProps
    } = this.props;

    const {passwordResetModalValuesValid, passwordResetModalVisible} = this.state;

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
      GENERATE_PASSWORD_RESET_TOKEN: {
        keyName: "GENERATE_PASSWORD_RESET_TOKEN",
        handler: onGeneratePasswordResetToken
      },
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
      }
    };

    const copyToClipboardIcon = (value) => (
      <CopyToClipboard text={value}>
        <Tooltip title="Copied to clipboard" trigger="click">
          <Icon type="copy" className="copy-to-clipboard-icon"/>
        </Tooltip>
      </CopyToClipboard>
    );

    const defaultUserAvatar = () => <img src={appConfig.assets.wireframe.avatars.matthew} className="user-avatar"/>;

    const footerOperationsDropdownMenu = (
      <Menu onClick={(key) => OPERATION_TYPES[key.key].handler()} selectable={false}>
        <Menu.Item key={OPERATION_TYPES.GENERATE_PASSWORD_RESET_TOKEN.keyName} disabled={!!(locked || user.resetKey || !user.activated)}>Generate password reset token</Menu.Item>
        <Menu.Item key={OPERATION_TYPES.RESET_PASSWORD.keyName} disabled={locked || !user.resetKey}>Reset password</Menu.Item>
        <Menu.Item key={OPERATION_TYPES.USER_ACTIVATE.keyName} disabled={locked || user.activated}>Activate</Menu.Item>
        <Menu.Item key={OPERATION_TYPES.USER_DEACTIVATE.keyName} disabled={locked || !user.activated}>Deactivate</Menu.Item>
      </Menu>
    );

    const formItems = () => (
      <div>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="activationKey"
            addonBefore="Activation token"
            value={user.activationKey}
            readOnly={true}
            disabled={!user.activationKey}
            suffix={user.activationKey ? copyToClipboardIcon(user.activationKey) : null}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Tooltip title={!!user.resetDate && new Date(user.resetDate).toLocaleString()} mouseEnterDelay={1} placement="left">
            <Input
              name="resetKey"
              addonBefore="Password reset token"
              value={user.resetKey}
              readOnly={true}
              disabled={!user.resetKey}
              suffix={user.resetKey ? copyToClipboardIcon(user.resetKey) : null}
            />
          </Tooltip>
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdBy"
            addonBefore="Created by"
            value={user.createdBy}
            readOnly={true}
            disabled={!user.createdBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdDate"
            addonBefore="Created on"
            value={user.createdDate && new Date(user.createdDate).toLocaleString()}
            readOnly={true}
            disabled={!user.createdDate}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedBy"
            addonBefore="Modified by"
            value={user.lastModifiedBy}
            readOnly={true}
            disabled={!user.lastModifiedBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedDate"
            addonBefore="Modified on"
            value={user.lastModifiedDate && new Date(user.lastModifiedDate).toLocaleString()}
            readOnly={true}
            disabled={!user.lastModifiedDate}
          />
        </Form.Item>
      </div>
    );

    const form = () => (
      <Form>
        <Form.Item {...editableFormItemLayout} label="Email" colon={false}>
          <Input
            name={creationMode ? "email" : "login"}
            prefix={<Icon type="mail"/>}
            addonAfter={appConfig.EMAIL_PREFIX}
            onChange={onValueChange}
            placeholder="Email"
            readOnly={!creationMode}
            suffix={user.email ? copyToClipboardIcon(user.email) : null}
            value={
              creationMode
                ? user.email
                : user.login ? user.login : null
            }
          />
        </Form.Item>
        <Form.Item {...editableFormItemLayout} label="First name" colon={false}>
          <Input
            name="firstName"
            onChange={onValueChange}
            placeholder="First name"
            value={user.firstName ? user.firstName : null}
          />
        </Form.Item>
        <Form.Item {...editableFormItemLayout} label="Last name" colon={false}>
          <Input
            name="lastName"
            onChange={onValueChange}
            placeholder="Last name"
            value={user.lastName ? user.lastName : null}
          />
        </Form.Item>
        {
          creationMode &&
          <Form.Item {...editableFormItemLayout} label="Password" colon={false}>
            <Input
              name="password"
              onChange={onValueChange}
              placeholder="Password"
              type="password"
              value={user.password}
            />
          </Form.Item>
        }
        {!creationMode && formItems()}
      </Form>
    );

    const lockStatusButton = () => (
      <Tooltip title={locked ? "Unlock" : "Lock"} mouseEnterDelay={1} placement="right">
        <Button key="lockStatus" type={locked ? "ghost" : "dashed"} onClick={toggleLockStatus} icon={locked ? "unlock" : "lock"}/>
      </Tooltip>
    );

    const footer = () => (
      <div className="footer">
        <Row type="flex" align="middle">
          <Col span={8}>
            <div className="operations">
              {!creationMode && <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>}
              {
                !creationMode &&
                <Dropdown overlay={footerOperationsDropdownMenu} size="large" placement="topLeft" disabled={locked}>
                  <Button key="more" type="primary" ghost={true} size="large" disabled={locked}><Icon type="down"/></Button>
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
                  name="resetKey"
                  addonBefore={<Icon type="pay-circle-o"/>}
                  value={user.resetKey}
                  readOnly={true}
                  disabled={!user.resetKey}
                  suffix={user.resetKey ? copyToClipboardIcon(user.resetKey) : null}
                />
              </Form.Item>
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
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-user-modal"
        {...modalProps}>
        <Row gutter={24}>
          <Col span={6}>
            {
              !creationMode
                ?
                <Badge dot={true} className={user.activated ? "badge-activated" : "badge-deactivated"}>
                  {defaultUserAvatar()}
                </Badge>
                :
                defaultUserAvatar()
            }
          </Col>
          <Col span={18}>{form()}</Col>
        </Row>
        {!creationMode && <Row span={4}>{lockStatusButton()}</Row>}
        <Row><Col>{footer()}</Col></Row>
        {passwordResetInnerModal()}
      </Modal>
    );
  }
}

UserModal.propTypes = {
  /**
   * Indicates if the user modal is in creation mode.
   *
   * @type {boolean}
   */
  creationMode: PropTypes.bool.isRequired,

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
  onDelete: PropTypes.func.isRequired,

  /**
   * Callback function to handle the password reset token generation events.
   *
   * @type {function}
   */
  onGeneratePasswordResetToken: PropTypes.func.isRequired,

  /**
   * Callback function to handle the save event.
   *
   * @type {function}
   */
  onSave: PropTypes.func.isRequired,

  /**
   * Callback function to handle the user activation event.
   *
   * @type {function}
   */
  onUserActivate: PropTypes.func.isRequired,

  /**
   * Callback function to handle the user deactivation event.
   *
   * @type {function}
   */
  onUserDeactivate: PropTypes.func.isRequired,

  /**
   * Callback function to handle the user password reset event.
   *
   * @type {function}
   */
  onUserPasswordReset: PropTypes.func.isRequired,

  /**
   * Callback function to handle input value change events.
   *
   * @type {function}
   */
  onValueChange: PropTypes.func.isRequired,

  /**
   * Callback function to toggle the user lock status.
   *
   * @type {function}
   */
  toggleLockStatus: PropTypes.func.isRequired,

  /**
   * The user.
   *
   * @type {object}
   */
  user: PropTypes.object.isRequired
};

UserModal.defaultProps = {
  loading: false
};

export default UserModal;
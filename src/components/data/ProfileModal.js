import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {Button, Col, Dropdown, Form, Icon, Input, Menu, Modal, Row, Tabs} from "antd";
import appConfig from "./../../config/app";
import {authStore} from "../../Communikey";
import KeypairWizard from "./views/KeypairWizard";
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
import "./ProfileModal.less";

const ManagedProfileForm = Form.create()(
  (props) => {
    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          {...managedFormItemLayout}
          colon={false}
        >
          <Input
            addonBefore="Email"
            prefix={<Icon type="lock"/>}
            addonAfter={appConfig.EMAIL_PREFIX}
            readOnly={true}
            value={authStore.login}
          />
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          colon={false}
        >
          <Input
            addonBefore="Firstname"
            prefix={<Icon type="lock"/>}
            readOnly={true}
            value={authStore.firstName}
          />
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          colon={false}
        >
          <Input
            addonBefore="Lastname"
            prefix={<Icon type="lock"/>}
            readOnly={true}
            value={authStore.lastName}
          />
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          colon={false}
        >
          <Input
            placeholder="No Key avaiable"
            type="textarea"
            autosize={{minRows: 2, maxRows: 6}}
            readOnly={true}
            value={authStore.publicKey}
          />
        </Form.Item>
      </Form>
    );
  }
);

const ManagedPasswordForm = Form.create()(
  (props) => {
    const {form, checkPassword} = props;
    const {getFieldDecorator} = form;
    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("password") ? "error"  : ""}
          colon={false}
        >
          {getFieldDecorator("password", {
            rules: [{
              required: true, message: "Password is required"}]
          })(
            <Input
              name="password"
              prefix={<Icon type="lock"/>}
              type="password"
              placeholder="Password"
            />)
          }
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("passwordConfirmation") ? "error"  : ""}
          colon={false}
        >
          {getFieldDecorator("passwordConfirmation", {
            rules: [{required: true, message: "Password confirmation is required"},
              {validator: checkPassword}]
          })(
            <Input
              name="passwordConfirmation"
              prefix={<Icon type="lock"/>}
              type="password"
              placeholder="Password confirmation"
            />)
          }
        </Form.Item>
      </Form>
    );
  }
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
 * The name of the React key for the general tab.
 *
 * @type {string}
 * @since 0.15.0
 */
const TAB_PANE_REACT_KEY_PROFILE = "profile";

/**
 * The name of the React key for the authorities tab.
 *
 * @type {string}
 * @since 0.15.0
 */
const TAB_PANE_REACT_KEY_SETTINGS = "settings";

/**
 * The name of the React key for the authorities tab.
 *
 * @type {string}
 * @since 0.15.0
 */
const TAB_PANE_REACT_KEY_WIZARD = "wizard";

/**
 * A modal for the profile page.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */
class ProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The React key of the active tab.
       *
       * @type {string}
       * @since 0.11.0
       */
      activeTabViewKey: TAB_PANE_REACT_KEY_PROFILE,

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
      passwordResetModalVisible: false,

      /**
       * The default processing status.
       *
       * @default false
       * @type {boolean}
       */
      processing: false
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
   * Handles the action button click event.
   *
   * @since 0.15.0
   */
  handleSubmit = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      this.setState({processing: true});
      authStore.resetPassword(payload.password)
        .then(() => {
          this.setState({
            processing: false,
            passwordResetModalVisible: false
          });
          this.form.resetFields();
        });
    }
  });

  /**
   * Validator for the form to check the equality of both password input fields
   *
   * @since 0.15.0
   */
  checkPassword = (rule, value, callback) => {
    const form = this.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("The passwords don't match. Please try again.");
    } else {
      callback();
      this.setState({passwordResetModalValuesValid: true});
    }
  }


  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.15.0
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Resets the state user object.
   */
  resetPasswordResetModalValues = () => this.setState({passwordResetModalConfirmValue: "", passwordResetModalNewPasswordValue: ""});

  /**
   * Toggles the password reset modal.
   */
  togglePasswordResetModal = () => this.setState(prevState => ({passwordResetModalVisible: !prevState.passwordResetModalVisible}));

  handleOnClose = () => {
    console.log("Closing!");
    this.setState({activeTabViewKey: TAB_PANE_REACT_KEY_PROFILE});
    this.props.onClose();
  };

  render() {
    const {
      loading,
      onClose,
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
      }
    };

    const footerOperationsDropdownMenu = (
      <Menu onClick={(key) => OPERATION_TYPES[key.key].handler()} selectable={false}>
        <Menu.Item key={OPERATION_TYPES.RESET_PASSWORD.keyName}>Reset password</Menu.Item>
      </Menu>
    );

    const footer = () => (
      <div className="footer">
        <Row type="flex" align="middle">
          <Col span={8}>
            <div className="operations">
              {_.isEqual(activeTabViewKey, TAB_PANE_REACT_KEY_PROFILE) &&
                <div>
                  <Dropdown overlay={footerOperationsDropdownMenu} size="large" placement="topLeft" trigger={["click"]}>
                    <Button key="more" type="primary" ghost={true} size="large"><Icon type="down"/></Button>
                  </Dropdown>
                </div>
              }
            </div>
          </Col>
          <Col span={8} offset={8}>
            <div className="main">
              <Button
                type="primary"
                size="large"
                onClick={this.handleOnClose}
                loading={loading}
              >
                Done
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );

    const tabViewProfile = () => (
      <Tabs.TabPane tab="Profile" key={TAB_PANE_REACT_KEY_PROFILE}>
        <Row type="flex" align="center">
          <Col span={18}>
            <ManagedProfileForm/>
          </Col>
        </Row>
      </Tabs.TabPane>
    );

    const tabViewWizard = () => (
      <Tabs.TabPane tab="Wizard" key={TAB_PANE_REACT_KEY_WIZARD}>
        <Row type="flex" align="center">
          <Col span={18}>
            <KeypairWizard/>
          </Col>
        </Row>
      </Tabs.TabPane>
    );

    const tabViewSettings = () => (
      <Tabs.TabPane tab="Settings" key={TAB_PANE_REACT_KEY_SETTINGS}>
        <Row type="flex" align="center">
          <Col span={18}>
          </Col>
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
            <ManagedPasswordForm
              checkPassword={this.checkPassword}
              ref={this.saveManagedFormRef}
            />
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
                    onClick={this.handleSubmit}
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
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-user-modal"
      >
        <Tabs defaultActiveKey={TAB_PANE_REACT_KEY_PROFILE} onChange={(activeTabViewKey) => this.setState({activeTabViewKey})}>
          {tabViewProfile()}
          {tabViewSettings()}
          {tabViewWizard()}
        </Tabs>
        <Row><Col>{footer()}</Col></Row>
        {passwordResetInnerModal()}
      </Modal>
    );

  }
}

ProfileModal.propTypes = {
  /**
   * Callback function to handle close events.
   *
   * @type {function}
   */
  onClose: PropTypes.func.isRequired,

  /**
   * The current processing status.
   *
   * @type {boolean}
   */
  loading: PropTypes.bool
};

export default ProfileModal;

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {Button, Col, Dropdown, Form, Icon, Input, Menu, Modal, Row, Tabs} from "antd";
import appConfig from "./../../config/app";
import {authStore, notificationService} from "../../Communikey";
import KeypairWizard from "./views/KeypairWizard";
import ConfirmationModal from "./ConfirmationModal";
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
  () => {
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
            placeholder="No Key available"
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
    sm: {span: 20, offset: 2}
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
       * The visibility status of the cancel wizard modal.
       *
       * @default false
       * @type {boolean}
       */
      cancelModalVisible: false,

      /**
       * The default processing status.
       *
       * @default false
       * @type {boolean}
       */
      processing: false,

      /**
       * The default tabs lock status.
       *
       * @default false
       * @type {boolean}
       */
      tabsLocked: false,

      /**
       * The current step in the wizard
       *
       * @default 0
       * @type {number}
       */
      currentWizardStep: 0
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
          notificationService.success("Password changed", "Your password has been changed successfully", 5);
          this.form.resetFields();
        });
    }
  });

  /**
   * Validator for the form to check the equality of both password input fields
   */
  checkPassword = (rule, value, callback) => {
    const form = this.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("The passwords don't match. Please try again.");
    } else {
      callback();
      this.setState({passwordResetModalValuesValid: true});
    }
  };


  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Sets the processing status.
   *
   * @param {boolean} status - The new processing status value
   */
  setProcessingStatus = (status) => this.setState({processing: status});

  /**
   * Resets the state password ereset value.
   */
  resetPasswordResetModalValues = () => this.setState({passwordResetModalConfirmValue: "", passwordResetModalNewPasswordValue: ""});

  /**
   * Toggles the password reset modal.
   */
  togglePasswordResetModal = () => this.setState(prevState => ({passwordResetModalVisible: !prevState.passwordResetModalVisible}));

  /**
   * Toggles the cancel wizard modal.
   */
  toggleCancelModal = () => this.setState(prevState => ({cancelModalVisible: !prevState.cancelModalVisible}));

  handleCancelOnClose = () => {
    this.setState(
      {
        tabsLocked: false
      });
    this.toggleCancelModal();
    this.changeTab(TAB_PANE_REACT_KEY_PROFILE);
  };

  handleOnClose = () => {
    this.setState({activeTabViewKey: TAB_PANE_REACT_KEY_PROFILE});
    this.props.onClose();
  };

  handleCancel = () => {
    this.toggleCancelModal();
  };

  handleCancelOnCancel = () => {
    this.toggleCancelModal();
  };

  changeTab = (activeTabViewKey) => {
    this.setState({activeTabViewKey});
    if(activeTabViewKey === TAB_PANE_REACT_KEY_WIZARD) {
      if(this.state.currentWizardStep !== 2) {
        this.props.setCloseable(false);
        this.setState({tabsLocked: true});
      }
    } else {
      this.props.setCloseable(true);
    }
  };

  render() {
    const {
      loading,
      onClose,
      ...modalProps
    } = this.props;
    const {activeTabViewKey, passwordResetModalValuesValid, passwordResetModalVisible, cancelModalVisible} = this.state;

    /**
     * Operations name constants and the name of the callback function. Builds the footer drop down.
     */
    const OPERATION_TYPES = {
      RESET_PASSWORD: {
        keyName: "RESET_PASSWORD",
        handler: this.togglePasswordResetModal
      }
    };

    /**
     * The footer drop down
     */
    const footerOperationsDropdownMenu = (
      <Menu onClick={(key) => OPERATION_TYPES[key.key].handler()} selectable={false}>
        <Menu.Item key={OPERATION_TYPES.RESET_PASSWORD.keyName} disabled={!authStore.passwordResetToken}>Reset password</Menu.Item>
      </Menu>
    );

    /**
     * The footer
     */
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
              {this.props.maskClosable &&
              <Button
                type="primary"
                size="large"
                onClick={this.handleOnClose}
                loading={loading}
              >
                Done
              </Button>
              }
              {!this.props.maskClosable &&
              <Button
                type="danger"
                size="large"
                onClick={this.handleCancel}
                loading={loading}
              >
                Cancel
              </Button>
              }
            </div>
          </Col>
        </Row>
      </div>
    );

    /**
     * The content of the profile tab.
     */
    const tabViewProfile = () => (
      <Tabs.TabPane tab="Profile" disabled={this.state.tabsLocked} key={TAB_PANE_REACT_KEY_PROFILE}>
        <Row type="flex" align="center">
          <Col span={18}>
            <ManagedProfileForm/>
          </Col>
        </Row>
      </Tabs.TabPane>
    );

    const changeStep = (step) => {
      this.setState({currentWizardStep: step});
      if(step === 2) {
        this.props.setCloseable(true);
        this.setState({tabsLocked: false});
      } else {
        this.props.setCloseable(false);
        this.setState({tabsLocked: true});
      }
    };

    /**
     * The content of the wizard tab.
     */
    const tabViewWizard = () => (
      <Tabs.TabPane tab="Wizard" key={TAB_PANE_REACT_KEY_WIZARD}>
        <Row type="flex" align="center">
          <Col span={18}>
            <KeypairWizard
              onStepChange={changeStep}
            />
          </Col>
        </Row>
      </Tabs.TabPane>
    );

    /**
     * The content of the settings tab.
     */
    const tabViewSettings = () => (
      <Tabs.TabPane disabled={true} tab="Settings" key={TAB_PANE_REACT_KEY_SETTINGS}>
        <Row type="flex" align="center">
          <Col span={18}>
          </Col>
        </Row>
      </Tabs.TabPane>
    );

    /**
     * The password reset modal.
     */
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

    /**
     * The cancel button
     */
    const cancelButton = () => (
      <Button key="cancel-cancel-keypair-wizard" size="large" onClick={this.handleCancelOnCancel}>Stay</Button>
    );

    /**
     * The proceed button
     */
    const proceedButton = () => (
      <Button key="cancel-keypair-wizard" size="large" type="danger" onClick={this.handleCancelOnClose}>Leave</Button>
    );

    return (
      <Modal
        {...modalProps}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-user-modal"
      >
        <Tabs defaultActiveKey={TAB_PANE_REACT_KEY_PROFILE}
              activeKey={this.state.activeTabViewKey}
              onChange={this.changeTab}
        >
          {tabViewProfile()}
          {tabViewSettings()}
          {tabViewWizard()}
        </Tabs>
        <Row><Col>{footer()}</Col></Row>
        {passwordResetInnerModal()}
        <ConfirmationModal
          cancel={cancelButton()}
          proceed={proceedButton()}
          visible={cancelModalVisible}
          header="Are you sure you want to leave the setup early?"
          content="This might result in not being able to read or write passwords.
                   We suggest you to set your keypair before doing anything else."
        />
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
  loading: PropTypes.bool,

  /**
   * Is mask closable
   *
   * @type {boolean}
   */
  maskClosable: PropTypes.bool.isRequired,

  /**
   * Callback function to set the modal closeable
   *
   * @type {function}
   */
  setCloseable: PropTypes.func.isRequired
};

export default ProfileModal;

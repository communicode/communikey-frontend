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
                onClick={this.props.onClose}
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
   * Callback function to handle the user password reset event.
   *
   * @type {function}
   */
  onUserPasswordReset: PropTypes.func,

  /**
   * The current processing status.
   *
   * @type {boolean}
   */
  loading: PropTypes.bool
};

export default ProfileModal;

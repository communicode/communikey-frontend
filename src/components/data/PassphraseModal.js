import React from "react";
import PropTypes from "prop-types";
import {Modal, Input, Icon, Row, Form} from "antd";
import {encryptionService, notificationService} from "../../Communikey";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/form/style/css";
import "./PassphraseModal.less";

const ManagedForm = Form.create()(
  (props) => {
    const {form, error} = props;
    const {getFieldDecorator} = form;
    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("passphrase") || error ? "error"  : ""}
          colon={false}
        >
          {getFieldDecorator("passphrase", {
            rules: [{
              required: true, message: "Passphrase is required"}]
          })(
            <Input
              name="passphrase"
              type="password"
              onPressEnter={props.handleSubmit}
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
    sm: {span: 18, offset: 3}
  }
};

/**
 * A modal for the passphrase invocation.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */
class PassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The result of the last passphrase check
       *
       * @default {""}
       * @type {boolean}
       */
      error: false
    };
  }

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.15.0
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Handles the action button click event.
   *
   * @since 0.15.0
   */
  handleSubmit = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      encryptionService.setPassphrase(payload.passphrase);
      encryptionService.checkPassphrase()
        .then((info) => {
          this.setState({
            error: false
          });
          notificationService.success(info.title, info.message, 2);
          this.props.passphraseNeededResolve();
          this.props.onClose();
        })
        .catch((info) => {
          this.setState({
            error: true
          });
          console.log(this.form);
          notificationService.error(info.title, info.message, 3);
        });
    }
  });

  handleCancel = () => {
    this.props.passphraseNeededReject();
    this.props.onClose();
  };

  handleInputValueChange = (newValue) => {
    this.setState({
      passphrase: newValue.target.value
    });
  };

  render() {
    return (
      <Modal
        type="confirm"
        className="passphrase-modal"
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        <Row class="IconRow">
          <Icon type="lock"/>
          <p>Please enter your key passphrase.</p>
        </Row>
        <Row>
          <ManagedForm
            ref={this.saveManagedFormRef}
            handleSubmit={this.handleSubmit}
            error={this.state.error}
          />
        </Row>
      </Modal>
    );

  }
}

PassphraseModal.propTypes = {
  /**
   * Callback function to handle close events.
   *
   * @type {function}
   */
  onClose: PropTypes.func.isRequired,

  /**
   * Callback function to handle successful close events.
   *
   * @type {function}
   */
  passphraseNeededResolve: PropTypes.func.isRequired,

  /**
   * Callback function to handle unsuccesful close events.
   *
   * @type {function}
   */
  passphraseNeededReject: PropTypes.func.isRequired,

  /**
   * Callback function to handle unsuccesful close events.
   *
   * @type {function}
   */
  visible: PropTypes.bool.isRequired
};

export default PassphraseModal;

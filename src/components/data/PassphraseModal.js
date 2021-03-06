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
import PropTypes from "prop-types";
import {Modal, Input, Icon, Row, Form} from "antd";
import {encryptionService, notificationService} from "../../Communikey";
import {IS_FIREFOX} from "../../services/UtilityService";
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
      <Form
        hideRequiredMark={true}
        autocomplete="off"
      >
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
              className="show-as-bullets"
              type={IS_FIREFOX ? "password" : "text"}
              // onPressEnter={props.handleSubmit}
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
       * @default false
       * @type {boolean}
       */
      error: false
    };
  }

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Handles the action button click event.
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
          notificationService.error(info.title, info.message, 3);
        });
    }
  });

  /**
   * Handles the cancel button event.
   */
  handleCancel = () => {
    this.props.passphraseNeededReject();
    this.props.onClose();
  };

  /**
   * Handles the input box value change
   *
   * @param event - the event of the input box value change
   */
  handleInputValueChange = (event) => {
    this.setState({
      passphrase: event.target.value
    });
  };

  render() {
    return (
      <Modal
        wrapClassName="passphrase-modal-wrap"
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
   * Callback function to resolve the passphrase modal promise
   *
   * @type {function}
   */
  passphraseNeededResolve: PropTypes.func,

  /**
   * Callback function to reject the passphrase modal promise
   *
   * @type {function}
   */
  passphraseNeededReject: PropTypes.func,

  /**
   * Visibility state of the modal
   *
   * @type {function}
   */
  visible: PropTypes.bool.isRequired
};

export default PassphraseModal;

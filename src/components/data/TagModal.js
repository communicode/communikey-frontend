import React from "react";
import PropTypes from "prop-types";
import {Button, Col, Form, Icon, Input, Modal, Row, Tooltip} from "antd";
import "antd/lib/button/style/index.less";
import "antd/lib/checkbox/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/form/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/pagination/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/tooltip/style/index.less";
import "./TagModal.less";

/**
 * The managed form component.
 */
const ManagedForm = Form.create()(
  (props) => {
    const {administrationMode, tag, creationMode, form} = props;
    const {getFieldDecorator} = form;

    return (
      <Form hideRequiredMark={true}>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("name") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("name", {
            initialValue: tag.name,
            rules: [{required: true, message: "Name is required"}]
          })(
            <Input
              addonBefore="Name"
              readOnly={!administrationMode}
            />
          )}
        </Form.Item>
        <Form.Item
          {...managedFormItemLayout}
          validateStatus={form.getFieldError("color") ? "error" : ""}
          colon={false}
        >
          {getFieldDecorator("color", {
            initialValue: tag.name,
            rules: [{required: true, message: "Color is required"}]
          })(
            <Input
              addonBefore="Color"
              readOnly={!administrationMode}
            />
          )}
        </Form.Item>
        {!creationMode && administrationMode &&
        <div>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="id"
              prefix={<Icon type="lock"/>}
              addonBefore="ID"
              value={tag.id}
              readOnly={true}
              disabled={!tag.id}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Created by"
              value={tag.createdBy}
              readOnly={true}
              disabled={!tag.createdBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="createdDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Created on"
              value={tag.createdDate && new Date(tag.createdDate).toLocaleString()}
              readOnly={true}
              disabled={!tag.createdDate}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedBy"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified by"
              value={tag.lastModifiedBy}
              readOnly={true}
              disabled={!tag.lastModifiedBy}
            />
          </Form.Item>
          <Form.Item {...managedFormItemLayout}>
            <Input
              name="lastModifiedDate"
              prefix={<Icon type="lock"/>}
              addonBefore="Modified on"
              value={tag.lastModifiedDate && new Date(tag.lastModifiedDate).toLocaleString()}
              readOnly={true}
              disabled={!tag.lastModifiedDate}
            />
          </Form.Item>
        </div>
        }
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
 * A modal for tags.
 *
 * @author dvonderbey@communicode.de
 * @since 0.18.0
 */
class TagModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * Handles the action button click event.
   */
  handleActionButtonOnClick = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      this.props.onSave(payload);
      this.form.resetFields();
    }
  });

  /**
   * Handles the close event.
   */
  handleOnClose = () => {
    this.form.resetFields();
    this.props.onClose();
  };

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   */
  saveManagedFormRef = (form) => this.form = form;

  render() {
    const {
      administrationMode,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      toggleLockStatus,
      tag,
      ...modalProps
    } = this.props;

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
              {!creationMode && administrationMode &&
              <Button.Group>
                <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>
              </Button.Group>
              }
            </div>
          </Col>
          <Col span={8} offset={8}>
            <div className="main">
              <Button size="large" onClick={this.handleOnClose}>Cancel</Button>
              <Button type="primary" size="large" onClick={this.handleActionButtonOnClick} loading={loading}>
                {creationMode ? "Create" : "Done"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );

    return (
      <Modal
        id="cckey-components-data-views-tag-modal"
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-tag-modal"
        {...modalProps}>
        <Row>
          <Col span={24}>
            <ManagedForm
              ref={this.saveManagedFormRef}
              tag={tag}
              administrationMode={administrationMode}
              creationMode={creationMode}
            />
          </Col>
        </Row>
        {!creationMode && administrationMode && <Row span={4}>{lockStatusButton()}</Row>}
        <Row><Col>{footer()}</Col></Row>
      </Modal>
    );
  }
}

TagModal.propTypes = {
  /**
   * Indicates if the user group modal is in administration mode.
   */
  administrationMode: PropTypes.bool,

  /**
   * Indicates if the user group modal is in creation mode.
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
   * Callback function to toggle the tag lock status.
   *
   * @type {function}
   */
  toggleLockStatus: PropTypes.func,

  /**
   * The tag.
   *
   * @type {object}
   */
  tag: PropTypes.object.isRequired
};

TagModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default TagModal;

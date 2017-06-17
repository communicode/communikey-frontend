import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button, Col, Form, Icon, Input, Modal, Row, Tooltip} from "antd";
import "antd/lib/button/style/index.less";
import "antd/lib/col/style/css";
import "antd/lib/form/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/tooltip/style/index.less";
import "./UserGroupModal.less";

/**
 * A modal for user groups.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.9.0
 */
class UserGroupModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      administrationMode,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      onValueChange,
      toggleLockStatus,
      userGroup,
      ...modalProps
    } = this.props;

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

    const copyToClipboardIcon = (value) => (
      <CopyToClipboard text={value}>
        <Tooltip title="Copied to clipboard" trigger="click">
          <Icon type="copy" className="copy-to-clipboard-icon"/>
        </Tooltip>
      </CopyToClipboard>
    );

    const formItems = () => (
      <div>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="id"
            addonBefore="ID"
            value={userGroup.id}
            readOnly={true}
            disabled={!userGroup.id}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdBy"
            addonBefore="Created by"
            value={userGroup.createdBy}
            readOnly={true}
            disabled={!userGroup.createdBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="createdDate"
            addonBefore="Created on"
            value={userGroup.createdDate && new Date(userGroup.createdDate).toLocaleString()}
            readOnly={true}
            disabled={!userGroup.createdDate}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedBy"
            addonBefore="Modified by"
            value={userGroup.lastModifiedBy}
            readOnly={true}
            disabled={!userGroup.lastModifiedBy}
          />
        </Form.Item>
        <Form.Item {...readOnlyFormItemLayout}>
          <Input
            name="lastModifiedDate"
            addonBefore="Modified on"
            value={userGroup.lastModifiedDate && new Date(userGroup.lastModifiedDate).toLocaleString()}
            readOnly={true}
            disabled={!userGroup.lastModifiedDate}
          />
        </Form.Item>
      </div>
    );

    const form = () => (
      <Form>
        <Form.Item {...editableFormItemLayout} label="Name" colon={false}>
          <Input
            name="name"
            onChange={onValueChange}
            placeholder="Name"
            readOnly={!administrationMode}
            value={userGroup.name ? userGroup.name : null}
            suffix={userGroup.name ? copyToClipboardIcon(userGroup.name) : null}
          />
        </Form.Item>
        {!creationMode && administrationMode && formItems()}
      </Form>
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
              {!creationMode && administrationMode &&
              <Button.Group>
                <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>
              </Button.Group>
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

    return (
      <Modal
        id="cckey-components-data-views-user-group-modal"
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-user-group-modal"
        {...modalProps}>
        <Row>
          <Col span={24}>{form()}</Col>
        </Row>
        {!creationMode && administrationMode && <Row span={4}>{lockStatusButton()}</Row>}
        <Row><Col>{footer()}</Col></Row>
      </Modal>
    );
  }
}

UserGroupModal.propTypes = {
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
   * Callback function to handle input value change events.
   *
   * @type {function}
   */
  onValueChange: PropTypes.func,

  /**
   * Callback function to toggle the user lock status.
   *
   * @type {function}
   */
  toggleLockStatus: PropTypes.func,

  /**
   * The user group.
   *
   * @type {object}
   */
  userGroup: PropTypes.object.isRequired
};

UserGroupModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default UserGroupModal;

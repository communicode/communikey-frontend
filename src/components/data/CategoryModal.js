import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button, Col, Dropdown, Form, Icon, Input, Menu, Modal, Row, Tooltip} from "antd";
import "antd/lib/button/style/index.less";
// import "antd/lib/col/style/css";
import "antd/lib/dropdown/style/index.less";
import "antd/lib/form/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/input/style/index.less";
import "antd/lib/menu/style/index.less";
import "antd/lib/modal/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/tooltip/style/index.less";
import "./CategoryModal.less";

/**
 * A modal for categories.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class CategoryModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      administrationMode,
      category,
      creationMode,
      loading,
      locked,
      onClose,
      onDelete,
      onSave,
      onValueChange,
      toggleLockStatus,
      ...modalProps
    } = this.props;

    const copyToClipboardIcon = (value) => (
      <CopyToClipboard text={value}>
        <Tooltip title="Copied to clipboard" trigger="click">
          <Icon type="copy" className="copy-to-clipboard-icon"/>
        </Tooltip>
      </CopyToClipboard>
    );

    const footerOperationsDropdownMenu = <Menu selectable={false}/>;

    const formItems = () => (
      <div>
        <Form.Item>
          <Input
            name="id"
            addonBefore="ID"
            value={category.id}
            readOnly={true}
            disabled={!category.id}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="createdBy"
            addonBefore="Created by"
            value={category.createdBy}
            readOnly={true}
            disabled={!category.createdBy}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="createdDate"
            addonBefore="Created on"
            value={category.createdDate && new Date(category.createdDate).toLocaleString()}
            readOnly={true}
            disabled={!category.createdDate}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="lastModifiedBy"
            addonBefore="Modified by"
            value={category.lastModifiedBy}
            readOnly={true}
            disabled={!category.lastModifiedBy}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="lastModifiedDate"
            addonBefore="Modified on"
            value={category.lastModifiedDate && new Date(category.lastModifiedDate).toLocaleString()}
            readOnly={true}
            disabled={!category.lastModifiedDate}
          />
        </Form.Item>
      </div>
    );

    const form = () => (
      <Form>
        <Form.Item label="Name" colon={false}>
          <Input
            name="name"
            onChange={onValueChange}
            placeholder="Name"
            suffix={category.name ? copyToClipboardIcon(category.name) : null}
            readOnly={!administrationMode}
            value={category.name}
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
              {!creationMode && administrationMode && <Button disabled={locked} key="delete" type="danger" ghost={true} size="large" icon="delete" onClick={onDelete}/>}
              {
                !creationMode && administrationMode &&
                <Dropdown overlay={footerOperationsDropdownMenu} size="large" placement="topLeft" disabled={true}>
                  <Button key="more" type="primary" ghost={true} size="large" disabled={true}><Icon type="down"/></Button>
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

    return (
      <Modal
        {...modalProps}
        onSave={onSave}
        onClose={onClose}
        footer={false}
        closable={false}
        className="cckey-category-modal"
      >
        <Row type="flex" align="center">
          <Col span={18}>{form()}</Col>
        </Row>
        {!creationMode && administrationMode && <Row span={4}>{lockStatusButton()}</Row>}
        <Row><Col>{footer()}</Col></Row>
      </Modal>
    );
  }
}

CategoryModal.propTypes = {
  /**
   * Indicates if the category modal is in administration mode.
   */
  administrationMode: PropTypes.bool,

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
   * The category.
   *
   * @type {object}
   */
  category: PropTypes.object.isRequired
};

CategoryModal.defaultProps = {
  administrationMode: false,
  creationMode: false,
  loading: false
};

export default CategoryModal;

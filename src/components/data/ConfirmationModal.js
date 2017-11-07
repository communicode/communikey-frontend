import React from "react";
import PropTypes from "prop-types";
import {Row, Col, Modal} from "antd";
import "antd/lib/row/style/css";
import "antd/lib/col/style/css";
import "antd/lib/modal/style/index.less";
import  "./ConfirmationModal.less";

/**
 * A generic confirmation modal for various uses where user interaction
 * might be confirmed twice.
 *
 *
 * @author lleifermann@communicode.de
 * @since 0.17.0
 */
class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {cancel, proceed, visible, header, content} = this.props;
    return(
      <Modal
        visible={visible}
        footer={false}
        closable={false}
        className="confirmation-modal">
        <Row>
          <h1>
            {header}
          </h1>
          <p>
            {content}
          </p>
        </Row>
        <Row>
          <div className="footer">
            <Row type="flex" justify="end">
                {cancel}
                {proceed}
            </Row>
          </div>
        </Row>
      </Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  /**
   * The cancel button
   */
  cancel: PropTypes.object.isRequired,

  /**
   * The proceed button
   */
  proceed: PropTypes.object.isRequired,

  /**
   * Visibility of the modal
   */
  visible: PropTypes.bool.isRequired,

  /**
   * Headline of the confirmation modal
   */
  header: PropTypes.string.isRequired,

  /**
   * Content of the confirmation modal
   */
  content: PropTypes.string.isRequired

};

export default ConfirmationModal;

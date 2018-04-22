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
import {Row, Modal} from "antd";
import "antd/lib/row/style/css";
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

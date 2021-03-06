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
import {Button} from "antd";
import "antd/lib/button/style/index.less";
import "./NoDataMessageBox.less";

/**
 * A message box to signal that there is no data available.
 * It provides an attached call-to-action button.
 *
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
class NoDataMessageBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      callToActionButtonDisabled,
      callToActionButtonIconType,
      callToActionButtonVisible,
      headlineText,
      icon,
      onCallToActionButtonClick,
      subHeadlineText
    } = this.props;

    return (
      <div className="container">
        <div className="wrapper">
          <span className="icon">{icon}</span>
          <div className="text">
            <div className="headline">{headlineText}</div>
            <p className="sub-headline">{subHeadlineText}</p>
          </div>
        </div>
        {callToActionButtonVisible &&
          <Button
            className="call-to-action-button"
            icon={callToActionButtonIconType}
            onClick={onCallToActionButtonClick}
            disabled={callToActionButtonDisabled}
        />}
      </div>
    );
  }
}

NoDataMessageBox.propTypes = {
  /**
   * Determines whether the call-to-action button is disabled.
   */
  callToActionButtonDisabled: PropTypes.bool,

  /**
   * The icon type of the call-to-action button.
   */
  callToActionButtonIconType: PropTypes.string,

  /**
   * Determines whether the call-to-action button is visible.
   */
  callToActionButtonVisible: PropTypes.bool,

  /**
   * The text of the headline.
   */
  headlineText: PropTypes.string,

  /**
   * The icon.
   */
  icon: PropTypes.element,

  /**
   * Callback function to handle call-to-action button click events.
   */
  onCallToActionButtonClick: PropTypes.func,

  /**
   * The text of the sub-headline.
   */
  subHeadlineText: PropTypes.string
};

NoDataMessageBox.defaultProps = {
  callToActionButtonDisabled: false,
  callToActionButtonIconType: "plus",
  callToActionButtonVisible: false,
  headlineText: "There is no data yet.",
  icon: null,
  subHeadlineText: ""
};

export default NoDataMessageBox;

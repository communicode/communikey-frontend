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
import LiveFeedWidget from "./widgets/LiveFeedWidget";
import TutorialWidget from "./widgets/TutorialWidget";
import "./Widget.less";

/**
 * The widget component containing all widgets
 * for the dashboard.
 *
 * @author dvonderbey@communicode.de
 * @since 0.15.0
 */
class Widget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type, ...widgetProps} = this.props;

    switch (type) {
    case "livefeed": {
      return (
        <div className="widget">
          <LiveFeedWidget {...widgetProps}/>
        </div>
      );
    }
    case "tutorial": {
      return (
        <div className="widget">
          <TutorialWidget {...widgetProps}/>
        </div>
      );
    }
    }
  }
}

Widget.propTypes = {
  /**
   * The type of the widget.
   */
  type: PropTypes.string.isRequired
};

export default Widget;

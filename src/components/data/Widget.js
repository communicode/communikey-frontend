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

import React from "react";
// import {Link} from "react-router-dom";
import {Col, Card} from "antd";
import "antd/lib/col/style/css";
import "antd/lib/card/style/css";
import "./TutorialWidget.less";

/**
 * The tutorial widget that tries
 * to give tips for the first steps
 * in the webapp.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */
class TutorialWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Col span={24} className="widget-tutorial">
        <Card>
          Tutorial Widget
        </Card>
      </Col>
    );
  }
}

export default TutorialWidget;

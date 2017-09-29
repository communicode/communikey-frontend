import React from "react";
import {observer, inject, PropTypes as MobXPropTypes} from "mobx-react";
import {Row, Col, Card} from "antd";
import {EVENT_STORE} from "../stores/storeConstants";
import Widget from "../components/data/Widget";
import "antd/lib/row/style/css";
import "./Dashboard.less";
import "./../BaseLayout.less";

/**
 * The dashboard.
 *
 * @author sgreb@communicode.de
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.8.0
 */
@inject(EVENT_STORE)
@observer
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="cckey-routes-dashboard" className="cckey-base-layout-content-container">
        <Row>
          <Widget type="tutorial"/>
        </Row>
        <Row>
          <Widget type="livefeed"/>
        </Row>
      </div>
    );
  }
}

Dashboard.propTypes = {
  /**
   * The event store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  eventStore: MobXPropTypes.observableArray
};

export default Dashboard;
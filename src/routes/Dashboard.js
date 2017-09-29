import React from "react";
import PropTypes from "prop-types";
import {observer, inject, PropTypes as MobXPropTypes} from "mobx-react";
import {Row} from "antd";
import {EVENT_STORE, INVOCATION_HELPER} from "../stores/storeConstants";
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
@inject(EVENT_STORE, INVOCATION_HELPER)
@observer
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    if(props.openWizard) {
      props.invocationHelper.setWizardState(true);
      props.invocationHelper.setProfileModalState(true);
    }
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
  eventStore: MobXPropTypes.observableArray,

  /**
   * The event store injected by the MobX provider.
   *
   * @type {ObservableArray}
   */
  invocationHelper: MobXPropTypes.observableArray,

  /**
   * The event store injected by the MobX provider.
   *
   * @type {func}
   */
  toggleProfileModal: PropTypes.func,


  /**
   * The event store injected by the MobX provider.
   *
   * @type {bool}
   */
  openWizard: PropTypes.bool
};

export default Dashboard;
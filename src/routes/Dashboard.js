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
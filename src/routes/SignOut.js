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
import {Redirect} from "react-router-dom";
import {inject, PropTypes as MobxPropTypes} from "mobx-react";
import {ROUTE_SIGNIN} from "./routeMappings";
import PropTypes from "prop-types";
import {AUTH_STORE} from "../stores/storeConstants";
import {webSocketService} from "../Communikey";

@inject(AUTH_STORE)
class SignOut extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    webSocketService.initialized && webSocketService.close();
    localStorage.clear();
    this.props.authStore._reset();
  }

  render() {
    if (this.props.location.state) {
      return (
        <Redirect to={{
          pathname: ROUTE_SIGNIN,
          state: { forward: this.props.location.state.forward }
        }}/>
      );
    } else {
      return <Redirect to={ROUTE_SIGNIN}/>;
    }
  }
}

export default SignOut;

SignOut.propTypes = {
  /**
   * @type {ObservableArray} authStore - The injected authentication store
   */
  authStore: MobxPropTypes.observableArray,

  /**
   * @type {object} location - The location object of the react router
   */
  location: PropTypes.object
};


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
import {Route} from "react-router-dom";
import {keyStore, notificationService} from "../../Communikey";
import _ from "lodash";
import {redirectUnloggedToLogin} from "../../services/AuthService";
import {
  ERROR_KEY_NOT_FOUND_TITLE,
  ERROR_KEY_NOT_FOUND
} from "../../config/constants";
import "antd/lib/notification/style/index.css";
import "antd/lib/button/style/index.css";

/**
 * A Higher Order Component (HOC) for handling routes to deep linked keys.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author dvonderbey@communicode.de
 * @since 0.12.0
 */

const KeyDeepLink = ({component: Component, authorized, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      if (authorized) {
        const checkHash = (hash) => _.find(keyStore.keys, key => key.id === hash);
        let key = checkHash(props.match.params.id);
        !key && notificationService.error(ERROR_KEY_NOT_FOUND_TITLE, ERROR_KEY_NOT_FOUND, 5);
        return <Component component={Component} cckey={key} authorized={authorized} {...props}/>;
      } else {
        return redirectUnloggedToLogin(props.location.pathname);
      }
    }}
  />
);

export default KeyDeepLink;

KeyDeepLink.propTypes = {
  /**
   * @type {boolean} authorized - Determines if the user is authorized
   */
  authorized: PropTypes.bool.isRequired,

  /**
   * @type component - The React component to be wrapped
   */
  component: PropTypes.any.isRequired,

  /**
   * The match injected from the react router
   *
   * @type {object}
   */
  match: PropTypes.object,

  /**
   * @type {object} location - The location object of the react router
   */
  location: PropTypes.object
};
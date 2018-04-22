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
import {redirectUnloggedToLogin} from "../../services/AuthService";
import "antd/lib/notification/style/index.css";

/**
 * A Higher Order Component (HOC) for handling security restricted routes.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.3.0
 */
const AuthenticatedRoute = ({component: Component, authorized, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      if (authorized) {
        return <Component authorized={authorized} {...rest} />;
      } else {
        return redirectUnloggedToLogin(props.location.pathname);
      }
    }
    }
  />
);

export default AuthenticatedRoute;

AuthenticatedRoute.propTypes = {
  /**
   * @type {boolean} authorized - Determines if the user is authorized
   */
  authorized: PropTypes.bool.isRequired,

  /**
   * @type component - The React component to be wrapped
   */
  component: PropTypes.any.isRequired,

  /**
   * @type {object} location - The location object of the react router
   */
  location: PropTypes.object
};

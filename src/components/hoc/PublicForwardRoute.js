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
import {Route, Redirect} from "react-router-dom";
import {ROUTE_ROOT} from "../../routes/routeMappings";

/**
 * A Higher Order Component (HOC) for handling public routes.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
const PublicForwardRoute = ({component: Component, authorized, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      authorized
        ? <Redirect to={props.location.state ? props.location.state.forward : ROUTE_ROOT}/>
        : <Component authorized={authorized} {...props}/>}
  />
);

export default PublicForwardRoute;

PublicForwardRoute.propTypes = {
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
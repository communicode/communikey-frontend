import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";

/**
 * A Higher Order Component (HOC) for handling security restricted routes.
 *
 * @param Component - The component to route
 * @param {boolean} isAuthorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.3.0
 */
const AuthenticatedRoute = ({component: Component, isAuthorized, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      isAuthorized
        ? <Component isAuthorized={isAuthorized} {...props} />
        : <Redirect to={{pathname: "/login"}}/>}
  />
);

export default AuthenticatedRoute;

AuthenticatedRoute.propTypes = {
  /**
   * @type {boolean} isAuthorized - Determines if the user is authorized
   */
  isAuthorized: PropTypes.bool.isRequired
};
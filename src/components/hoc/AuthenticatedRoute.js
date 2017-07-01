import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";
import {ROUTE_SIGNOUT} from "./../../routes/routeMappings";

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
    render={props =>
      authorized
        ? <Component authorized={authorized} {...props} />
        : <Redirect to={{pathname: ROUTE_SIGNOUT}}/>}
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
  component: PropTypes.any.isRequired
};

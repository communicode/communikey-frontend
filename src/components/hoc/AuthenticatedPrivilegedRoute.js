import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";
import {ROUTE_SIGNOUT} from "./../../routes/routeMappings";

/**
 * A Higher Order Component (HOC) for handling security restricted routes requiring administrative privileges.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param {boolean} privileged - Determines if the user is privileged
 * @param rest - Pass-through properties
 * @constructor
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.9.0
 */
const AuthenticatedPrivilegedRoute = ({component: Component, authorized, privileged, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      authorized && privileged
        ? <Component authorized={authorized} privileged={privileged} {...props} />
        : <Redirect to={{pathname: ROUTE_SIGNOUT}}/>}
  />
);

export default AuthenticatedPrivilegedRoute;

AuthenticatedPrivilegedRoute.propTypes = {
  /**
   * Determines if the user is authorized
   */
  authorized: PropTypes.bool.isRequired,

  /**
   * The React component to be wrapped
   */
  component: PropTypes.any.isRequired,

  /**
   * Determines if the user is privileged
   */
  privileged: PropTypes.bool.isRequired
};

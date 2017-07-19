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
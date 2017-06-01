import React from "react";
import PropTypes from "prop-types";
import BaseLayout from "../../BaseLayout";
import {Route, Redirect} from "react-router-dom";
import {ROUTE_SIGNIN} from "./../../routes/routeMappings";

/**
 * A Higher Order Component (HOC) for handling security restricted routes wrapped in the {@link BaseLayout}.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author sgreb@communicode.de
 * @since 0.8.0
 */
const BaseLayoutAuthenticatedRoute = ({component: Component, authorized, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      authorized
        ? <BaseLayout><Component authorized={authorized} {...props} /></BaseLayout>
        : <Redirect to={{pathname: ROUTE_SIGNIN}}/>}
  />
);

export default BaseLayoutAuthenticatedRoute;

BaseLayoutAuthenticatedRoute.propTypes = {
  /**
   * @type {boolean} authorized - Determines if the user is authorized
   */
  authorized: PropTypes.bool.isRequired,

  /**
   * @type component - The React component to be wrapped
   */
  component: PropTypes.any.isRequired
};
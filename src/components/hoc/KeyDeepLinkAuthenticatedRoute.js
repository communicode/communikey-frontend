import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";
import {ROUTE_ROOT} from "./../../routes/routeMappings";
import _ from "lodash";

/**
 * A Higher Order Component (HOC) for handling public routes.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param keyStore - keyStore
 * @param rest - Pass-through properties
 * @constructor
 * @author sgreb@communicode.de
 * @since 0.8.0
 */

const KeyDeepLink = ({component: Component, authorized, keyStore, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      if (!authorized) {
        return <Redirect to={{pathname: ROUTE_ROOT}}/>;
      } else {
        const checkHash = (hash) => _.find(keyStore.keys, key => key.id == hash);
        let key = checkHash(props.match.params.id);
        return <Component cckey={key} authorized={authorized} {...props}/>;
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
   * The keyStore from the react router
   *
   * @type {object}
   */
  keyStore: PropTypes.object.isRequired
};
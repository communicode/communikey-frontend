import React from "react";
import PropTypes from "prop-types";
import {Route} from "react-router-dom";
import {redirectUnloggedToLogin, redirectUnauthorizedToLogin} from "../../services/AuthService";
import "antd/lib/notification/style/index.css";

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
    render={props => {
      if (authorized) {
        if (privileged) {
          return <Component authorized={authorized} privileged={privileged} {...rest}/>;
        } else {
          return redirectUnauthorizedToLogin(props.location.pathname);
        }
      } else {
        return redirectUnloggedToLogin(props.location.pathname);
      }
    }
  }
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
  privileged: PropTypes.bool.isRequired,

  /**
   * @type {object} location - The location object of the react router
   */
  location: PropTypes.object
};

import React from "react";
import PropTypes from "prop-types";
import {Route} from "react-router-dom";
import {keyStore} from "../../Communikey";
import _ from "lodash";
import {notification} from "antd";
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
        const openErrorNotification = () => {
          const key = `open${Date.now()}`;
          notification.open({
            message: ERROR_KEY_NOT_FOUND_TITLE,
            description: ERROR_KEY_NOT_FOUND,
            key
          });
        };
        notification.config({
          placement: "topRight",
          bottom: 50,
          duration: 0
        });
        const checkHash = (hash) => _.find(keyStore.keys, key => key.id === hash);
        let key = checkHash(props.match.params.id);
        !key && openErrorNotification();
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
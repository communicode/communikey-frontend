import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";
import {ROUTE_SIGNOUT} from "./../../routes/routeMappings";
import {keyStore} from "../../Communikey";
import _ from "lodash";
import {Button, notification} from "antd";
import "antd/lib/notification/style/index.css";
import "antd/lib/button/style/index.css";

/**
 * A Higher Order Component (HOC) for handling routes to deep linked keys.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author sgreb@communicode.de
 * @since 0.8.0
 */

const KeyDeepLink = ({component: Component, authorized, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      if (authorized) {
        const close = () => {
          console.log("Notification was closed. Either the close button was clicked or duration time elapsed.");
        };
        const openErrorNotification = () => {
          const key = `open${Date.now()}`;
          const btnClick = function () {
            notification.close(key);
          };
          const btn = (
            <Button type="primary" size="small" onClick={btnClick}>
              Confirm
            </Button>
          );
          notification.open({
            message: "Key not found!",
            description: "The key has not been found. Please check the supplied link.",
            btn,
            key,
            onClose: close
          });
        };

        notification.config({
          placement: "bottomRight",
          bottom: 50,
          duration: 0
        });
        const checkHash = (hash) => _.find(keyStore.keys, key => key.id === hash);
        let key = checkHash(props.match.params.id);
        !key && openErrorNotification();
        return <Component component={Component} cckey={key} authorized={authorized} {...props}/>;
      } else {
        return <Redirect to={{pathname: ROUTE_SIGNOUT}}/>;
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
  match: PropTypes.object
};
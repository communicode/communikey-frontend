import React from "react";
import PropTypes from "prop-types";
import {Route} from "react-router-dom";
import {notification} from "antd";
import {redirectUnloggedToLogin} from "../../services/AuthService";
import {categoryStore} from "../../Communikey";
import _ from "lodash";
import {
  ERROR_CATEGORY_NOT_FOUND_TITLE,
  ERROR_CATEGORY_NOT_FOUND
} from "../../config/constants";
import "antd/lib/notification/style/index.css";
import "antd/lib/button/style/index.css";

/**
 * A Higher Order Component (HOC) for handling routes to deep linked categories.
 *
 * @param Component - The components to route
 * @param {boolean} authorized - Determines if the user is authorized
 * @param rest - Pass-through properties
 * @constructor
 * @author dvonderbey@communicode.de
 * @since 0.13.0
 */

const CategoryDeepLink = ({component: Component, authorized, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      if (authorized) {
        const openErrorNotification = () => {
          const key = `open${Date.now()}`;
          notification.open({
            message: ERROR_CATEGORY_NOT_FOUND_TITLE,
            description: ERROR_CATEGORY_NOT_FOUND,
            key
          });
        };

        notification.config({
          placement: "topRight",
          bottom: 50,
          duration: 0
        });
        const checkHash = (hash) => _.find(categoryStore.categories, category => category.id === hash);
        let category = checkHash(props.match.params.id);
        !category && openErrorNotification();
        return <Component component={Component} category={category} authorized={authorized} {...props}/>;
      } else {
        return redirectUnloggedToLogin(props.location.pathname);
      }
    }}
  />
);

export default CategoryDeepLink;

CategoryDeepLink.propTypes = {
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
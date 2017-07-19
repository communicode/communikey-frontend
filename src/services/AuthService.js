import React from "react";
import axios from "axios";
import {API_AUTHORIZE, OAUTH_CHECK_TOKEN} from "../services/apiRequestMappings";
import {notification} from "antd";
import {ERROR_NOT_LOGGED_IN_TITLE, ERROR_NOT_LOGGED_IN, ERROR_NOT_AUTHORIZED_TITLE, ERROR_NOT_AUTHORIZED} from "../config/constants";
import {Redirect} from "react-router-dom";
import {ROUTE_SIGNOUT} from "../routes/routeMappings";
import "antd/lib/notification/style/index.css";

/**
 * Provides static functions for user authentications.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.3.0
 */
class AuthService {
  /**
   * Gets a OAuth2 access token if the specified credentials are valid.
   *
   * @param {string} login - The login of the user
   * @param {string} password - The password of the user
   * @return {Promise.<object>} - The promise for the OAuth2 access token
   * @since 0.8.0
   */
  static getOAuth2AccessToken = (login, password) => {
    return axios.post(API_AUTHORIZE, {
      login: login,
      password: password
    }).then(response => response.data);
  };

  /**
   * Resolves the specified OAuth2 access token.
   *
   * @param {string} oAuth2AccessToken - The OAuth2 access token to resolve
   * @return {Promise.<Object>} - The promise for the resolved OAuth2 access token data
   * @since 0.8.0
   */
  static resolveOAuth2AccessToken = (oAuth2AccessToken) => {
    return axios.get(OAUTH_CHECK_TOKEN, {
      params: {
        token: oAuth2AccessToken
      }
    }).then(response => response.data);
  };

  /**
   * Validates if the local storage contains a valid OAuth2 access token.
   *
   * @since 0.8.0
   */
  static validateLocalStorageOAuth2AccessToken = () => {
    return AuthService.resolveOAuth2AccessToken(localStorage.getItem("access_token"));
  };
}

/**
 * Opens a notification with the supplied message and description
 *
 * @param {string} message - The message of the notification
 * @param {string} description - The description of the notification
 * @return {object} - The redirect to the login page
 * @since 0.13.0
 */
const openNotification = (message, description) => {
  const key = `open${Date.now()}`;
  notification.open({
    message: message,
    description: description,
    key
  });
};

/**
 * Redirects the user to the login page
 *
 * @return {object} - The redirect to the login page
 * @since 0.13.0
 */
const redirectToLogin = (currentPathname) => {
  return (
    <Redirect to={{
      pathname: ROUTE_SIGNOUT,
      state: {forward: currentPathname}
    }}/>
  );
};

/**
 * Redirects the logged out user to the login page with an error notification
 *
 * @return {object} - The redirect to the login page
 * @since 0.13.0
 */
export const redirectUnloggedToLogin = (currentPathname) => {
  openNotification(ERROR_NOT_LOGGED_IN_TITLE, ERROR_NOT_LOGGED_IN);
  return redirectToLogin(currentPathname);
};

/**
 * Redirects the unauthorized user to the login page with an error notification
 *
 * @return {object} - The redirect to the login page
 * @since 0.8.0
 */
export const redirectUnauthorizedToLogin = (currentPathname) => {
  openNotification(ERROR_NOT_AUTHORIZED_TITLE, ERROR_NOT_AUTHORIZED);
  return redirectToLogin(currentPathname);
};

export default AuthService;

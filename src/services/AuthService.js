import axios from "axios";
import {API_AUTHORIZE, OAUTH_CHECK_TOKEN} from "../services/apiRequestMappings";

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

export default AuthService;

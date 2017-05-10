import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'
import url from "url";
import querystring from "querystring";

class AuthService extends Component {
  constructor() {
    super();
  }

  login(username, password) {
    let params = querystring.stringify({
      response_type: "token",
      client_id: "communikey",
      scope: "read",
      redirect_uri: constants.API_OAUTH_SUCCESS_REDIRECT_URI
    });
    let oauth = url.parse(constants.API_OAUTH_AUTHORIZE + "?" + params, true);
    oauth.auth = username + ":" + password;

    axios.post(constants.API_VALIDATE_USER, {
        login:      username,
        password:   password
      })
    .then(function (response) {
      window.location = url.format(oauth);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  logout() {
      localStorage.clear();
  }
}

export var authService = new AuthService()

export default AuthService;

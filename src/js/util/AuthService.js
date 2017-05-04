import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

class AuthService extends Component {
  constructor() {
    super();
  }

  login(username, password) {
    var params = "?response_type=token&client_id=communikey&scope=read&redirect_uri=" + constants.API_OAUTH_SUCCESS_REDIRECT_URI;
    var oauth = constants.PROTOCOL + username + ":" + password + '@' + constants.API_OAUTH_AUTHORIZE + params;

    axios.post(constants.API_VALIDATE_USER, {
        login:      username,
        password:   password
      })
    .then(function (response) {
      window.location = oauth;
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

import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

const loggedIn = false;
const isAdmin = false;
const token = "";

class AuthService extends Component {
  constructor() {
    super();
    this.token = localStorage.getItem("access_token");
  }

  isLoggedIn() {
    return loggedIn;
  }

  setLoggedIn(state) {
    this.loggedIn = state;
  }

  isAdmin() {
    return isAdmin;
  }

  setToken(token) {
    this.token = token;
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
      this.loggedIn = false;
  }
}

export default AuthService

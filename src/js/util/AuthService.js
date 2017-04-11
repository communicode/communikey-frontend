import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

const loggedIn = false;
const isAdmin = false;
const token = "";

const requireAdminAuth = (nextState, replace) => {
  if (!isAdmin) {
    replace({
              pathname: '/login',
              state: { nextPathname: nextState.location.pathname }
            })
  }
}

const requireAuth = (nextState, replace) => {
  // if (!loggedIn) {
    replace({
              pathname: '/login',
              state: { nextPathname: nextState.location.pathname }
            })
  // }
}

class AuthService extends Component {
  constructor() {
    super();
    this.token = localStorage.getItem("access_token");
  }

  setLoggedIn(state) {
    this.loggedIn = state;
  }

  setToken(token) {
    this.token = token;
  }

  login(username, password) {
    var params = "?response_type=token&client_id=communikey&scope=read&redirect_uri=" + constants.API_OAUTH_SUCCESS_REDIRECT_URI;
    var oauth = constants.PROTOCOL + username + ":" + password + '@' + constants.API_OAUTH_AUTHORIZE + params;
    window.location = oauth;
  }

  logout() {
      localStorage.clear();
      this.loggedIn = false;
  }
}

export default AuthService

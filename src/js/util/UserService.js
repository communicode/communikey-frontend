import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

class UserService extends Component {
  constructor() {
    super();
  }

  addUser(email) {
    axios.post(constants.API_USERS_POST_ONE, {
      email: email,
      //TODO: replace placeholders
      password: "testPassword",
      firstName: "newUser",
      lastName: "Unknown"
    }, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    })
    .then(function (response) {
      console.log(response);
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }
}

export var userService = new UserService()

export default UserService;

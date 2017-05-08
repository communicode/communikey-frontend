import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

class UserService extends Component {
  constructor() {
    super();
  }

  addUser(firstName, lastName, email, password) {
    axios.post(constants.API_USERS_POST_ONE, {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
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

  editUser(email, firstname, lastname, activated, login) {
    console.log("email " + email);
    console.log("firstname " + firstname);
    console.log("lastname " + lastname);
    console.log("activated " + activated);
    console.log("login " + login)
    axios.put(constants.API_USERS_PUT_ONE + "/" + login, {
      email: email,
      firstName: firstname,
      lastName: lastname
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

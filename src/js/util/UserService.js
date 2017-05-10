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

  editUser(email, firstname, lastname, login) {
    axios.put(constants.API_USERS_PUT_ONE + login, {
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

  deleteUser(login) {
    axios.delete(constants.API_USERS_DELETE_ONE + login, {
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

  activateUser(activationKey) {
    axios.get(constants.API_USERS_GET_ACTIVATION, {
      params: {
        access_token: localStorage.getItem('access_token'),
        activation_key: activationKey
      }
    })
      .then(function (response) {
        console.log(response);
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  deactivateUser(login) {
    axios.get(constants.API_USERS_GET_DEACTIVATION, {
      params: {
        access_token: localStorage.getItem('access_token'),
        login: login
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

export let userService = new UserService();
export default UserService;

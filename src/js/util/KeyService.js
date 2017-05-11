import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

/**
 * @author mskyschally@communicode.de
 */
class KeyService extends Component {
  constructor() {
    super();
  }

  addKey(name, password) {
    axios.post(constants.API_KEYS_POST_ONE, {
      name: name,
      password: password
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

export let keyService = new KeyService();
export default KeyService;

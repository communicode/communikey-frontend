import { autorun, observable } from "mobx"
import axios from 'axios'
import * as constants from '../util/Constants'

class Authority {
  @observable name
  createdBy
  createdDate
  @observable lastModifiedBy
  @observable LastModifiedDate

  constructor() {
    name = null
    createdBy = null
    createdDate = null
    lastModifiedBy = null
    LastModifiedDate = null
  }
}

class AuthorityStore {
  @observable authorities = [];

  addAuthority(authority) {

  }

  constructor() {
    this.fetchAuthorities = this.fetchAuthorities.bind(this);
    this.fetchAuthorities();
  }

  fetchAuthorities() {
    axios.get(constants.API_AUTHORITIES_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    })
    .then(function (response) {
      this.authorities = response.data;
      for(var authority in response.data) {
        console.log(authority.name);
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }
}

export var authorityStore = new AuthorityStore()

export default AuthorityStore

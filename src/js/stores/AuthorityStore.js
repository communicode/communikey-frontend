import { autorun, observable } from "mobx"
import axios from 'axios'
import * as constants from '../util/Constants'

class AuthorityStore {
  @observable authorities = [];

  addAuthority(authority) {
    this.authorities.push(authority);
  }

  fetchAuthorities() {
    axios.get(constants.API_AUTHORITIES_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
      response.data.map(authority => this.addAuthority(authority));
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export var authorityStore = new AuthorityStore()

export default AuthorityStore;

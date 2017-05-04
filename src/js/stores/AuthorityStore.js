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
    this.name = null
    this.createdBy = null
    this.createdDate = null
    this.lastModifiedBy = null
    this.LastModifiedDate = null
  }
}

class AuthorityStore {
  @observable authorities = [];

  addAuthority(authority) {
    this.authorities.push(authority);
  }

  constructor() {
  }

  fetchAuthorities() {
    axios.get(constants.API_AUTHORITIES_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
      for(let authority of response.data) {
        let newAuthority = new Authority()
        newAuthority.name = authority.name;
        newAuthority.createdBy = authority.createdBy;
        newAuthority.createdDate = authority.createdDate;
        newAuthority.lastModifiedBy = authority.lastModifiedBy;
        newAuthority.lastModifiedDate = authority.LastModifiedDate;
        this.addAuthority(newAuthority);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export var authorityStore = new AuthorityStore()

export default AuthorityStore;

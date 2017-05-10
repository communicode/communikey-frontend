import { autorun, observable } from "mobx"
import axios from 'axios'
import * as constants from '../util/Constants'

class User {
  id
  @observable login
  @observable email
  @observable firstName
  @observable lastName
  @observable activated
  @observable activationKey
  @observable resetKey
  @observable resetDate
  @observable authorities
  createdBy
  createdDate
  @observable lastModifiedBy
  @observable LastModifiedDate
  @observable groups
  @observable keys
  @observable keyCategories
  @observable responsibleKeyCategories

  constructor() {
    this.id = null;
    this.login = null;
    this.email = null;
    this.firstName = null;
    this.lastName = null;
    this.activated = null;
    this.activationKey = null;
    this.resetKey = null;
    this.resetDate = null;
    this.authorities = null;
    this.createdBy = null;
    this.createdDate = null;
    this.lastModifiedBy = null;
    this.LastModifiedDate = null;
    this.groups = null;
    this.keys = null;
    this.keyCategories = null;
    this.responsibleKeyCategories = null;
  }
}

class UserStore {
  @observable users = [];

  addUser(user) {
    this.groups.push(user);
  }

  fetchUsers() {
    axios.get(constants.API_USERS_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
        this.users = response.data;
      }).catch(function (error) {
      console.log(error);
    });
  }
}

export let userStore = new UserStore()

export default UserStore;

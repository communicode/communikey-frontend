import {observable} from "mobx";
import axios from 'axios'
import * as constants from '../util/Constants'

class UserStore {
  @observable users = [];

  constructor() {
    this.fetchUsers();
  }

  addUser(user) {
    this.users.push(user);
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

import { autorun, observable } from "mobx"
import axios from 'axios'
import * as constants from '../util/Constants'

class GroupStore {
  @observable groups = [];

  constructor() {
    this.fetchGroups();
  }

  addGroup(group) {
    this.groups.push(group);
  }

  fetchGroups() {
    axios.get(constants.API_GROUPS_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
      response.data.map(group => this.addGroup(group));
    }).catch(function (error) {
        //TODO: implement error-handling
        console.log(error);
    });
  }
}

export let groupStore = new GroupStore();

export default GroupStore;

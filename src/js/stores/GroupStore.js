import { autorun, observable } from "mobx"
import axios from 'axios'
import * as constants from '../util/Constants'

class Group {
  id
  @observable name
  @observable users
  @observable categories
  createdBy
  createdDate
  @observable lastModifiedBy
  @observable LastModifiedDate

  constructor() {
    id = null
    name = null
    users = null
    categories = null
    createdBy = null
    createdDate = null
    lastModifiedBy = null
    LastModifiedDate = null
  }
}

class GroupStore {
  @observable groups = [];

  addGroup(group) {

  }

  constructor() {
    this.fetchGroups = this.fetchGroups.bind(this);
    this.fetchGroups();
  }

  fetchGroups() {
    axios.get(constants.API_GROUPS_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    })
    .then(function (response) {
      this.groups = response.data;
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }
}

export var groupStore = new GroupStore()

export default GroupStore

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
    this.id = null
    this.name = null
    this.users = null
    this.categories = null
    this.createdBy = null
    this.createdDate = null
    this.lastModifiedBy = null
    this.LastModifiedDate = null
  }
}

class GroupStore {
  @observable groups = [];

  addGroup(group) {
    this.groups.push(group);
  }

  constructor() {
    this.fetchGroups = this.fetchGroups.bind(this);
  }

  fetchGroups() {
    axios.get(constants.API_GROUPS_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    })
    .then(function (response) {
      for(let group of response.data) {
        let newGroup = new Group()
        newGroup.id = group.id;
        newGroup.name = group.name;
        newGroup.users = group.users;
        newGroup.categories = group.categories;
        newGroup.createdBy = group.createdBy;
        newGroup.createdDate = group.createdDate;
        newGroup.lastModifiedBy = group.lastModifiedBy;
        newGroup.LastModifiedDate = group.LastModifiedDate;
        this.addGroup(newGroup);
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }
}

export var groupStore = new GroupStore()

export default GroupStore

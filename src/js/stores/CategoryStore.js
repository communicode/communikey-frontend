import { autorun, observable } from "mobx"
import axios from 'axios'
import * as constants from '../util/Constants'

class Category {
  id
  @observable name
  @observable keys
  @observable parent
  @observable children
  @observable creator
  createdBy
  createdDate
  @observable lastModifiedBy
  @observable LastModifiedDate
  @observable groups
  @observable responsible

  constructor() {
    id = null
    name = null
    keys = null
    parent = null
    children = null
    creator = null
    createdBy = null
    createdDate = null
    lastModifiedBy = null
    LastModifiedDate = null
    groups = null
    responsible = null
  }
}

class CategoryStore {
  @observable categories = [];

  addCategory(category) {

  }

  constructor() {
    this.fetchCategories = this.fetchCategories.bind(this);
    this.fetchCategories();
  }

  fetchCategories() {
    axios.get(constants.API_CATEGORIES_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    })
    .then(function (response) {
      this.categories = response.data;
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }
}

export var categoryStore = new CategoryStore()

export default CategoryStore

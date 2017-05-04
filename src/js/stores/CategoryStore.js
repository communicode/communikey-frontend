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
  @observable lastModifiedDate
  @observable groups
  @observable responsible

  constructor() {
    this.id = null
    this.name = null
    this.keys = null
    this.parent = null
    this.children = null
    this.creator = null
    this.createdBy = null
    this.createdDate = null
    this.lastModifiedBy = null
    this.lastModifiedDate = null
    this.groups = null
    this.responsible = null
  }
}

class CategoryStore {
  @observable categories = [];

  addCategory(category) {
    this.categories.push(category);
  }

  constructor() {
  }

  fetchCategories() {
    axios.get(constants.API_CATEGORIES_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
      for(let category of response.data) {
        let newCategory = new Category();
        newCategory.id = category.id;
        newCategory.name = category.name;
        newCategory.keys = category.keys;
        newCategory.parent = category.parent;
        newCategory.children = category.children;
        newCategory.creator = category.creator;
        newCategory.createdBy = category.createdBy;
        newCategory.createdDate = category.createdDate;
        newCategory.lastModifiedBy = category.lastModifiedBy;
        newCategory.lastModifiedDate = category.LastModifiedDate;
        newCategory.groups = category.groups;
        newCategory.responsible = category.responsible;
        this.addCategory(newCategory);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export let categoryStore = new CategoryStore()

export default CategoryStore;

import {observable} from "mobx";
import axios from 'axios'
import * as constants from '../util/Constants'

class CategoryStore {
  @observable categories = [];

  constructor() {
    this.fetchCategories();
  }

  addCategory(category) {
    this.categories.push(category);
  }

  fetchCategories() {
    axios.get(constants.API_CATEGORIES_GET_ALL, {
      params: {
         access_token: localStorage.getItem('access_token')
      }
    }).then(response => {
      response.data.map(category => this.addCategory(category));
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export let categoryStore = new CategoryStore()

export default CategoryStore;

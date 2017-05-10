import React, { Component } from 'react'
import axios from 'axios'
import * as constants from './Constants'

class CategoryService extends Component {
  constructor() {
    super();
  }

  createCategory(name) {
    axios.post(constants.API_CATEGORIES_POST_ONE, {
      name: name
    }, {
      params: {
        access_token: localStorage.getItem('access_token')
      }
    })
      .then(function (response) {
        console.log(response);
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  addChild(parentID, childID) {
    axios.get(constants.API_CATEGORIES_ADD_CHILD + parentID + constants.API_CHILDREN, {
      params: {
        access_token: localStorage.getItem('access_token'),
        childKeyCategoryId: childID
      }
    })
      .then(function (response) {
        console.log(response);
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteCategory(id) {
    axios.delete(constants.API_CATEGORIES_DELETE_ONE + id, {
      params: {
        access_token: localStorage.getItem('access_token')
      }
    })
      .then(function (response) {
        console.log(response);
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }
}

export let categoryService = new CategoryService();
export default CategoryService;

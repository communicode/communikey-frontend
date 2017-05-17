import axios from "axios";
import {observable} from "mobx";
import {
  API_CATEGORIES,
  API_CATEGORIES_ADD_CHILD,
  API_CATEGORIES_ADD_KEY,
  API_CATEGORIES_DELETE_ONE,
  API_CATEGORIES_GET_ALL,
  API_CATEGORIES_POST_ONE,
  API_CATEGORIES_PUT_RESPONSIBLE,
  API_CATEGORY_RESPONSIBLE,
  API_CHILDREN
} from "../util/Constants";

/**
 * A observable store for {@code category} entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class CategoryStore {
  @observable categories = [];

  /**
   * Adds a child category to the parent category with the specified ID.
   *
   * @param {number} parentId - The ID of the parent category to add the child category to
   * @param {number} childId - The ID of the child category to be added to the parent category
   */
  addChild(parentId, childId) {
    axios.get(API_CATEGORIES_ADD_CHILD + parentId + API_CHILDREN, {
      params: {
        access_token: localStorage.getItem("access_token"),
        childKeyCategoryId: childId
      }
    }).then(response => {
      if (response.status === 200) {
        this.categories[this.categories.findIndex(category => category.id === response.data.id)] = response.data;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Adds a key to the category with the specified ID.
   *
   * @param {number} categoryId - The ID of the category to add the key to
   * @param {number} keyId - The ID of the key to be added to the category
   */
  addKey(categoryId, keyId) {
    axios.get(API_CATEGORIES_ADD_KEY + categoryId + "/keys", {
      params: {
        access_token: localStorage.getItem("access_token"),
        keyId: keyId
      }
    }).then(response => {
      this.categories[this.categories.findIndex(category => category.id === response.data.id)] = response.data;
      }).catch(error => {
        console.log(error);
      });
  }

  /**
   * Creates a new category with the specified name.
   *
   * @param {string} name - The name of the category to create
   */
  create(name) {
    axios.post(API_CATEGORIES_POST_ONE, {
      name: name,
    }, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 201) {
        this.categories.push(response.data);
        console.log("CREATED CATEGORY", response.data)
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Deletes the category with the specified ID.
   *
   * @param {number} categoryId - The ID of the category to delete
   */
  deleteOne(categoryId) {
    axios.delete(API_CATEGORIES_DELETE_ONE + categoryId, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 204) {
        this.categories.splice(this.categories.findIndex(category => category.id === categoryId), 1);
        console.log("DELETED CATEGORY")
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Fetches all categories.
   *
   * @returns {ObservableArray} The fetched categories as observable array
   */
  fetchCategories() {
    axios.get(API_CATEGORIES_GET_ALL, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 200) {
        this.categories = response.data;
      }
    }).catch(error => {
      console.log(error);
    });
  }
}

export let categoryStore = new CategoryStore();
export default CategoryStore;

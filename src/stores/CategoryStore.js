import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {CATEGORIES, CATEGORY, CATEGORY_CHILDREN, CATEGORY_KEYS, CATEGORY_RESPONSIBLE} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for {@linkcode category} entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class CategoryStore {
  @observable categories;

  constructor() {
    this.categories = [];
  }

  /**
   * Adds a child category to the parent category with the specified ID.
   *
   * @param {number} parentId - The ID of the parent category to add the child category to
   * @param {number} childId - The ID of the child category to be added to the parent category
   * @returns {Promise} - A promise
   */
  @action
  addChild = (parentId, childId) => {
    return apiService.get(CATEGORY_CHILDREN({categoryId: parentId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        childKeyCategoryId: childId
      }
    })
      .then(action(() => this.getAll()));
  };

  /**
   * Adds a key to the category with the specified ID.
   *
   * @param {number} categoryId - The ID of the category to add the key to
   * @param {number} keyId - The ID of the key to be added to the category
   * @returns {Promise} - A promise
   */
  @action
  addKey = (categoryId, keyId) => {
    return apiService.get(CATEGORY_KEYS({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        keyId: keyId
      }
    })
      .then(action(() => this.getAll()));
  };

  /**
   * Creates a new category with the specified name.
   *
   * @param {string} name - The name of the category to create
   * @returns {Promise} - A promise
   */
  @action
  create = (name) => {
    return apiService.post(CATEGORIES, {name: name}, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.categories.push(response.data)));
  };

  /**
   * Deletes the category with the specified ID.
   *
   * @param {number} categoryId - The ID of the category to delete
   * @returns {Promise} - A promise
   */
  @action
  delete = (categoryId) => {
    return apiService.delete(CATEGORY({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(() => this.getAll()));
  };

  /**
   * Gets all categories as flattened array.
   *
   * @returns {Array} The categories as flattened array
   * @since 0.8.0
   */
  getAllFlattened = (data) => {
    let flatArray = [];
    _.each(data, category => {
      flatArray.push(category);
      category.children && (flatArray = _.union(flatArray, this.getAllFlattened(category.children)));
    });
    return flatArray;
  };

  /**
   * Finds the category with the specified ID.
   *
   * @param {number} categoryId - The ID of the category to find
   * @returns {object} - The category if found
   * @since 0.8.0
   */
  findById = (categoryId) => this.getAllFlattened(this.categories).find(category => category.id === categoryId);

  /**
   * Gets the category with the specified ID.
   *
   * @param {string} categoryId - The ID of the category to get
   * @returns {Promise} - The category as a promise
   */
  @action
  get = (categoryId) => {
    return apiService.get(CATEGORY({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => response.data));
  };

  /**
   * Fetches all categories.
   *
   * @returns {ObservableArray} The fetched categories as observable array
   * @returns {Promise} - A promise
   */
  @action
  getAll = () => {
    return apiService.get(CATEGORIES, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.categories = response.data));
  };

  /**
   * Updates a category.
   *
   * @param {object} category - The updated category
   * @returns {Promise} - A promise
   * @since 0.6.0
   */
  @action
  update = (category) => {
    return apiService.put(CATEGORY({categoryId: category.id}), {
      name: category.name
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(() => this.getAll()));
  };

  /**
   * Updates the responsible user of the category with the specified ID.
   *
   * @param {number} categoryId - The ID of the category to update
   * @param {string} userLogin - The login of the user to set as responsible
   * @returns {Promise} - A promise
   * @since 0.6.0
   */
  @action
  updateResponsible = (categoryId, userLogin) => {
    return apiService.put(CATEGORY_RESPONSIBLE({categoryId: categoryId}), {
      userLogin: userLogin
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(() => this.getAll()));
  };
}

export let categoryStore = new CategoryStore();

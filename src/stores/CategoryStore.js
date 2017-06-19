import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {CATEGORIES, CATEGORY, CATEGORY_CHILDREN, CATEGORY_GROUPS, CATEGORY_KEYS, CATEGORY_RESPONSIBLE} from "./../services/apiRequestMappings";
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
   * This is a API- and store synchronization action!
   *
   * @param {number} parentId - The ID of the parent category to add the child category to
   * @param {number} childId - The ID of the child category to be added to the parent category
   * @returns {Promise} - A promise
   */
  @action("CategoryStore_addChild")
  addChild = (parentId, childId) => {
    return apiService.get(CATEGORY_CHILDREN({categoryId: parentId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        childKeyCategoryId: childId
      }
    })
      .then(action("CategoryStore_addChild_synchronization", () => this.fetchAll()));
  };

  /**
   * Adds a key to the category with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to add the key to
   * @param {number} keyId - The ID of the key to be added to the category
   * @returns {Promise} - A promise
   */
  @action("CategoryStore_addKey")
  addKey = (categoryId, keyId) => {
    return apiService.get(CATEGORY_KEYS({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        keyId: keyId
      }
    })
      .then(action("CategoryStore_addKey_synchronization", () => this.fetchAll()));
  };

  /**
   * Creates a new category with the specified name.
   * This is a API- and store synchronization action!
   *
   * @param {string} name - The name of the category to create
   * @returns {Promise} - A promise
   */
  @action("CategoryStore_create")
  create = (name) => {
    return apiService.post(CATEGORIES, {name: name}, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_create_synchronization", response => this.categories.push(response.data)));
  };

  /**
   * Deletes the category with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to delete
   * @returns {Promise} - A promise
   */
  @action("CategoryStore_deleteOne")
  deleteOne = (categoryId) => {
    return apiService.delete(CATEGORY({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_deleteOne_synchronization", () => this.fetchAll()));
  };

  /**
   * Fetches all categories.
   * This is a API- and store synchronization action!
   *
   * @returns {ObservableArray} The fetched categories as observable array
   * @returns {Promise} - The categories as a promise
   * @since 0.9.0
   */
  @action("CategoryStore_fetchAll")
  fetchAll = () => {
    return apiService.get(CATEGORIES, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_fetchAll_synchronization", response => this.categories = response.data));
  };

  /**
   * Fetches the category with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to fetch
   * @returns {Promise} - The category as a promise
   * @since 0.9.0
   */
  @action("CategoryStore_fetchOne")
  fetchOne = (categoryId) => {
    return apiService.get(CATEGORY({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_fetchOne_synchronization", response =>
        this.categories.splice(_.findIndex(this.categories, category => category.id === response.data.id), 1, response.data)));
  };

  /**
   * Updates a category.
   * This is a API- and store synchronization action!
   *
   * @param {object} category - The updated category
   * @returns {Promise} - A promise
   * @since 0.6.0
   */
  @action("CategoryStore_update")
  update = (category) => {
    return apiService.put(CATEGORY({categoryId: category.id}), {
      name: category.name
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_update_synchronization", () => this.fetchAll()));
  };

  /**
   * Updates the responsible user of the category with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to update
   * @param {string} userLogin - The login of the user to set as responsible
   * @returns {Promise} - A promise
   * @since 0.6.0
   */
  @action("CategoryStore_updateResponsible")
  updateResponsible = (categoryId, userLogin) => {
    return apiService.put(CATEGORY_RESPONSIBLE({categoryId: categoryId}), {
      userLogin: userLogin
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_updateResponsible_synchronization", () => this.fetchAll()));
  };

  /**
   * Finds the category with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} categoryId - The ID of the category to find
   * @returns {object} - The category if found
   * @since 0.8.0
   */
  _findById = (categoryId) => this.categories.find(category => category.id === categoryId);

  /**
   * Removes the user group from a category specified by the ID.
   * This is a pure store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to remove the user group from
   * @param {number} userGroupId - The ID of the user group to remove
   * @since 0.9.0
   */
  @action("CategoryStore__removeUserGroup")
  _removeUserGroup = (categoryId, userGroupId) => _.remove(this._findById(categoryId).groups, id => id === userGroupId);
}

export default CategoryStore;

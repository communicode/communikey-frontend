import {action, observable} from "mobx";
import apiService from "../services/ApiService";
import {keyStore, userGroupStore, userStore} from "./../Communikey";
import {CATEGORIES, CATEGORY, CATEGORY_CHILDREN, CATEGORY_GROUPS, CATEGORY_KEYS} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for category entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class CategoryStore {
  @observable categories;

  /**
   * Constructs the category store.
   */
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
      .then(action("CategoryStore_addChild_synchronization", response => this.fetchAll().then(() => response.data)));
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
      .then(action("CategoryStore_addKey_synchronization", response => {
        this._updateEntity(categoryId, response.data);
        return keyStore.fetchOne(keyId).then(() => response.data);
      }));
  };

  /**
   * Adds a user group to the category with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to add the user group to
   * @param {number} userGroupId - The ID of the user group to be added to the category
   * @returns {Promise} - The updated category as a promise
   * @since 0.10.0
   */
  @action("CategoryStore_addUserGroup")
  addUserGroup = (categoryId, userGroupId) => {
    return apiService.get(CATEGORY_GROUPS({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        userGroupId: userGroupId
      }
    })
      .then(action("CategoryStore_addUserGroup_synchronization", response => {
        this._updateEntity(categoryId, response.data);
        return userGroupStore.fetchOne(userGroupId).then(() => response.data);
      }));
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
      .then(action("CategoryStore_create_synchronization", response => {
        this.categories.push(response.data);
        return response.data;
      }));
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
      .then(action("CategoryStore_deleteOne_fetch", () => {
        return apiService.all([
          userStore.fetchAll(),
          keyStore.fetchAll(),
          userGroupStore.fetchAll()
        ])
          .then(action("CategoryStore_deleteOne_synchronization", () => this.fetchAll()));
      }));
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
      .then(action("CategoryStore_fetchOne_synchronization", response => {
        this._updateEntity(categoryId, response.data);
        return response.data;
      }));
  };

  /**
   * Removes a user group from the category with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to remove the user group from
   * @param {number} userGroupId - The ID of the user group to be removed from the category
   * @returns {Promise} - The updated category as a promise
   * @since 0.10.0
   */
  @action("CategoryStore_removeUserGroup")
  removeUserGroup = (categoryId, userGroupId) => {
    return apiService.delete(CATEGORY_GROUPS({categoryId: categoryId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        userGroupId: userGroupId
      }
    })
      .then(action("CategoryStore_removeUserGroup_synchronization", response => {
        this._updateEntity(categoryId, response.data);
        return userGroupStore.fetchOne(userGroupId).then(() => response.data);
      }));
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
      .then(action("CategoryStore_update_synchronization", () => this.fetchOne(category.id)));
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
   * Searches for the categoryId in the store
   * This is a pure store operation action!
   *
   * @param {number} categoryId - The ID of the category to find
   * @returns {Boolean} The statement if the store contains the key
   * @since 0.15.0
   */
  _contains = (categoryId) => {
    return this.categories.findIndex(category => category.id === categoryId) !== -1;
  };

  /**
   * Pushes a new category to the store.
   * This is a pure store operation action!
   *
   * @param {object} category - The category object
   * @since 0.15.0
   */
  @action("CategoryStore_pushEntity")
  _push = (category) => {
    return this.categories.push(category);
  };

  /**
   * Updates the category entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} categoryId - The ID of the category entity to update
   * @param {object} updatedEntity - The updated category entity
   * @since 0.9.0
   */
  @action("CategoryStore_updateEntity")
  _updateEntity = (categoryId, updatedEntity) => {
    console.log("Updating category");
    let index = this.categories.findIndex(category => category.id === categoryId);
    index !== -1 && this.categories.splice(index, 1, updatedEntity);
  };
}

export default CategoryStore;

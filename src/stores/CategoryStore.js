/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {keyStore,
  userGroupStore,
  userStore,
  liveEntityUpdateService
} from "./../Communikey";
import {CATEGORIES, CATEGORY, CATEGORY_GROUPS, CATEGORY_KEYS, CATEGORY_MOVE} from "./../services/apiRequestMappings";
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
   * @param {string=} parentId - The hashId of the parent
   * @returns {Promise} - A promise
   */
  @action("CategoryStore_create")
  create = (name, parentId) => {
    return apiService.post(CATEGORIES, {
      name: name,
      parent: parentId && parentId
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_create_synchronization", response => {
        !liveEntityUpdateService.userSubscriptionsInitialized && this.categories.push(response.data);
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
          .then(action("CategoryStore_deleteOne_synchronization", () =>
            !liveEntityUpdateService.userSubscriptionsInitialized && this.fetchAll()));
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
   * Moves a category.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The categoryId to move
   * @param {number} parentId - The target parentId which the categoryId should be moved to
   * @returns {Promise} - A promise
   * @since 0.17.0
   */
  @action("CategoryStore_move")
  move = (parentId, categoryId) => {
    return apiService.post(CATEGORY_MOVE({categoryId: categoryId}), {
      parent: parentId
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("CategoryStore_move_synchronization", () => this.fetchOne(categoryId)));
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
   * Deletes the category with the specified id.
   * This is a pure store synchronization action!
   *
   * @param {number} categoryId - The id of the category to delete
   * @since 0.15.0
   */
  @action("CategoryStore__deleteOneById")
  _deleteOneById = (categoryId) => this.categories.splice(_.findIndex(this.categories, category => category.id === categoryId), 1);

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
    let index = this.categories.findIndex(category => category.id === categoryId);
    index !== -1 && this.categories.splice(index, 1, updatedEntity);
  };
}

export default CategoryStore;

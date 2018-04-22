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
import {
  keyStore,
  categoryStore,
  liveEntityUpdateService
} from "./../Communikey";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";
import {TAG, TAGS} from "../services/apiRequestMappings";

/**
 * A observable store for tag entities.
 *
 * @author dvonderbey@communicode.de
 * @since 0.18.0
 */
class TagStore {
  @observable tags;

  /**
   * Constructs the tag store.
   */
  constructor() {
    this.tags = [];
  }

  /**
   * Creates a new tag with the specified name.
   * This is a API- and store synchronization action!
   *
   * @param {string} name - The name of the tag to create
   * @param {string} color - The color of the tag to create
   * @returns {Promise} - A promise
   */
  @action("TagStore_create")
  create = (name, color) => {
    return apiService.post(TAGS, {
      name: name,
      color: color
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("TagStore_create_synchronization", response => {
        !liveEntityUpdateService.userSubscriptionsInitialized && this.tags.push(response.data);
        return response.data;
      }));
  };

  /**
   * Deletes the tag with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} tagId - The ID of the tag to delete
   * @returns {Promise} - A promise
   */
  @action("TagStore_deleteOne")
  deleteOne = (tagId) => {
    return apiService.delete(TAG({tagId: tagId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("TagStore_deleteOne_fetch", () => {
        return apiService.all([
          keyStore.fetchAll(),
          categoryStore.fetchAll()
        ])
          .then(action("TagStore_deleteOne_synchronization", () =>
            !liveEntityUpdateService.userSubscriptionsInitialized && this.fetchAll()));
      }));
  };

  /**
   * Fetches all tags.
   * This is a API- and store synchronization action!
   *
   * @returns {ObservableArray} The fetched tags as observable array
   * @returns {Promise} - The tags as a promise
   */
  @action("TagStore_fetchAll")
  fetchAll = () => {
    return apiService.get(TAGS, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("TagStore_fetchAll_synchronization", response => this.tags = response.data));
  };

  /**
   * Fetches the tag with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} tagId - The ID of the tag to fetch
   * @returns {Promise} - The tag as a promise
   */
  @action("TagStore_fetchOne")
  fetchOne = (tagId) => {
    return apiService.get(TAG({tagId: tagId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("TagStore_fetchOne_synchronization", response => {
        this._updateEntity(tagId, response.data);
        return response.data;
      }));
  };

  /**
   * Updates a tag.
   * This is a API- and store synchronization action!
   *
   * @param {number} tagId - The ID of the tag to update
   * @param {string} payload - The payload to update the tag with
   * @returns {Promise} - A promise
   */
  @action("TagStore_update")
  update = (tagId, payload) => {
    return apiService.put(TAG({tagId: tagId}), {
      name: payload.name,
      color: payload.color
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("TagStore_update_synchronization", response => {
        this._updateEntity(tagId, response.data);
        return response.data;
      }));
  };

  /**
   * Finds the tag with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} tagId - The ID of the tag to find
   * @returns {object} - The tag if found
   */
  _findById = (tagId) => this.tags.find(tag => tag.id === tagId);

  /**
   * Deletes the tag with the specified id.
   * This is a pure store synchronization action!
   *
   * @param {number} tagId - The id of the tag to delete
   */
  @action("TagStore__deleteOneById")
  _deleteOneById = (tagId) => this.tags.splice(_.findIndex(this.tags, tag => tag.id === tagId), 1);

  /**
   * Searches for the tag id in the store
   * This is a pure store operation action!
   *
   * @param {number} tagId - The ID of the tag to find
   * @returns {Boolean} The statement if the store contains the tag
   */
  _contains = (tagId) => {
    return this.tags.findIndex(tag => tag.id === tagId) !== -1;
  };

  /**
   * Pushes a new tag to the store.
   * This is a pure store operation action!
   *
   * @param {object} tag - The tag object
   */
  @action("TagStore_pushEntity")
  _push = (tag) => {
    return this.tags.push(tag);
  };

  /**
   * Updates the tag entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} tagId - The ID of the tag entity to update
   * @param {object} updatedEntity - The updated tag entity
   */
  @action("TagStore_updateEntity")
  _updateEntity = (tagId, updatedEntity) => {
    let index = this.tags.findIndex(tag => tag.id === tagId);
    index !== -1 && this.tags.splice(index, 1, updatedEntity);
  };
}

export default TagStore;
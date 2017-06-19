import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {KEY, KEYS} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for {@linkcode key} entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class KeyStore {
  @observable keys;

  constructor() {
    this.keys = [];
  }

  /**
   * Creates a new key with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to add the new created key to
   * @param {string} name - The name of the key to create
   * @param {string} login - The login of the key
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   */
  @action("KeyStore_create")
  create = (categoryId, name, login, password) => {
    return apiService.post(KEYS, {
      categoryId: categoryId,
      name: name,
      login: login,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("KeyStore_create_synchronization", response => this.keys.push(response.data)));
  };

  /**
   * Deletes the key with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} keyId - The ID of the key to delete
   * @returns {Promise} - A promise
   */
  @action("KeyStore_deleteOne")
  deleteOne = (keyId) => {
    return apiService.delete(KEY({keyId: keyId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("KeyStore_deleteOne_synchronization", () => this.keys.splice(this.keys.findIndex(key => key.id === keyId), 1)));
  };

  /**
   * Fetches all keys.
   * This is a API- and store synchronization action!
   *
   * @returns {Promise} - The keys as a promise
   * @since 0.9.0
   */
  @action("KeyStore_fetchAll")
  fetchAll = () => {
    return apiService.get(KEYS, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("KeyStore_fetchAll_synchronization", response => this.keys = response.data));
  };

  /**
   * Fetches the key with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} keyId - The ID of the key to fetch
   * @returns {Promise} - The key as a promise
   * @since 0.9.0
   */
  @action("KeyStore_fetchOne")
  fetchOne = (keyId) => {
    return apiService.get(KEY({keyId: keyId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("KeyStore_fetchOne_synchronization", response =>
        this.keys.splice(_.findIndex(this.keys, key => key.id === response.data.id), 1, response.data)));
  };

  /**
   * Updates a new key with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {number} keyId - The ID of the key to update
   * @param {string} name - The name of the key
   * @param {string} login - The login of the key
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   */
  @action("KeyStore_update")
  update = (keyId, name, login, password) => {
    return apiService.put(KEY({keyId: keyId}), {
      name: name,
      login: login,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("KeyStore_update_synchronization", response => this.keys[this.keys.findIndex(key => key.id === response.data.id)] = response.data));
  };

  /**
   * Filters all keys for the specified category ID.
   * This is a pure store operation action!
   *
   * @param {number} categoryId - The ID of category to find all keys of
   * @returns {array} A collection of filtered keys
   * @since 0.9.0
   */
  _filterAllByCategory = (categoryId) => _.filter(this.keys, key => key.category === categoryId);

  /**
   * Finds the key with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} keyId - The ID of the key to find
   * @returns {object} The key if filtered, undefined otherwise
   * @since 0.9.0
   */
  _findOneById = (keyId) => this.keys.find(key =>key.id === keyId);
}

export default KeyStore;

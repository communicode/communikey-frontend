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
   *
   * @param {number} categoryId - The ID of the category to add the new created key to
   * @param {string} name - The name of the key to create
   * @param {string} login - The login of the key
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   */
  @action
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
      .then(action(response => this.keys.push(response.data)));
  };

  /**
   * Deletes the key with the specified ID.
   *
   * @param {number} keyId - The ID of the key to delete
   * @returns {Promise} - A promise
   */
  @action
  delete = (keyId) => {
    return apiService.delete(KEY({keyId: keyId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(() => this.keys.splice(this.keys.findIndex(key => key.id === keyId), 1)));
  };

  /**
   * Filters all keys for the specified category ID.
   *
   * @param {number} categoryId - The ID of category to find all keys of
   * @returns {array} A collection of filtered keys
   * @since 0.9.0
   */
  filterAllByCategory = (categoryId) => _.filter(this.keys, key => key.category === categoryId);

  /**
   * Filters the key for the specified ID.
   *
   * @param {number} keyId - The ID of the key to find
   * @returns {object} The key if filtered, undefined otherwise
   * @since 0.9.0
   */
  filterOneById = (keyId) => this.keys.find(key =>key.id === keyId);

  /**
   * Gets all keys.
   *
   * @returns {Promise} - A promise
   */
  @action
  getAll = () => {
    return apiService.get(KEYS, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.keys = response.data));
  };

  /**
   * Updates a new key with the specified attributes.
   *
   * @param {number} keyId - The ID of the key to update
   * @param {string} name - The name of the key
   * @param {string} login - The login of the key
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   */
  @action
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
      .then(action(response => this.keys[this.keys.findIndex(key => key.id === response.data.id)] = response.data));
  };
}

export let keyStore = new KeyStore();

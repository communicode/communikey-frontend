import {action, observable} from "mobx";

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
   * @param {string} name - The name of the key to create
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   */
  @action
  createKey = (name, password) => {
    return apiService.post(KEYS, {
      name: name,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.keys.push(response.data)))
      .catch(error => console.error(error));
  };

  /**
   * Deletes the key with the specified ID.
   *
   * @param {number} keyId - The ID of the key to delete
   * @returns {Promise} - A promise
   */
  @action
  deleteKey = (keyId) => {
    return apiService.delete(KEY({keyId: keyId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(() => this.keys.splice(this.keys.findIndex(key => key.id === keyId), 1)))
      .catch(error => console.error(error));
  };

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
      .then(action(response => this.keys = response.data))
      .catch(error => console.error(error));
  };

  /**
   * Updates a new key with the specified attributes.
   *
   * @param {number} keyId - The ID of the key to update
   * @param {string} name - The name of the key
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   */
  @action
  updateKey = (keyId, name, password) => {
    return apiService.put(KEY({keyId: keyId}), {
      name: name,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.keys[this.keys.findIndex(key => key.id === response.data.id)] = response.data))
      .catch(error => console.error(error));
  };
}

export let keyStore = new KeyStore();

import axios from 'axios'
import {observable} from "mobx";
import {
  API_KEYS_POST_ONE,
  API_KEYS_PUT_ONE,
  API_KEYS_DELETE_ONE,
  API_KEYS_GET_ALL
} from '../util/Constants'

/**
 * A observable store for {@code key} entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class KeyStore {
  @observable keys = [];

  /**
   * Creates a new key with the specified attributes.
   *
   * @param {string} name - The name of the key to create
   * @param {string} password - The password of the key
   */
  createKey(name, password) {
    axios.post(API_KEYS_POST_ONE, {
      name: name,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 201) {
        this.keys.push(response.data);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Deletes the key with the specified ID.
   *
   * @param {number} keyId - The ID of the key to delete
   */
  deleteKey(keyId) {
    axios.delete(API_KEYS_DELETE_ONE + keyId, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 204) {
        this.keys.splice(this.keys.findIndex(key => key.id === keyId), 1);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Fetches all keys.
   *
   * @returns {ObservableArray} The fetched keys as observable array
   */
  fetchKeys() {
    axios.get(API_KEYS_GET_ALL, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 200) {
        this.keys = response.data;
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Updates a new key with the specified attributes.
   *
   * @param {number} keyId - The ID of the key to update
   * @param {string} name - The name of the key
   * @param {string} password - The password of the key
   */
  updateKey(keyId, name, password) {
    axios.put(API_KEYS_PUT_ONE + keyId, {
      name: name,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 200) {
        this.keys[this.keys.findIndex(key => key.id === response.data.id)] = response.data;
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export let keyStore = new KeyStore();
export default KeyStore;

import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {authStore, categoryStore, userStore, encryptionService} from "./../Communikey";
import {KEY, KEYS, ENCRYPTED_PASSWORD, KEY_SUBSCRIBERS} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for key entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.5.0
 */
class KeyStore {
  @observable keys;

  /**
   * Constructs the key store.
   */
  constructor() {
    this.keys = [];
  }

  /**
   * Creates a new key with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {number} categoryId - The ID of the category to add the new created key to
   * @param {string} name - The name of the key to create
   * @param {string} password - The password of the key
   * @param {string} login - The login of the key
   * @param {string} notes - The notes for the key
   * @returns {Promise} - A promise
   */
  @action("KeyStore_create")
  create = (categoryId, name, password, login, notes) => {
    return encryptionService.encryptForUser(password)
      .then((encryptedPassword) => {
        return apiService.post(KEYS, {
          categoryId: categoryId,
          name: name,
          login: login,
          encryptedPasswords: [
            {
              "login" : authStore.login,
              "encryptedPassword" : encryptedPassword
            }
          ],
          notes: notes
        }, {
          params: {
            access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
          }
        })
          .then(action("KeyStore_create_synchronization", response => {
            this.keys.push(response.data);
            return apiService.all([
              categoryId && categoryStore.fetchOne(categoryId),
              userStore.fetchOneById(response.data.creator)
            ])
              .then(() => {
                this.encryptForSubscribers(response.data, password)
                  .then(() => response.data);
              });
          }));
      });
  };

  /**
   * Creates a new key with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {number} key - The key to
   * @param {string} password - The password of the key
   * @returns {Promise} - A promise
   * @since 0.15.0
   */
  encryptForSubscribers = (key, password) => {
    let encryptedPasswords = [];
    return apiService.get(KEY_SUBSCRIBERS({keyId: key.id}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then((response) => {
        if(!_.isEmpty(response.data)) {
          response.data.forEach(user => {
            encryptedPasswords.push({
              "login": user.user,
              "encryptedPassword": encryptionService.encrypt(password, user.publicKey)
            });
          });

          apiService.put(KEY({keyId: key.id}), {
            login: key.login,
            name: key.name,
            encryptedPasswords: encryptedPasswords,
            notes: key.notes
          }, {
            params: {
              access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
            }
          })
            .then(() => response.data);
        }
      });
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
    const key = this._findOneById(keyId);
    return apiService.delete(KEY({keyId: keyId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("KeyStore_deleteOne_fetch", () => {
        return apiService.all([
          categoryStore.fetchOne(key.category),
          userStore.fetchOneById(key.creator)
        ])
          .then(action("KeyStore_deleteOne_synchronization", () => this._deleteOne(keyId)));
      }));
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
   * Fetches one key and decrypts it
   *
   * @returns {Promise} - The keys as a promise
   * @since 0.15.0
   */
  getPassword = (keyId) => {
    return new Promise((resolve, reject) => {
      apiService.get(ENCRYPTED_PASSWORD({keyId: keyId}), {
        params: {
          access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        }
      })
        .then((response) => {
          return encryptionService.decrypt(response.data.password)
            .then((response) => {
              resolve(response);
            })
            .catch(error => reject(error));
        })
        .catch(() => reject({title: "Key loading failed",
          message: "This key has not yet been encrypted for you. Please try again later."}));
    });
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
      .then(action("KeyStore_fetchOne_synchronization", response => {
        this._updateEntity(keyId, response.data);
        return response.data;
      }));
  };

  /**
   * Updates a new key with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {number} keyId - The ID of the key to update
   * @param {string} name - The name of the key
   * @param {string} password - The password of the key
   * @param {string} login - The login of the key
   * @param {string} notes - The notes of the key
   * @returns {Promise} - A promise
   */
  @action("KeyStore_update")
  update = (keyId, name, password, login, notes) => {
    return encryptionService.encryptForUser(password)
      .then((encryptedPassword) => {
        return apiService.put(KEY({keyId: keyId}), {
          name: name,
          login: login,
          encryptedPasswords: [
            {
              "login" : authStore.login,
              "encryptedPassword" : encryptedPassword
            }
          ],
          notes: notes
        }, {
          params: {
            access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
          }
        })
          .then(action("KeyStore_update_synchronization", response => {
            this.encryptForSubscribers(response.data, password)
              .then(() => response.data);
            this._updateEntity(keyId, response.data);
            return response.data;
          }));
      });
  };

  /**
   * Deletes the key with the specified ID.
   * This is a pure store synchronization action!
   *
   * @param {number} keyId - The ID of the key to delete
   * @since 0.9.0
   */
  @action("KeyStore__deleteOne")
  _deleteOne = (keyId) => this.keys.splice(_.findIndex(this.keys, key => key.id === keyId), 1);

  /**
   * Filters all keys for the specified category ID.
   * This is a pure store operation action!
   *
   * @param {number} categoryId - The ID of the category to find all keys of
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

  /**
   * Searches for the keyId in the store
   * This is a pure store operation action!
   *
   * @param {number} keyId - The ID of the key to find
   * @returns {Boolean} The statement if the store contains the key
   * @since 0.15.0
   */
  _contains = (keyId) => {
    return this.keys.findIndex(key => key.id === keyId) !== null;
  };

  /**
   * Pushes a new key to the store.
   * This is a pure store operation action!
   *
   * @param {object} key - The key object
   * @since 0.15.0
   */
  @action("KeyStore_pushEntity")
  _push = (key) => {
    return this.keys.push(key);
  };

  /**
   * Updates the key entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} keyId - The ID of the key entity to update
   * @param {object} updatedEntity - The updated key entity
   * @since 0.9.0
   */
  @action("KeyStore_updateEntity")
  _updateEntity = (keyId, updatedEntity) => {
    let index = this.keys.findIndex(key => key.id === keyId);
    index >= 0
      ? this.keys.splice(index, 1, updatedEntity)
      : this.keys.push(updatedEntity);
  }
}

export default KeyStore;

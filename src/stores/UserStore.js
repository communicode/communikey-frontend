import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {
  categoryStore,
  keyStore,
  userGroupStore,
  liveEntityUpdateService
} from "./../Communikey";
import {
  USER,
  USER_AUTHORITIES,
  USERS,
  USERS_ACTIVATE,
  USERS_DEACTIVATE,
  USERS_PASSWORD_RESET,
  USERS_REGISTER,
  USERS_PUBLICKEY_RESET
} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for user entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class UserStore {
  @observable users;

  constructor() {
    this.users = [];
  }

  /**
   * Activates a user with the specified activation token.
   * This is a API- and store synchronization action!
   *
   * @param {string} activationToken - The activation token to activate a user with
   * @returns {Promise} - A promise
   */
  @action("UserStore_activate")
  activate = (activationToken) => {
    return apiService.get(USERS_ACTIVATE, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        activation_token: activationToken
      }
    })
      .then(action("UserStore_activate_synchronization", response => {
        this._updateEntity(response.data.id, response.data);
        return response.data;
      }));
  };

  /**
   * Adds a authority to the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {string} login - The login of the user to add the authority to
   * @param {string} authorityName - The name of the authority to be added to the user
   * @returns {Promise} - The updated user as a promise
   * @since 0.11.0
   */
  @action("UserStore_addAuthority")
  addAuthority = (login, authorityName) => {
    return apiService.get(USER_AUTHORITIES({login: login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        authorityName: authorityName
      }
    })
      .then(action("UserStore_addAuthority_synchronization", response => {
        this._updateEntity(response.data.id, response.data);
        return response.data;
      }));
  };

  /**
   * Creates a new user with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {string} firstName - The first name of the user to create
   * @param {string} lastName - The last name of the user to create
   * @param {string} email - The email of the user to create
   * @param {string} password - The password of the user to create
   * @returns {Promise} - A promise
   */
  @action("UserStore_create")
  create = (firstName, lastName, email, password) => {
    return apiService.post(USERS_REGISTER, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserStore_create_synchronization", response => {
        !liveEntityUpdateService.adminSubscriptionsInitialized && this.users.push(response.data);
        return response.data;
      }));
  };

  /**
   * Deactivates the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {string} login - The login of the user to deactivate
   * @returns {Promise} - A promise
   */
  @action("UserStore_deactivate")
  deactivate = (login) => {
    return apiService.get(USERS_DEACTIVATE, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        login: login
      }
    })
      .then(action("UserStore_deactivate_synchronization", response => {
        this._updateEntity(response.data.id, response.data);
        return response.data;
      }));
  };

  /**
   * Deletes the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {string} login - The login of the user to delete
   * @returns {Promise} - A promise
   */
  @action("UserStore_deleteOne")
  deleteOne = (login) => {
    return apiService.delete(USER({login: login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserStore_deleteOne_fetch", () => {
        return apiService.all([
          categoryStore.fetchAll(),
          keyStore.fetchAll(),
          userGroupStore.fetchAll()
        ])
          .then(action("UserStore_deleteOne_synchronization", () =>
            !liveEntityUpdateService.adminSubscriptionsInitialized && this._deleteOneByLogin(login)));
      }));
  };

  /**
   * Fetches all users.
   * This is a API- and store synchronization action!
   *
   * @returns {Promise} - The users as a promise
   * @since 0.9.0
   */
  @action("UserStore_fetchAll")
  fetchAll = () => {
    return apiService.get(USERS, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserStore_fetchAll_synchronization", response => this.users = response.data));
  };

  /**
   * Fetches the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {string} login - The login of the user to fetch
   * @returns {Promise} - The user as a promise
   * @since 0.9.0
   */
  @action("UserStore_fetchOne")
  fetchOne = (login) => {
    return apiService.get(USER({login: login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserStore_fetchOne_synchronization", response => {
        this._updateEntity(response.data.id, response.data);
        return response.data;
      }));
  };

  /**
   * Fetches the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {number} userId - The ID of the user to fetch
   * @returns {Promise} - The user as a promise
   * @since 0.9.0
   */
  @action("UserStore_fetchOneById")
  fetchOneById = (userId) => {
    const user = this._findOneById(userId);
    return apiService.get(USER({login: user.login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserStore_fetchOneById_synchronization", response => {
        this._updateEntity(user.id, response.data);
        return response.data;
      }));
  };

  /**
   * Gets a password reset token for the user with the specified email.
   * This is a API- and store synchronization action!
   *
   * @param {string} email - The email of the user to get a password reset token for
   * @param {string} login - The login of the user to get a password reset token for
   * @returns {Promise} - A promise
   * @since 0.8.0
   */
  @action("UserStore_getPasswordResetToken")
  getPasswordResetToken = (email, login) => {
    return apiService.get(USERS_PASSWORD_RESET, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        email: email
      }
    })
      .then(response => {
        this.fetchOne(login);
        return response.data;
      });
  };

  /**
   * Removes a authority from the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {string} login - The login of the user to remove the authority from
   * @param {string} authorityName - The name of the authority to be removed from the user
   * @returns {Promise} - The updated user as a promise
   * @since 0.11.0
   */
  @action("UserStore_removeAuthority")
  removeAuthority = (login, authorityName) => {
    return apiService.delete(USER_AUTHORITIES({login: login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        authorityName: authorityName
      }
    })
      .then(action("UserStore_removeAuthority_synchronization", response => {
        this._updateEntity(response.data.id, response.data);
        return response.data;
      }));
  };

  /**
   * Resets a user password with the specified reset token and new password.
   * This is a API- and store synchronization action!
   *
   * @param {string} resetToken - The reset token
   * @param {string} newPassword - The new password
   * @param {string} login - The login of the user to reset the password of
   * @returns {Promise} - A promise
   * @since 0.8.0
   */
  @action("UserStore_resetPassword")
  resetPassword = (resetToken, newPassword, login) => {
    return apiService.post(USERS_PASSWORD_RESET, {
      resetToken: resetToken,
      password: newPassword
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(() => this.fetchOne(login));
  };

  /**
   * Generates a public key reset token
   *
   * @returns {Promise} - A promise
   * @since 0.15.0
   */
  @action("UserStore_resetPublicKey")
  resetPublicKey = (email) => {
    return apiService.get(USERS_PUBLICKEY_RESET, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        email: email
      }
    })
      .then(action("UserStore_resetPublicKey_synchronization", response => {
        this._findOneByEmail(email).publicKeyResetToken = response.data.publicKeyResetToken;
      }));
  };
  /**
   * Updates the user with the specified login.
   * This is a API- and store synchronization action!
   *
   * @param {string} login - The login of the user to update
   * @param {string} email - The email of the user
   * @param {string} firstName - The first name of the user
   * @param {string} lastName - The last name of the user
   */
  @action("UserStore_update")
  update = (login, email, firstName, lastName) => {
    return apiService.put(USER({login: login}), {
      email: email,
      firstName: firstName,
      lastName: lastName
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserStore_fetchAll_synchronization", response =>
        this.users[this.users.findIndex(user => user.login === response.data.login)] = response.data
      ));
  };

  /**
   * Deletes the user with the specified ID.
   * This is a pure store synchronization action!
   *
   * @param {number} userId - The ID of the user to delete
   * @since 0.9.0
   */
  @action("UserStore__deleteOneById")
  _deleteOneById = (userId) => this.users.splice(_.findIndex(this.users, user => user.id === userId), 1);

  /**
   * Deletes the user with the specified login.
   * This is a pure store synchronization action!
   *
   * @param {string} login - The login of the user to delete
   * @since 0.9.0
   */
  @action("UserStore__deleteOneByLogin")
  _deleteOneByLogin = (login) => this.users.splice(_.findIndex(this.users, user => user.login === login), 1);

  /**
   * Filters all users for the specified user group ID.
   * This is a pure store operation action!
   *
   * @param {number} userGroupId - The ID of user group to find all users of
   * @returns {array} A collection of filtered users
   * @since 0.9.0
   */
  _filterAllByGroup = (userGroupId) => _.filter(this.users, user => user.groups.includes(userGroupId));

  /**
   * Finds the user with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} userId - The ID of the user to find
   * @returns {object} - The user if found
   * @since 0.9.0
   */
  _findOneById = (userId) => this.users.find(user => user.id === userId);

  /**
   * Finds the user with the specified login.
   * This is a pure store operation action!
   *
   * @param {string} login - The login of the user to find
   * @returns {object} - The user if found
   * @since 0.9.0
   */
  _findOneByLogin = (login) => this.users.find(user => user.login === login);

  /**
   * Finds the user with the specified email.
   * This is a pure store operation action!
   *
   * @param {string} email - The login of the user to find
   * @returns {object} - The user if found
   * @since 0.15.0
   * @author dvonderbey@communicode.de
   */
  _findOneByEmail = (email) => this.users.find(user => user.email === email);

  /**
   * Searches for the userId in the store
   * This is a pure store operation action!
   *
   * @param {number} userId - The ID of the user to find
   * @returns {Boolean} The statement if the store contains the key
   * @since 0.15.0
   */
  _contains = (userId) => {
    return this.users.findIndex(user => user.id === userId) !== -1;
  };

  /**
   * Pushes a new user to the store.
   * This is a pure store operation action!
   *
   * @param {object} user - The user object
   * @since 0.15.0
   */
  @action("UserStore_pushEntity")
  _push = (user) => {
    return this.users.push(user);
  };

  /**
   * Updates the user entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} userId - The ID of the user entity to update
   * @param {object} updatedEntity - The updated category entity
   * @since 0.9.0
   */
  @action("UserStore_updateEntity")
  _updateEntity = (userId, updatedEntity) => {
    let index = this.users.findIndex(user => user.id === userId);
    index !== -1 && this.users.splice(index, 1, updatedEntity);
  };
}

export default UserStore;

import {action, observable} from "mobx";
import _ from "lodash";
import apiService from "../services/ApiService";
import {USER, USERS, USERS_ACTIVATE, USERS_DEACTIVATE, USERS_PASSWORD_RESET, USERS_REGISTER} from "./../services/apiRequestMappings";
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
   * Activates a user with the specified activation key.
   * This is a API- and store synchronization action!
   *
   * @param {string} activationKey - The activation key to activate a user with
   * @returns {Promise} - A promise
   */
  @action("UserStore_activate")
  activate = (activationKey) => {
    return apiService.get(USERS_ACTIVATE, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        activation_key: activationKey
      }
    })
      .then(action("UserStore_activate_synchronization", response => this.users[this.users.findIndex(user => user.id === response.data.id)] = response.data));
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
      .then(action("UserStore_create_synchronization", response => this.users.push(response.data)));
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
      .then(action("UserStore_deactivate_synchronization", response => this.users[this.users.findIndex(user => user.id === response.data.id)] = response.data));
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
      .then(action("UserStore_deleteOne_synchronization", () => this.users.splice(this.users.findIndex(user => user.login === login), 1)));
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
      .then(action("UserStore_fetchOne_synchronization", response =>
        this.users.splice(_.findIndex(this.users, user => user.login === response.data.login), 1, response.data)));
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
      .then(() => this.fetchOne(login));
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
      resetKey: resetToken,
      password: newPassword
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(() => this.fetchOne(login));
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
  _findById = (userId) => this.users.find(user => user.id === userId);

  /**
   * Finds the user with the specified login.
   * This is a pure store operation action!
   *
   * @param {string} login - The login of the user to find
   * @returns {object} - The user if found
   * @since 0.9.0
   */
  _findByLogin = (login) => this.users.find(user => user.login === login);

  /**
   * Removes the user group from a user specified by the ID.
   * This is a pure store synchronization action!
   *
   * @param {string} login - The login of the user to remove the user group from
   * @param {number} userGroupId - The ID of the user group to remove
   * @since 0.9.0
   */
  @action
  _removeUserGroup = (login, userGroupId) => _.remove(this._findByLogin(login).groups, id => id === userGroupId);
}

export default UserStore;

import {action, observable} from "mobx";
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
   *
   * @param {string} activationKey - The activation key to activate a user with
   * @returns {Promise} - A promise
   */
  @action
  activate = (activationKey) => {
    return apiService.get(USERS_ACTIVATE, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        activation_key: activationKey
      }
    })
      .then(action(response => this.users[this.users.findIndex(user => user.id === response.data.id)] = response.data));
  };

  /**
   * Creates a new user with the specified attributes.
   *
   * @param {string} firstName - The first name of the user to create
   * @param {string} lastName - The last name of the user to create
   * @param {string} email - The email of the user to create
   * @param {string} password - The password of the user to create
   * @returns {Promise} - A promise
   */
  @action
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
      .then(action(response => this.users.push(response.data)));
  };

  /**
   * Deactivates the user with the specified login.
   *
   * @param {string} login - The login of the user to deactivate
   * @returns {Promise} - A promise
   */
  @action
  deactivate = (login) => {
    return apiService.get(USERS_DEACTIVATE, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        login: login
      }
    })
      .then(action(response => this.users[this.users.findIndex(user => user.id === response.data.id)] = response.data));
  };

  /**
   * Deletes the user with the specified login.
   *
   * @param {string} login - The login of the user to delete
   * @returns {Promise} - A promise
   */
  @action
  delete = (login) => {
    return apiService.delete(USER({login: login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(() => this.users.splice(this.users.findIndex(user => user.login === login), 1)));
  };

  /**
   * Gets the user with the specified login.
   *
   * @param {string} login - The login of the user to get
   * @returns {Promise} - A promise
   */
  @action
  get = (login) => {
    return apiService.get(USER({login: login}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.users[this.users.findIndex(user => user.login === login)] = response.data));
  };

  /**
   * Gets all users.
   *
   * @returns {Promise} - A promise
   */
  @action
  getAll = () => {
    return apiService.get(USERS, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.users = response.data));
  };

  /**
   * Updates the user with the specified login.
   *
   * @param {string} login - The login of the user to update
   * @param {string} email - The email of the user
   * @param {string} firstName - The first name of the user
   * @param {string} lastName - The last name of the user
   */
  @action
  update(login, email, firstName, lastName) {
    return apiService.put(USER({login: login}), {
      email: email,
      firstName: firstName,
      lastName: lastName
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => this.users[this.users.findIndex(user => user.login === response.data.login)] = response.data));
  }
}

export let userStore = new UserStore();

import axios from "axios";
import {observable} from "mobx";
import {
  API_USERS_GET_ACTIVATION,
  API_USERS_POST_ONE,
  API_USERS_GET_DEACTIVATION,
  API_USERS_DELETE_ONE,
  API_USERS_GET_ALL,
  API_USERS_PUT_ONE
} from "../util/Constants";

/**
 * A observable store for {@code user} entities.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
class UserStore {
  @observable users = [];

  /**
   * Activates a user with the specified activation key.
   *
   * @param {string} activationKey - The activation key to activate a user with
   */
  activateUser(activationKey) {
    axios.get(API_USERS_GET_ACTIVATION, {
      params: {
        access_token: localStorage.getItem("access_token"),
        activation_key: activationKey
      }
    }).then(response => {
      this.users[this.users.findIndex(user => user.login === response.data.login)] = response.data;
      }).catch(error => {
        console.log(error);
      });
  }

  /**
   * Creates a new user with the specified attributes.
   *
   * @param {string} firstName - The first name of the user to create
   * @param {string} lastName - The last name of the user to create
   * @param {string} email - The email of the user to create
   * @param {string} password - The password of the user to create
   */
  createUser(firstName, lastName, email, password) {
    axios.post(API_USERS_POST_ONE, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 201) {
        this.users.push(response.data);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Deactivates the user with the specified login.
   *
   * @param {string} login - The login of the user to deactivate
   */
  deactivateUser(login) {
    axios.get(API_USERS_GET_DEACTIVATION, {
      params: {
        access_token: localStorage.getItem("access_token"),
        login: login
      }
    }).then(response => {
      this.users[this.users.findIndex(user => user.login === response.data.login)] = response.data;
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Deletes the user with the specified login.
   *
   * @param {string} login - The login of the user to delete
   */
  deleteUser(login) {
    axios.delete(API_USERS_DELETE_ONE + login, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 204) {
        this.users.splice(this.users.findIndex(user => user.login === login), 1);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Fetches all users.
   *
   * @returns {ObservableArray} The fetched user as observable array
   */
  fetchUsers() {
    axios.get(API_USERS_GET_ALL, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 200) {
        this.users = response.data;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Updates the user with the specified login.
   *
   * @param {string} login - The login of the user to update
   * @param {string} email - The email of the user
   * @param {string} firstName - The first name of the user
   * @param {string} lastName - The last name of the user
   */
  updateUser(login, email, firstName, lastName) {
    axios.put(API_USERS_PUT_ONE + login, {
      email: email,
      firstName: firstName,
      lastName: lastName
    }, {
      params: {
        access_token: localStorage.getItem("access_token")
      }
    }).then(response => {
      if (response.status === 200) {
        this.users[this.users.findIndex(user => user.login === response.data.login)] = response.data;
      }
    }).catch(error => {
      console.log(error);
    });
  }
}

export let userStore = new UserStore()

export default UserStore;

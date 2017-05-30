import {action, observable} from "mobx";

import apiService from "./../services/ApiService";
import {API_ME} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for data of a authenticated user.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.3.0
 */
class AuthStore {
  @observable login;
  @observable privileged;
  @observable firstName;
  @observable lastName;
  @observable isAuthorized;
  @observable authorities;

  constructor() {
    this.login = "";
    this.privileged = false;
    this.firstName = "";
    this.lastName = "";
    this.isAuthorized = false;
    this.authorities = [];
  }

  /**
   * Fetches the data of the authenticated user.
   *
   * @returns {Promise} - A promise
   * @since 0.8.0
   */
  @action
  fetch = () => {
    return apiService.get(API_ME, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action(response => {
        for (const key of Object.keys(response.data)) {
          this[key] = response.data[key];
        }
        this.isAuthorized = true;
        return response;
      }))
      .catch(error => console.error(error));
  };

  /**
   * Resets all store attributes to their default values.
   *
   * @since 0.8.0
   */
  @action
  reset = () => {
    this.login = "";
    this.privileged = false;
    this.firstName = "";
    this.lastName = "";
    this.isAuthorized = false;
    this.authorities = [];
  };

  /**
   * Sets the value of the {@link isAuthorized} attribute.
   *
   * @param {boolean} isAuthorized - The new value of the attribute
   * @since 0.8.0
   */
  @action setIsAuthorized = (isAuthorized) => this.isAuthorized = isAuthorized;
}

export let authStore = new AuthStore();

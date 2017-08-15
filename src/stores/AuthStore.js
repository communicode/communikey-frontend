import {action, observable} from "mobx";
import apiService from "./../services/ApiService";
import {encryptionService} from "../Communikey";
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
  @observable publicKey;

  constructor() {
    this.login = "";
    this.privileged = false;
    this.firstName = "";
    this.lastName = "";
    this.isAuthorized = false;
    this.authorities = [];
    this.publicKey = "";
  }

  /**
   * Fetches the data of the authenticated user.
   * This is a API- and store synchronization action!
   *
   * @returns {Promise} - A promise
   * @since 0.8.0
   */
  @action("AuthStore_fetch")
  fetch = () => {
    return apiService.get(API_ME, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("AuthStore_fetch_synchronization", response => {
        for (const key of Object.keys(response.data)) {
          this[key] = response.data[key];
        }
        this.isAuthorized = true;
        return response;
      }));
  };

  /**
   * Resets all store attributes to their default values.
   * This is a pure store synchronization action!
   *
   * @since 0.8.0
   */
  @action("AuthStore__reset")
  _reset = () => {
    this.login = "";
    this.privileged = false;
    this.firstName = "";
    this.lastName = "";
    this.isAuthorized = false;
    this.authorities = [];
    this.publicKey = "";
  };

  /**
   * Sets the value of the {@link isAuthorized} attribute.
   * This is a pure store synchronization action!
   *
   * @param {boolean} isAuthorized - The new value of the attribute
   * @since 0.8.0
   */
  @action("AuthStore__setIsAuthorized")
  _setIsAuthorized = (isAuthorized) => this.isAuthorized = isAuthorized;
}

export default AuthStore;

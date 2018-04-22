/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {action, observable} from "mobx";
import apiService from "../services/ApiService";
import {AUTHORITIES, AUTHORITY} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for authority entities.
 *
 * @author sgreb@communicode.de
 * @since 0.11.0
 */
class AuthorityStore {
  @observable authorities;

  /**
   * Constructs the authority store.
   */
  constructor() {
    this.authorities = [];
  }

  /**
   * Fetches all authorities.
   * This is a API- and store synchronization action!
   *
   * @returns {Promise} - The authorities as a promise
   */
  @action("AuthorityStore_fetchAll")
  fetchAll = () => {
    return apiService.get(AUTHORITIES, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("AuthorityStore_fetchAll_synchronization", response => this.authorities = response.data));
  };

  /**
   * Fetches the authority with the specified name.
   * This is a API- and store synchronization action!
   *
   * @param {string} authorityName - The name of the authority to fetch
   * @returns {Promise} - The authority as a promise
   */
  @action("AuthorityStore_fetchOne")
  fetchOne = (authorityName) => {
    return apiService.get(AUTHORITY({authorityName: authorityName}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("AuthorityStore_fetchOne_synchronization", response => {
        this._updateEntity(authorityName, response.data);
        return response.data;
      }));
  };

  /**
   * Finds the authority with the specified name.
   * This is a pure store operation action!
   *
   * @param {string} authorityName - The name of the authority to find
   * @returns {object} The authority if found, undefined otherwise
   */
  _findOneByName = (authorityName) => this.authorities.find(authority =>authority.name === authorityName);

  /**
   * Updates the authority entity with the specified name.
   * This is a pure store operation action!
   *
   * @param {string} authorityName - The name of the authority entity to update
   * @param {object} updatedEntity - The updated authority entity
   */
  _updateEntity = (authorityName, updatedEntity) =>
    this.authorities.splice(this.authorities.findIndex(authority => authority.name === authorityName), 1, updatedEntity);
}

export default AuthorityStore;

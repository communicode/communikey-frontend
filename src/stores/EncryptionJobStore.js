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
import _ from "lodash";
import {observable, action} from "mobx";

/**
 * A observable store for encryption job entities.
 *
 * @author dvonderbey@communicode.de
 * @since 0.15.0
 */
class EncryptionJobStore {
  @observable encryptionJobs;
  @observable jobNotice;

  /**
   * Constructs the authority store.
   */
  constructor() {
    this.encryptionJobs = [];
    this.jobNotice = false;
  }

  /**
   * Adds an encryption job to the store.
   *
   * @param {object} encryptionJob - The encryption job that will be added to the store
   */
  @action("EncryptionJobStore_add")
  add = (encryptionJob) => {
    this.encryptionJobs.push(encryptionJob);
    const self = this;
    setTimeout(() => {
      self.encryptionJobs.length !== 0 && self.showJobNotice();
    }, 10000);
  };

  /**
   * Sets the jobNotice observable to true to show the job notice
   */
  @action("EncryptionJobStore_showJobNotice")
  showJobNotice = () => {
    this.jobNotice = true;
  };

  /**
   * Sets the jobNotice observable to true to show the job notice
   */
  @action("EncryptionJobStore_showJobNotice")
  hideJobNotice = () => {
    this.jobNotice = false;
  };

  /**
   * Adds an encryption job to the store.
   *
   * @param {object} token - The encryption job token that will be added to the store
   */
  @action("EncryptionJobStore_remove")
  remove = (token) => {
    this._contains(token) && this._deleteOneByToken(token);
    if(this.encryptionJobs.length === 0) {
      this.hideJobNotice();
    }
  };

  /**
   * Deletes the encryption job with the specified token.
   * This is a pure store synchronization action!
   *
   * @param {string} token - The token of the encryption job to delete
   * @since 0.15.0
   */
  @action("EncryptionJobStore__deleteOneByToken")
  _deleteOneByToken = (token) => this.encryptionJobs.splice(_.findIndex(this.encryptionJobs, job => job.token === token), 1);

  /**
   * Finds the encryption job with the specified token.
   * This is a pure store operation action!
   *
   * @param {string} token - The token of the encryption job to find
   * @returns {object} The encryption job if found, undefined otherwise
   */
  _findOneByToken = (token) => this.encryptionJobs.find(job => job.token === token);

  /**
   * Searches for the userId in the store
   * This is a pure store operation action!
   *
   * @param {number} token - The token of the encryption job to find
   * @returns {Boolean} The statement if the store contains the encryption job
   * @since 0.15.0
   */
  _contains = (token) => {
    return this.encryptionJobs.findIndex(job => job.token === token) !== -1;
  };

  /**
   * Pushes a new user to the store.
   * This is a pure store operation action!
   *
   * @param {object} encryptionJob - The user object
   * @since 0.15.0
   */
  @action("EncryptionJobStore_pushEntity")
  _push = (encryptionJob) => {
    return this.encryptionJobs.push(encryptionJob);
  };

  /**
   * Updates the user entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} token - The token of the encryption job to update
   * @param {object} updatedEntity - The updated encryption job
   * @since 0.15.0
   */
  @action("EncryptionJobStore_updateEntity")
  _updateEntity = (token, updatedEntity) => {
    let index = this.encryptionJobs.findIndex(job => job.token === token);
    index !== -1 && this.encryptionJobs.splice(index, 1, updatedEntity);
  };
}

export default EncryptionJobStore;

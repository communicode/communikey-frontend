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
    console.log("Adding job with token", encryptionJob.token);
    this.encryptionJobs.push(encryptionJob);
    const self = this;
    setTimeout(() => {
      self.encryptionJobs.length !== 0 && self.showJobNotice();
    }, 1000);
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
    console.log("Removing job with token", token);
    this.encryptionJobs.splice(this.encryptionJobs.findIndex(job => job.token === token), 1);
    if(this.encryptionJobs.length === 0) {
      this.hideJobNotice();
    }
  };

  /**
   * Finds the encryption job with the specified token.
   * This is a pure store operation action!
   *
   * @param {string} token - The token of the encryption job to find
   * @returns {object} The encryption job if found, undefined otherwise
   */
  _findOneByToken = (token) => this.encryptionJobs.find(job => job.token === token);

  /**
   * Updates the encryption job entity with the specified token.
   * This is a pure store operation action!
   *
   * @param {string} token - The token of the encryption job entity to update
   * @param {object} updatedEntity - The updated encryption job entity
   */
  @action("EncryptionJobStore_update")
  _updateEntity = (token, updatedEntity) =>
    this.encryptionJobs.splice(this.encryptionJobs.findIndex(job => job.token === token), 1, updatedEntity);
}

export default EncryptionJobStore;

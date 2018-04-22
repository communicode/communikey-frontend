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
import {
  webSocketService,
  encryptionService,
  encryptionJobStore,
  keyStore
} from "../Communikey";
import {
  USER_JOBS,
  JOB_ABORT,
  USER_REPLY,
  USER_ERRORS,
  JOB_FULFILL
} from "./wssRequestMappings";

/**
 * Provides the crowd encryption functionality using the websocket connection
 *
 * @author dvonderbey@communicode.de
 * @since 0.15.0
 */
class CrowdEncryptionService {
  encrypting;
  initialized;

  constructor() {
    this.initialized = false;
    this.encrypting = false;
  }

  /**
   * Initializes the subscriptions
   */
  initialize = () => {
    if(webSocketService.initialized) {
      webSocketService.subscribe(USER_JOBS, this.encryptionJobsCallback);
      webSocketService.subscribe(JOB_ABORT, this.encryptionJobAbortCallback);
      webSocketService.subscribe(USER_REPLY, this.replyCallback);
      webSocketService.subscribe(USER_ERRORS, this.errorCallback);
      this.initialized = true;
    }
  };

  /**
   * In case of the WSS connection closing.
   */
  close = () => {
    this.initialized = false;
  };

  /**
   * Callback for the encryption job advertisement subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobsCallback = (message) => {
    const encryptionJob = JSON.parse(message.body);
    encryptionJobStore.add(encryptionJob);
    this.fulfillJob(encryptionJob);
  };

  /**
   * Callback for the encryption job abort subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobAbortCallback = (message) => {
    const encryptionJobAbort = JSON.parse(message.body);
    encryptionJobStore.remove(encryptionJobAbort.token);
  };

  /**
   * Callback for the personal reply subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  replyCallback = () => {};

  /**
   * Callback for the personal reply subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  errorCallback = () => {};

  /**
   * Starts to work on the encryption jobs that are available.
   */
  fulfillJobs = () => {
    if (!this.encrypting && !_.isEmpty(encryptionService.passphrase)) {
      encryptionJobStore.hideJobNotice();
      this.encrypting = true;
      encryptionJobStore.encryptionJobs.forEach(job => {
        this.fulfillJob(job);
      });
      this.encrypting = false;
    }
  };

  /**
   * Fulfills one encryption job by encrypting it and sending it to the server.
   *
   * @param job the job that should be worked on
   */
  fulfillJob = (job) => {
    !_.isEmpty(encryptionService.passphrase) &&
      keyStore.getPassword(job.key).then((password) => {
        let encrypted = encryptionService.encrypt(password, job.publicKey);
        let fulfillment = {encryptedPassword: encrypted};
        webSocketService.send(JOB_FULFILL({token: job.token}), fulfillment);
      });
  };
}

export default CrowdEncryptionService;

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

  constructor() {
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
    }
  };

  /**
   * Callback for the encryption job advertisement subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobsCallback = (message) => {
    const encryptionJob = JSON.parse(message.body);
    console.log("Incoming job", encryptionJob);
    encryptionJobStore.add(encryptionJob);
    this.fulfillJob(encryptionJob);
  };

  /**
   * Callback for the encryption job abort subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobAbortCallback = (message) => {
    console.log("Abort received:", JSON.parse(message.body));
    const encryptionJobAbort = JSON.parse(message.body);
    encryptionJobStore.remove(encryptionJobAbort.token);
  };

  /**
   * Callback for the personal reply subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  replyCallback = (message) => {
    console.log("Reply received:", JSON.parse(message.body));
  };

  /**
   * Callback for the personal reply subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  errorCallback = (message) => {
    console.log("Error received:", JSON.parse(message.body));
  };

  /**
   * Starts to work on the encryption jobs that are available.
   */
  fulfillJobs = () => {
    console.log("Starting to work on job queue");
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
        console.log("Fulfilled job with token", job.token);
      });
  };
}

export default CrowdEncryptionService;

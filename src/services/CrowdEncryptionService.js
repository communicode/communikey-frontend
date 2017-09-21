import {
  webSocketService,
  encryptionService,
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

  constructor() {}

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
    keyStore.getPassword(encryptionJob.key).then((password) => {
      let encrypted = encryptionService.encrypt(password, encryptionJob.publicKey);
      let fulfillment = {encryptedPassword: encrypted};
      webSocketService.send(JOB_FULFILL({token: encryptionJob.token}), fulfillment);
    });
  };

  /**
   * Callback for the encryption job abort subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobAbortCallback = (message) => {
    console.log("Abort received:", JSON.parse(message.body));
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
}

export default CrowdEncryptionService;

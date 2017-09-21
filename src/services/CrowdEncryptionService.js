import {
  webSocketService,
  encryptionService,
  keyStore
} from "../Communikey";

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
      webSocketService.subscribe("/user/queue/encryption/jobs", this.encryptionJobsCallback);
      webSocketService.subscribe("/queue/encryption/jobs/aborts", this.encryptionJobAbortCallback);
      webSocketService.subscribe("/user/queue/reply", this.replyCallback);
    }
  };

  /**
   * Callback for the encryption job advertisement subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobsCallback = (message) => {
    const encryptionJob = JSON.parse(message.body);
    encryptionService.passphrase = "";
    keyStore.getPassword(encryptionJob.key).then((password) => {
      let encrypted = encryptionService.encrypt(password, encryptionJob.publicKey);
      let fulfillment = {token: encryptionJob.token, encryptedPassword: encrypted};
      webSocketService.send("/app/jobs/fulfill", fulfillment);
    });
  };

  /**
   * Callback for the encryption job abort subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  encryptionJobAbortCallback = (message) => {};

  /**
   * Callback for the personal reply subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  replyCallback = (message) => {};
}

export default CrowdEncryptionService;

import SockJS from "sockjs-client";
import StompJS from "stompjs";
import {notificationService} from "../Communikey";
import {WSS_REGISTRY_TOKEN} from "./wssRequestMappings";

/**
 * Provides the websocket functionality
 *
 * @author dvonderbey@communicode.de
 * @since 0.15.0
 */

class WebSocketService {
  webSocket;
  stompClient;
  initialized;
  subscriptions;

  /**
   * Constructs the web socket connection to the backend and builds the stomp client
   * on top of it.
   */
  constructor() {
    this.initialized = false;
    this.subscriptions = [];
  }

  /**
   * Initializes the subscriptions
   *
   * @returns {Promise} a promise for the connection status
   */
  initialize = () => {
    return new Promise((resolve, reject) => {
      this.webSocket = new SockJS(WSS_REGISTRY_TOKEN({accessToken: localStorage.getItem("access_token")}));
      this.stompClient = StompJS.over(this.webSocket);
      // this.stompClient.debug = () => {};
      try {
        this.stompClient.connect({}, () => {
          this.initialized = true;
          notificationService.minorSuccess("Connection successful", "The websocket connection has been established!", 2);
          resolve();
        });
      } catch(error) {
        reject(error);
      }
    });
  };

  /**
   * Closes the websocket connection.
   */
  close = () => {
    this.unsubscribe();
    this.stompClient.disconnect();
  };

  /**
   * Initializes a subscription and adds the ID of it to the subscriptions array for later use.
   *
   * @param destination the destination path
   * @param callback the callback to be called when a message is received
   */
  subscribe = (destination, callback) => {
    this.subscriptions.push(this.stompClient.subscribe(destination, callback));
  };

  /**
   * Unsubscribes from all initialized subscriptions
   */
  unsubscribe = () => {
    this.subscriptions.forEach((subscription) => {
      this.stompClient.unsubscribe(subscription);
    });
  };

  /**
   * Sends a payload to a specified path of the websocket connection
   *
   * @param destination the destination path
   * @param payload the payload that is sent
   */
  send = (destination, payload) => {
    this.stompClient.send(destination, {}, JSON.stringify(payload));
  };
}

export default WebSocketService;

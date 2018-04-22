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
import SockJS from "sockjs-client";
import StompJS from "stompjs";
import {notificationService, liveEntityUpdateService, crowdEncryptionService} from "../Communikey";
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
      this.stompClient.debug = () => {};
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
    this.initialized = false;
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
    liveEntityUpdateService.close();
    crowdEncryptionService.close();
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

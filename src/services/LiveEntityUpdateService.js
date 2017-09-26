import {
  webSocketService,
  keyStore,
  categoryStore,
  userStore,
  userGroupStore
} from "../Communikey";
import {
  UPDATES_CATEGORIES,
  UPDATES_CATEGORIES_DELETE,
  UPDATES_KEYS,
  UPDATES_KEYS_DELETE,
  UPDATES_USERS,
  UPDATES_USERS_DELETE,
  UPDATES_GROUPS,
  UPDATES_GROUPS_DELETE
} from "./wssRequestMappings";

/**
 * Provides the entity live update functionality using the websocket connection
 *
 * @author dvonderbey@communicode.de
 * @since 0.15.0
 */
class LiveEntityUpdateService {
  userSubscriptionsInitialized;
  adminSubscriptionsInitialized;

  constructor() {
    this.userSubscriptionsInitialized = false;
    this.adminSubscriptionsInitialized = false;
  }

  /**
   * Initializes the subscriptions
   */
  initialize = () => {
    if(webSocketService.initialized) {
      webSocketService.subscribe(UPDATES_CATEGORIES, this.categoryUpdateCallback);
      webSocketService.subscribe(UPDATES_CATEGORIES_DELETE, this.categoryDeleteCallback);
      webSocketService.subscribe(UPDATES_KEYS, this.keyUpdateCallback);
      webSocketService.subscribe(UPDATES_KEYS_DELETE, this.keyDeleteCallback);
      this.userSubscriptionsInitialized = true;
    }
  };

  /**
   * Initializes the admin subscriptions
   */
  initializeAdminSubscriptions = () => {
    if(webSocketService.initialized) {
      webSocketService.subscribe(UPDATES_USERS, this.userUpdateCallback);
      webSocketService.subscribe(UPDATES_USERS_DELETE, this.userDeleteCallback);
      webSocketService.subscribe(UPDATES_GROUPS, this.groupUpdateCallback);
      webSocketService.subscribe(UPDATES_GROUPS_DELETE, this.groupDeleteCallback);
      this.adminSubscriptionsInitialized = true;
    }
  };

  /**
   * In case of the WSS connection closing.
   */
  close = () => {
    this.userSubscriptionsInitialized = false;
    this.adminSubscriptionsInitialized = false;
  };

  /**
   * Callback for the key update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  keyUpdateCallback = (message) => {
    let key = JSON.parse(message.body);
    console.log("Key update received:", key);
    keyStore._contains(key.id)
      ? keyStore._updateEntity(key.id, key)
      : keyStore._push(key);
  };

  /**
   * Callback for the key delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  keyDeleteCallback = (message) => {
    let key = JSON.parse(message.body);
    console.log("Key delete received:", key);
    keyStore._contains(key.id) && keyStore._deleteOne(key.id);
  };

  /**
   * Callback for the category update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  categoryUpdateCallback = (message) => {
    let category = JSON.parse(message.body);
    console.log("Category update received:", category);
    categoryStore._contains(category.id)
      ? categoryStore._updateEntity(category.id, category)
      : categoryStore._push(category);
  };

  /**
   * Callback for the category delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  categoryDeleteCallback = (message) => {
    let category = JSON.parse(message.body);
    console.log("Category delete received:", category);
    categoryStore._contains(category.id) && categoryStore.deleteOne(category.id);
  };

  /**
   * Callback for the user update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  userUpdateCallback = (message) => {
    let user = JSON.parse(message.body);
    console.log("User update received:", user);
    userStore._contains(user.id)
      ? userStore._updateEntity(user.id, user)
      : userStore._push(user);
  };

  /**
   * Callback for the user delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  userDeleteCallback = (message) => {
    let user = JSON.parse(message.body);
    console.log("User delete received:", user);
    userStore._contains(user.id) && userStore.deleteOne(user.id);
  };

  /**
   * Callback for the user update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  groupUpdateCallback = (message) => {
    let userGroup = JSON.parse(message.body);
    console.log("Group update received:", userGroup);
    userGroupStore._contains(userGroup.id)
      ? userGroupStore._updateEntity(userGroup.id, userGroup)
      : userGroupStore._push(userGroup);
  };

  /**
   * Callback for the user delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  groupDeleteCallback = (message) => {
    let userGroup = JSON.parse(message.body);
    console.log("Group delete received:", userGroup);
    userGroupStore._contains(userGroup.id) && userGroupStore.deleteOne(userGroup.id);
  };
}

export default LiveEntityUpdateService;

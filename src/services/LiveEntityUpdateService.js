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
import {
  webSocketService,
  keyStore,
  categoryStore,
  userStore,
  userGroupStore,
  eventStore,
  tagStore
} from "../Communikey";
import {
  UPDATES_CATEGORIES,
  UPDATES_CATEGORIES_DELETE,
  UPDATES_KEYS,
  UPDATES_KEYS_DELETE,
  UPDATES_TAGS,
  UPDATES_TAGS_DELETE,
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
      webSocketService.subscribe(UPDATES_TAGS, this.tagUpdateCallback);
      webSocketService.subscribe(UPDATES_TAGS_DELETE, this.tagDeleteCallback);
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
    if(keyStore._contains(key.id)) {
      eventStore.createKeyUpdateEvent(key);
      keyStore._updateEntity(key.id, key);
    } else {
      eventStore.createKeyCreationEvent(key);
      keyStore._push(key);
    }
  };

  /**
   * Callback for the key delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  keyDeleteCallback = (message) => {
    let key = JSON.parse(message.body);
    eventStore.createKeyDeleteEvent(key);
    keyStore._contains(key.id) && keyStore._deleteOne(key.id);
  };

  /**
   * Callback for the tag update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  tagUpdateCallback = (message) => {
    let tag = JSON.parse(message.body);
    if(tagStore._contains(tag.id)) {
      eventStore.createTagUpdateEvent(tag);
      tagStore._updateEntity(tag.id, tag);
    } else {
      eventStore.createTagCreationEvent(tag);
      tagStore._push(tag);
    }
  };

  /**
   * Callback for the tag delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  tagDeleteCallback = (message) => {
    let tag = JSON.parse(message.body);
    eventStore.createTagDeleteEvent(tag);
    tagStore._contains(tag.id) && tagStore._deleteOneById(tag.id);
  };

  /**
   * Callback for the category update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  categoryUpdateCallback = (message) => {
    let category = JSON.parse(message.body);
    if(categoryStore._contains(category.id)) {
      eventStore.createCategoryUpdateEvent(category);
      categoryStore._updateEntity(category.id, category);
    } else {
      eventStore.createCategoryCreationEvent(category);
      categoryStore._push(category);
    }
  };

  /**
   * Callback for the category delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  categoryDeleteCallback = (message) => {
    let category = JSON.parse(message.body);
    eventStore.createCategoryDeleteEvent(category);
    categoryStore._contains(category.id) && categoryStore._deleteOneById(category.id);
  };

  /**
   * Callback for the user update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  userUpdateCallback = (message) => {
    let user = JSON.parse(message.body);
    if(userStore._contains(user.id)) {
      eventStore.createUserUpdateEvent(user);
      userStore._updateEntity(user.id, user);
    } else {
      eventStore.createUserCreationEvent(user);
      userStore._push(user);
    }
  };

  /**
   * Callback for the user delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  userDeleteCallback = (message) => {
    let user = JSON.parse(message.body);
    eventStore.createUserDeleteEvent(user);
    userStore._contains(user.id) && userStore._deleteOneByLogin(user.id);
  };

  /**
   * Callback for the user update subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  groupUpdateCallback = (message) => {
    let userGroup = JSON.parse(message.body);
    if(userGroupStore._contains(userGroup.id)) {
      eventStore.createUserGroupUpdateEvent(userGroup);
      userGroupStore._updateEntity(userGroup.id, userGroup);
    } else {
      eventStore.createUserGroupCreationEvent(userGroup);
      userGroupStore._push(userGroup);
    }
  };

  /**
   * Callback for the user delete subscription
   *
   * @param message the callback message parameter of the stomp client
   */
  groupDeleteCallback = (message) => {
    let userGroup = JSON.parse(message.body);
    eventStore.createUserGroupDeleteEvent(userGroup);
    userGroupStore._contains(userGroup.id) && userGroupStore._deleteOne(userGroup.id);
  };
}

export default LiveEntityUpdateService;

import {action, observable} from "mobx";
import _ from "lodash";
import {categoryStore, userStore, liveEntityUpdateService} from "./../Communikey";
import apiService from "../services/ApiService";
import {USER_GROUP, USER_GROUPS, USER_GROUPS_USERS} from "./../services/apiRequestMappings";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "../config/constants";

/**
 * A observable store for user group entities.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.9.0
 */
class UserGroupStore {
  @observable userGroups;

  /**
   * Constructs the user group store.
   */
  constructor() {
    this.userGroups = [];
  }

  /**
   * Adds a user to the user group with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} userGroupId - the ID of the user group to add the user to
   * @param {string} login - the login of the user to be added
   * @returns {Promise} - A promise
   */
  @action("UserGroupStore_addUser")
  addUser = (userGroupId, login) => {
    return apiService.get(USER_GROUPS_USERS({userGroupId: userGroupId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        login: login
      }
    })
      .then(action("UserGroupStore_addUser_synchronization", response => {
        this._updateEntity(userGroupId, response.data);
        return userStore.fetchOne(login).then(() => response.data);
      }));
  };

  /**
   * Creates a new user group with the specified attributes.
   * This is a API- and store synchronization action!
   *
   * @param {string} name - The name of the user group to create
   * @returns {Promise} - The user group as a promise
   */
  @action("UserGroupStore_create")
  create = (name) => {
    return apiService.post(USER_GROUPS, {
      name: name
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserGroupStore_create_synchronization", response => {
        !liveEntityUpdateService.adminSubscriptionsInitialized && this.userGroups.push(response.data);
      }));
  };

  /**
   * Deletes the user group with the specified ID.
   * This is a API- and store synchronization action!
   *
   * Synchronizes the injected {@link CategoryStore} and {@link UserStore} instances.
   *
   * @param {number} userGroupId - The ID of the user group to delete
   * @returns {Promise} - A promise
   */
  @action("UserGroupStore_deleteOne")
  deleteOne = (userGroupId) => {
    return apiService.delete(USER_GROUP({userGroupId: userGroupId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserGroupStore_deleteOne_fetch", () => {
        apiService.all([
          _.forEach(
            _.filter(categoryStore.categories, category => category.groups.includes(userGroupId)), category => categoryStore.fetchOne(category.id)
          ),
          _.forEach(_.filter(userStore.users, user => user.groups.includes(userGroupId)), user => userStore.fetchOne(user.login))
        ])
          .then(action("UserGroupStore_deleteOne_synchronization", () =>
            !liveEntityUpdateService.adminSubscriptionsInitialized && this._deleteOne(userGroupId)));
      }));
  };

  /**
   * Fetches all user groups.
   * This is a API- and store synchronization action!
   *
   * @returns {Promise} - The user groups as a promise
   */
  @action("UserGroupStore_fetchAll")
  fetchAll = () => {
    return apiService.get(USER_GROUPS, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserGroupStore_fetchAll_synchronization", response => this.userGroups = response.data));
  };

  /**
   * Fetches the user group with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} userGroupId - the ID of the user group to fetch
   * @returns {Promise} - The user group as a promise
   */
  @action("UserGroupStore_fetchOne")
  fetchOne = (userGroupId) => {
    return apiService.get(USER_GROUP({userGroupId: userGroupId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserGroupStore_fetchOne_synchronization", response => {
        this._updateEntity(userGroupId, response.data);
        return response.data;
      }));
  };

  /**
   * Removes a user from the user group with the specified ID.
   * This is a API- and store synchronization action!
   *
   * @param {number} userGroupId - the ID of the user group to remove the user from
   * @param {string} login - the login of the user to be removed
   * @returns {Promise} - A promise
   */
  @action("UserGroupStore_removeUser")
  removeUser = (userGroupId, login) => {
    return apiService.delete(USER_GROUPS_USERS({userGroupId: userGroupId}), {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
        login: login
      }
    })
      .then(action("UserGroupStore_removeUser_synchronization", response => {
        this._updateEntity(userGroupId, response.data);
        return userStore.fetchOne(login).then(() => response.data);
      }));
  };

  /**
   * Updates a user group with the specified payload.
   * This is a API- and store synchronization action!
   *
   * @param {number} userGroupId - The ID of the user group to update
   * @param {string} payload - The payload to update the user group with
   * @returns {Promise} - The updated user group as a promise
   */
  @action("UserGroupStore_update")
  update = (userGroupId, payload) => {
    return apiService.put(USER_GROUP({userGroupId: userGroupId}), {
      name: payload.name
    }, {
      params: {
        access_token: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
      }
    })
      .then(action("UserGroupStore_update_synchronization", response => {
        this._updateEntity(userGroupId, response.data);
        return response.data;
      }));
  };

  /**
   * Deletes the user group with the specified ID.
   * This is a pure store synchronization action!
   *
   * @param {number} userGroupId - The ID of the user group to delete
   * @since 0.9.0
   */
  @action("UserGroupStore__deleteOne")
  _deleteOne = (userGroupId) => this.userGroups.splice(_.findIndex(this.userGroups, userGroup => userGroup.id === userGroupId), 1);

  /**
   * Filters all groups assigned with the the specified category ID.
   * This is a pure store operation action!
   *
   * @param {number} categoryId - The ID of the category to find all assigned groups of
   * @returns {array} A collection of filtered groups
   * @since 0.9.0
   */
  _filterAllByCategory = (categoryId) => _.filter(this.userGroups, userGroup => userGroup.categories.includes(categoryId));

  /**
   * Finds the user group with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} userGroupId - The ID of the user group to find
   * @returns {object} - The user group if found
   * @since 0.9.0
   */
  _findOneById = (userGroupId) => this.userGroups.find(userGroup => userGroup.id === userGroupId);

  /**
   * Finds the user group with the specified name.
   * This is a pure store operation action!
   *
   * @param {string} userGroupName - The name of the user group to find
   * @returns {object} - The user group if found
   * @since 0.9.0
   */
  _findOneByName = (userGroupName) => this.userGroups.find(userGroup => userGroup.name === userGroupName);


  /**
   * Searches for the userGroupId in the store
   * This is a pure store operation action!
   *
   * @param {number} userGroupId - The ID of the user group to find
   * @returns {Boolean} The statement if the store contains the key
   * @since 0.15.0
   */
  _contains = (userGroupId) => {
    return this.userGroups.findIndex(userGroup => userGroup.id === userGroupId) !== -1;
  };

  /**
   * Pushes a new user group to the store.
   * This is a pure store operation action!
   *
   * @param {object} userGroup - The user group object
   * @since 0.15.0
   */
  @action("UserGroupStore_pushEntity")
  _push = (userGroup) => {
    return this.userGroups.push(userGroup);
  };

  /**
   * Updates the user group entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} userGroupId - The ID of the user group entity to update
   * @param {object} updatedEntity - The updated category entity
   * @since 0.9.0
   */
  @action("UserGroupStore_updateEntity")
  _updateEntity = (userGroupId, updatedEntity) => {
    console.log("Updating group");
    let index = this.userGroups.findIndex(userGroup => userGroup.id === userGroupId);
    index !== -1 && this.userGroups.splice(index, 1, updatedEntity);
  };
}

export default UserGroupStore;

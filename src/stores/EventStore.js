import {action, observable} from "mobx";
import _ from "lodash";

/**
 * A observable store for events like entity updates
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */
class EventStore {
  @observable events;

  /**
   * Constructs the event store.
   */
  constructor() {
    this.events = [];
  }

  /**
   * Creates a category entity creation event containing
   * the specified category object.
   *
   * @param {object} category - The category that has been created
   */
  @action("EventStore_createCategoryCreationEvent")
  createCategoryCreationEvent = (category) => {
    return this._push({
      type: "category-create",
      responsible: category.lastModifiedBy,
      timestamp: category.lastModifiedDate,
      id: category.id,
      name: category.name
    });
  };

  /**
   * Creates a category entity update event containing
   * the specified category object.
   *
   * @param {object} category - The category that has been modified
   */
  @action("EventStore_createCategoryUpdateEvent")
  createCategoryUpdateEvent = (category) => {
    return this._push({
      type: "category-update",
      responsible: category.lastModifiedBy,
      timestamp: category.lastModifiedDate,
      id: category.id,
      name: category.name
    });
  };

  /**
   * Creates a category entity delete event containing
   * the specified category object.
   *
   * @param {object} category - The category that has been deleted
   */
  @action("EventStore_createCategoryDeleteEvent")
  createCategoryDeleteEvent = (category) => {
    return this._push({
      type: "category-delete",
      responsible: category.lastModifiedBy,
      timestamp: category.lastModifiedDate,
      id: category.id,
      name: category.name
    });
  };

  /**
   * Creates a key entity creation event containing
   * the specified key object.
   *
   * @param {object} key - The Key that has been created
   */
  @action("EventStore_createKeyCreationEvent")
  createKeyCreationEvent = (key) => {
    return this._push({
      type: "key-create",
      responsible: key.lastModifiedBy,
      timestamp: key.lastModifiedDate,
      id: key.id,
      name: key.name
    });
  };

  /**
   * Creates a key entity update event containing
   * the specified key object.
   *
   * @param {object} key - The Key that has been modified
   */
  @action("EventStore_createKeyUpdateEvent")
  createKeyUpdateEvent = (key) => {
    return this._push({
      type: "key-update",
      responsible: key.lastModifiedBy,
      timestamp: key.lastModifiedDate,
      id: key.id,
      name: key.name
    });
  };

  /**
   * Creates a key entity delete event containing
   * the specified key object.
   *
   * @param {object} key - The key that has been deleted
   */
  @action("EventStore_createKeyDeleteEvent")
  createKeyDeleteEvent = (key) => {
    return this._push({
      type: "key-delete",
      responsible: key.lastModifiedBy,
      timestamp: key.lastModifiedDate,
      id: key.id,
      name: key.name
    });
  };

  /**
   * Creates a user entity creation event containing
   * the specified user object.
   *
   * @param {object} user - The Key that has been created
   */
  @action("EventStore_createUserCreationEvent")
  createUserCreationEvent = (user) => {
    return this._push({
      type: "user-create",
      responsible: user.lastModifiedBy,
      timestamp: user.lastModifiedDate,
      id: user.id,
      name: user.login
    });
  };

  /**
   * Creates a user entity update event containing
   * the specified user object.
   *
   * @param {object} user - The Key that has been modified
   */
  @action("EventStore_createUserUpdateEvent")
  createUserUpdateEvent = (user) => {
    return this._push({
      type: "user-update",
      responsible: user.lastModifiedBy,
      timestamp: user.lastModifiedDate,
      id: user.id,
      name: user.login
    });
  };

  /**
   * Creates a user entity delete event containing
   * the specified user object.
   *
   * @param {object} user - The user that has been deleted
   */
  @action("EventStore_createUserDeleteEvent")
  createUserDeleteEvent = (user) => {
    return this._push({
      type: "user-delete",
      responsible: user.lastModifiedBy,
      timestamp: user.lastModifiedDate,
      id: user.id,
      name: user.login
    });
  };

  /**
   * Creates a user entity creation event containing
   * the specified user object.
   *
   * @param {object} userGroup - The user group that has been created
   */
  @action("EventStore_createUserGroupCreationEvent")
  createUserGroupCreationEvent = (userGroup) => {
    return this._push({
      type: "usergroup-create",
      responsible: userGroup.lastModifiedBy,
      timestamp: userGroup.lastModifiedDate,
      id: userGroup.id,
      name: userGroup.name
    });
  };

  /**
   * Creates a user entity update event containing
   * the specified user object.
   *
   * @param {object} userGroup - The user group that has been modified
   */
  @action("EventStore_createUserGroupUpdateEvent")
  createUserGroupUpdateEvent = (userGroup) => {
    return this._push({
      type: "usergroup-update",
      responsible: userGroup.lastModifiedBy,
      timestamp: userGroup.lastModifiedDate,
      id: userGroup.id,
      name: userGroup.name
    });
  };

  /**
   * Creates a user group entity delete event containing
   * the specified user group object.
   *
   * @param {object} userGroup - The user group that has been deleted
   */
  @action("EventStore_createUserGroupDeleteEvent")
  createUserGroupDeleteEvent = (userGroup) => {
    return this._push({
      type: "usergroup-delete",
      responsible: userGroup.lastModifiedBy,
      timestamp: userGroup.lastModifiedDate,
      id: userGroup.id,
      name: userGroup.name
    });
  };

  /**
   * Finds the event with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} eventId - The ID of the event to find
   * @returns {object} - The event if found
   * @since 0.15.0
   */
  _findById = (eventId) => this.events.find(event => event.id === eventId);

  /**
   * Deletes the event with the specified id.
   * This is a pure store synchronization action!
   *
   * @param {number} eventId - The id of the event to delete
   * @since 0.15.0
   */
  @action("EventStore__deleteOneById")
  _deleteOneById = (eventId) => this.events.splice(_.findIndex(this.events, event => event.id === eventId), 1);

  /**
   * Searches for the eventId in the store
   * This is a pure store operation action!
   *
   * @param {number} eventId - The ID of the event to find
   * @returns {Boolean} The statement if the store contains the event
   * @since 0.15.0
   */
  _contains = (eventId) => {
    return this.events.findIndex(event => event.id === eventId) !== -1;
  };

  /**
   * Pushes a new event to the store.
   * This is a pure store operation action!
   *
   * @param {object} event - The event object
   * @since 0.15.0
   */
  @action("EventStore_pushEntity")
  _push = (event) => {
    return this.events.push(event);
  };

  /**
   * Updates the event entity with the specified ID.
   * This is a pure store operation action!
   *
   * @param {number} eventId - The ID of the event entity to update
   * @param {object} updatedEntity - The updated event entity
   * @since 0.15.0
   */
  @action("EventStore_updateEntity")
  _updateEntity = (eventId, updatedEntity) => {
    let index = this.events.findIndex(event => event.id === eventId);
    index !== -1 && this.events.splice(index, 1, updatedEntity);
  };
}

export default EventStore;

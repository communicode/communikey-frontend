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
    let event = {
      type: "category-update",
      responsible: "dvonderbey",
      timestamp: "22.09.2017",
      id: "id123124",
      name: "Category 1"
    };
    this._push(event);
    event.id = "a";
    this._push(event);
    event.id = "as";
    this._push(event);
    event = {
      type: "category-delete",
      responsible: "dvonderbey",
      timestamp: "22.09.2017",
      id: "id1231das24",
      name: "Category 1"
    };
    this._push(event);
  }

  /**
   * Creates a category entity update event containing
   * the specified category object.
   *
   * @param {object} category - The category that has been modified
   */
  @action("EventStore_createCategoryUpdateEvent")
  createCategoryUpdateEvent = (category) => {
    let event = {
      type: "category-update",
      responsible: category.lastModifiedBy,
      timestamp: category.lastModifiedDate,
      id: category.id,
      name: category.name
    };
    return this._push(event);
  };

  /**
   * Creates a category entity delete event containing
   * the specified category object.
   *
   * @param {object} category - The category that has been modified
   */
  @action("EventStore_createCategoryDeleteEvent")
  createCategoryDeleteEvent = (category) => {
    let event = {
      type: "category-delete",
      responsible: category.lastModifiedBy,
      timestamp: category.lastModifiedDate,
      id: category.id,
      name: category.name
    };
    return this._push(event);
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

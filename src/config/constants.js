import {ROUTE_KEYS} from "../routes/routeMappings";
import {FRONTEND_URL} from "../services/apiRequestMappings";

const pathSeparator = "/";

/**
 * The name of the OAuth2 access token local storage item.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const LOCAL_STORAGE_ACCESS_TOKEN = "access_token";

/**
 * The name of the category key tab in the keys component.
 *
 * @type {string}
 * @since 0.12.0
 */
export const TAB_PANE_REACT_KEY_CATEGORIZED = "categorized";

/**
 * The name of the key pool key tab in the keys component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.12.0
 */
export const TAB_PANE_REACT_KEY_POOL = "pool";

/**
 * The message title for when a deep linked key wasn't found.
 *
 * @type {string}
 * @since 0.12.0
 */
export const ERROR_KEY_NOT_FOUND_TITLE = "Key not found!";

/**
 * The message for when a deep linked key wasn't found.
 *
 * @type {string}
 * @since 0.12.0
 */
export const ERROR_KEY_NOT_FOUND = "The key has not been found. Please check the supplied link. You may have no access to it or it doesn't exist anymore.";

/**
 * The link for the key share button.
 *
 * @type {string}
 * @since 0.12.0
 */
export const LINK_KEY_SHARE = FRONTEND_URL + ROUTE_KEYS + pathSeparator;
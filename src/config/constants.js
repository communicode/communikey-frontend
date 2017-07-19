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
 * The text of the signIn-tooltip.
 *
 * @type {string}
 * @since 0.12.0
 */
export const LOGIN_INFORMATION_TEXT = "No account? For access please send an email to key@communicode.de";

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
 * The message title for when a deep linked key wasn't found.
 *
 * @type {string}
 * @since 0.13.0
 */
export const ERROR_NOT_LOGGED_IN_TITLE = "Not logged in!";

/**
 * The message for when a deep linked key wasn't found.
 *
 * @type {string}
 * @since 0.13.0
 */
export const ERROR_NOT_LOGGED_IN = "You are currently not logged in. Please log in first to access this page.";

/**
 * The message title for when a deep linked key wasn't found.
 *
 * @type {string}
 * @since 0.13.0
 */
export const ERROR_NOT_AUTHORIZED_TITLE = "Missing authorization!";

/**
 * The message for when a deep linked key wasn't found.
 *
 * @type {string}
 * @since 0.13.0
 */
export const ERROR_NOT_AUTHORIZED = "You are not authorized to view this page. Please log in with an authorized account or contact key@communicode.de.";

/**
 * The link for the key share button.
 *
 * @type {string}
 * @since 0.12.0
 */
export const LINK_KEY_SHARE = FRONTEND_URL + ROUTE_KEYS + pathSeparator;
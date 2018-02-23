import _ from "lodash";
import {AUTHORITY_NAME, CATEGORY_ID, USER_GROUP_ID, USER_LOGIN, KEY_ID, TAG_ID} from "./apiPathVariables";
import {API_AUTHORIZE_PARAM, API_ME_PARAM} from "./apiRequestParameter";

/**
 * The URL of the communikey backend.
 * The value can be injected through the {@linkcode COMMUNIKEY_BACKEND_URL} environment variable during the compile time.
 *
 * @constant
 * @default http://localhost:8081
 * @type {string}
 * @since 0.6.0
 */
export const BACKEND_URL = process.env.COMMUNIKEY_BACKEND_URL || "http://localhost:8081";

/**
 * The URL of the communikey frontend.
 * The value can be injected through the {@linkcode COMMUNIKEY_FRONTEND_URL} environment variable during the compile time.
 *
 * @constant
 * @default http://localhost:8081
 * @type {string}
 * @since 0.6.0
 */
export const FRONTEND_URL = process.env.COMMUNIKEY_FRONTEND_URL || "http://localhost:8081";

/**
 * The API root endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const API = BACKEND_URL + "/api";

/**
 * The API authorization endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const API_AUTHORIZE = API + API_AUTHORIZE_PARAM;

/**
 * The API "me" endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const API_ME = API + API_ME_PARAM;

/**
 * The API OAuth2 endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const OAUTH = BACKEND_URL + "/oauth";

/**
 * The API OAuth2 token check endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const OAUTH_CHECK_TOKEN = OAUTH + "/check_token";

/**
 * The endpoint for authorities.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const AUTHORITIES = API + "/authorities";

/**
 * The endpoint for keys.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const KEYS = API + "/keys";

/**
 * The endpoint for categories.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const CATEGORIES = API + "/categories";

/**
 * The endpoint for users.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const USERS = API + "/users";

/**
 * The endpoint for tags.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.18.0
 */
export const TAGS = API + "/tags";

/**
 * The endpoint for user groups.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const USER_GROUPS = API + "/groups";

/**
 * The endpoint for a authority as compiled template.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.11.0
 */
export const AUTHORITY = _.template(AUTHORITIES + AUTHORITY_NAME);

/**
 * The endpoint for user groups as compiled template.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.9.0
 */
export const USER_GROUP = _.template(USER_GROUPS + USER_GROUP_ID);

/**
 * The endpoint for a category as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const CATEGORY = _.template(CATEGORIES + CATEGORY_ID);


/**
 * The endpoint for key category user groups as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const CATEGORY_GROUPS = _.template(CATEGORIES + CATEGORY_ID + "/groups");

/**
 * The endpoint for the key category keys as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const CATEGORY_KEYS = _.template(CATEGORIES + CATEGORY_ID + "/keys");

/**
 * The endpoint for the responsible key category user as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const CATEGORY_RESPONSIBLE = _.template(CATEGORIES + CATEGORY_ID + "/responsible");

/**
 * The endpoint for moving categories
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const CATEGORY_MOVE = _.template(CATEGORIES + CATEGORY_ID + "/move");

/**
 * The endpoint for a key as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const KEY = _.template(KEYS + KEY_ID);

/**
 * The endpoint for an encrypted password
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.15.0
 */
export const ENCRYPTED_PASSWORD = _.template(KEYS + KEY_ID + "/password");

/**
 * The endpoint for the subscribers of a key
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.15.0
 */
export const KEY_SUBSCRIBERS = _.template(KEYS + KEY_ID + "/subscribers");

/**
 * The endpoint for a user as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const USER = _.template(USERS + USER_LOGIN);

/**
 * The endpoint to activate user.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const USERS_ACTIVATE = USERS + "/activate";

/**
 * The endpoint to deactivate user.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const USERS_DEACTIVATE = USERS + "/deactivate";

/**
 * The endpoint to register new user.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const USERS_REGISTER = USERS + "/register";

/**
 * The endpoint to reset user passwords.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const USERS_PASSWORD_RESET = USERS + "/reset_password";

/**
 * The endpoint to reset user public keys.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const USERS_PUBLICKEY_RESET = USERS + "/reset_publickey";

/**
 * The endpoint for authorities of a user as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const USER_AUTHORITIES = _.template(USERS + USER_LOGIN + "/authorities");

/**
 * The endpoint for user keys as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const USER_KEYS = _.template(USERS + USER_LOGIN + "/keys");

/**
 * The endpoint for user group users as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.8.0
 */
export const USER_GROUPS_USERS = _.template(USER_GROUPS + USER_GROUP_ID + "/users");

/**
 * The endpoint for a tag as compiled template.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.18.0
 */
export const TAG = _.template(TAGS + TAG_ID);
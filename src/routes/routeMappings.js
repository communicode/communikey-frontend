import {
  ADMINISTRATION_USER_GROUPS,
  ADMINISTRATION_USERS,
  DASHBOARD,
  KEYS,
  CATEGORIES,
  VARIABLE_ID,
  SIGNIN,
  SIGNOUT,
  ROOT,
  WIZARD
} from "./routeConstants";

/**
 * The root route mapping.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROUTE_ROOT = ROOT;

/**
 * The route mapping for the {@link SignIn} components.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROUTE_SIGNIN = ROUTE_ROOT + SIGNIN;

/**
 * The route mapping for the {@link SignOut} components.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROUTE_SIGNOUT = ROUTE_ROOT + SIGNOUT;

/**
 * The route mapping for the {@link Dashboard} components.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROUTE_DASHBOARD = ROUTE_ROOT + DASHBOARD;

/**
 * The route mapping for the {@link UserGroupAdministration} components.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.9.0
 */
export const ROUTE_ADMINISTRATION_USER_GROUPS = ROUTE_ROOT + ADMINISTRATION_USER_GROUPS;

/**
 * The route mapping for the {@link UserAdministration} components.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROUTE_ADMINISTRATION_USERS = ROUTE_ROOT + ADMINISTRATION_USERS;

/**
 * The route mapping for the {@link Keys} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROUTE_KEYS = ROUTE_ROOT + KEYS;

/**
 * The route mapping for the {@link Keys} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const ROUTE_WIZARD = ROUTE_ROOT + WIZARD;

/**
 * The route mapping categories links
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.13.0
 */
export const ROUTE_CATEGORIES = ROUTE_ROOT + CATEGORIES;

/**
 * The deep route mapping for the {@link KeyModal} component inside {@link Keys}.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.12.0
 */
export const ROUTE_LINKED_KEY = ROUTE_ROOT + KEYS + VARIABLE_ID;

/**
 * The deep route mapping for the component inside {@link Keys}.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.13.0
 */
export const ROUTE_LINKED_CATEGORY = ROUTE_ROOT + CATEGORIES + VARIABLE_ID;
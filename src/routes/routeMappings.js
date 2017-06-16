import {
  ADMINISTRATION_USERS,
  DASHBOARD,
  KEYS,
  SIGNIN,
  SIGNOUT,
  ROOT
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

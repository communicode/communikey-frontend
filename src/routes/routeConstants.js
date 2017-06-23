const pathSeparator = "/";

/**
 * The root route name.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ROOT = pathSeparator;

/**
 * The route name of the {@link SignIn} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const SIGNIN = "signin";

/**
 * The route name of the {@link SignOut} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const SIGNOUT = "signout";

/**
 * The route name of the {@link Dashboard} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const DASHBOARD = "dashboard";

/**
 * The name of the collection for administration routes.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ADMINISTRATION = "administration";

/**
 * The route name of the {@link UserGroupAdministration} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.9.0
 */
export const ADMINISTRATION_USER_GROUPS = ADMINISTRATION + pathSeparator + "userGroups";

/**
 * The route name of the {@link UserAdministration} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ADMINISTRATION_USERS = ADMINISTRATION + pathSeparator + "users";

/**
 * The route name of the {@link Keys} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const KEYS = "keys";

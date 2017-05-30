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
 * The route name of the {@link CategoryAdministration} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ADMINISTRATION_CATEGORIES = ADMINISTRATION + pathSeparator + "categories";

/**
 * The route name of the {@link KeyAdministration} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ADMINISTRATION_KEYS = ADMINISTRATION + pathSeparator + "keys";

/**
 * The route name of the {@link UserAdministration} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const ADMINISTRATION_USERS = ADMINISTRATION + pathSeparator + "users";
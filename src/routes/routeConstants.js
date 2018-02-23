const pathSeparator = "/";
const parameterPrefix = ":";

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
 * The route name of the {@link TagAdministration} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.18.0
 */
export const ADMINISTRATION_TAGS = ADMINISTRATION + pathSeparator + "tags";

/**
 * The route name of the {@link Keys} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const KEYS = "keys";

/**
 * The route name of the {@link KeypairWizard} component.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const WIZARD = "wizard";

/**
 * A route constant for an id variable inside a route.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.12.0
 */
export const VARIABLE_ID = pathSeparator + parameterPrefix + "id";

/**
 * The route name of the {@link Keys} component for deep linked categories.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.13.0
 */
export const CATEGORIES = "categories";
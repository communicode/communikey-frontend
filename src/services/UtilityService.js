/**
 * Browser specific test case that returns true, if firefox is detected.
 * Firefox implements the InstallTrigger function which is used for installing extensions.
 * If it returns undefined, we can be sure the client is not running firefox.
 *
 *
 * @constant
 * @default
 * @type {boolean}
 * @since 0.16.0
 */
export const IS_FIREFOX = typeof InstallTrigger !== "undefined";


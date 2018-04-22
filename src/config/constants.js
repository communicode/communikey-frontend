/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {ROUTE_KEYS, ROUTE_CATEGORIES} from "../routes/routeMappings";
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
export const ERROR_KEY_NOT_FOUND = "The key has not been found. Please check the link. You may have no access to it or it doesn't exist anymore.";

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

/**
 * The link for a key.
 *
 * @type {string}
 * @since 0.15.0
 */
export const LINK_KEY = ROUTE_KEYS + pathSeparator;

/**
 * The message title for when a deep linked category wasn't found.
 *
 * @type {string}
 * @since 0.13.0
 */
export const ERROR_CATEGORY_NOT_FOUND_TITLE = "Category not found!";

/**
 * The message for when a deep linked category wasn't found.
 *
 * @type {string}
 * @since 0.13.0
 */
export const ERROR_CATEGORY_NOT_FOUND = "The category has not been found. Please check the link. You may have no access to it or it doesn't exist anymore.";

/**
 * The link for the category share button.
 *
 * @type {string}
 * @since 0.13.0
 */
export const LINK_CATEGORY_SHARE = FRONTEND_URL + ROUTE_CATEGORIES + pathSeparator;

/**
 * The link for the category breadcrumbs.
 *
 * @type {string}
 * @since 0.13.0
 */
export const LINK_CATEGORY_BREADCRUMB = ROUTE_CATEGORIES + pathSeparator;
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
import _ from "lodash";
import {TOKEN, ACCESS_TOKEN} from "./wssPathVariables";
import {WSS_ACCESS_TOKEN} from "./wssRequestParameter";

/**
 * The WSS root endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const WSS_PREFIX = "/wss";

/**
 * The WSS registry endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const WSS_REGISTRY = WSS_PREFIX + "/registry";

/**
 * The WSS registry endpoint containing the access token variable.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.15.0
 */
export const WSS_REGISTRY_TOKEN = _.template(WSS_REGISTRY + WSS_ACCESS_TOKEN + ACCESS_TOKEN);

/**
 * The WSS queue endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const QUEUE = "/queue";

/**
 * The WSS encryption job abort endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const JOB_ABORT = QUEUE + "/encryption/jobs/aborts";

/**
 * The WSS user endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const USER = "/user/queue";

/**
 * The WSS user endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const USER_REPLY = USER + "/reply";

/**
 * The WSS user error endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const USER_ERRORS = USER + "/errors";

/**
 * The WSS user job request endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const USER_JOBS = USER + "/encryption/jobs";

/**
 * The WSS category update endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_CATEGORIES = QUEUE + "/updates/categories";

/**
 * The WSS category delete endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_CATEGORIES_DELETE = UPDATES_CATEGORIES + "/delete";

/**
 * The WSS key update endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_KEYS = USER + "/updates/keys";

/**
 * The WSS key delete endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_KEYS_DELETE = UPDATES_KEYS + "/delete";

/**
 * The WSS tag update endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.18.0
 */
export const UPDATES_TAGS = QUEUE + "/updates/tags";

/**
 * The WSS tag delete endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.18.0
 */
export const UPDATES_TAGS_DELETE = UPDATES_TAGS + "/delete";

/**
 * The WSS user update endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_USERS = QUEUE + "/updates/users";

/**
 * The WSS user delete endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_USERS_DELETE = UPDATES_USERS + "/delete";

/**
 * The WSS user update endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_GROUPS = QUEUE + "/updates/groups";

/**
 * The WSS user delete endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const UPDATES_GROUPS_DELETE = UPDATES_GROUPS + "/delete";

/**
 * The WSS app endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const APP = "/app";

/**
 * The WSS jobs endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.15.0
 */
export const JOBS = APP + "/jobs";

/**
 * The WSS jobs endpoint.
 *
 * @constant
 * @default
 * @type {function}
 * @since 0.15.0
 */
export const JOB_FULFILL = _.template(JOBS + TOKEN);
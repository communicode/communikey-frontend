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
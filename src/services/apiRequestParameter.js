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
const questionMark = "?";

/**
 * The request parameter for the API OAuth2 authorization endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const API_AUTHORIZE_PARAM = questionMark + "authorize";

/**
 * The request parameter for the API "me" endpoint.
 *
 * @constant
 * @default
 * @type {string}
 * @since 0.8.0
 */
export const API_ME_PARAM = questionMark + "me";
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


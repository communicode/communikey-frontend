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
jest.mock("../../src/Communikey", () => require("./mockUtil"));
import {observable} from "mobx";
import AuthStore from "../../src/stores/AuthStore";
import AuthorityStore from "../../src/stores/AuthorityStore";
import CategoryStore from "../../src/stores/CategoryStore";
import KeyStore from "../../src/stores/KeyStore";
import UserGroupStore from "../../src/stores/UserGroupStore";
import UserStore from "../../src/stores/UserStore";
import NotificationService from "../../src/services/NotificationService";
import EventStore from "../../src/stores/EventStore";
import InvocationHelper from "../../src/stores/InvocationHelper";
import TagStore from "../../src/stores/TagStore";

export const authStore = new AuthStore();
authStore.authorities = observable(require("./data/authorities.json"));

export const authorityStore = new AuthorityStore();
authorityStore.authorities = observable(require("./data/authorities.json"));

export const categoryStore = new CategoryStore();
categoryStore.categories = observable(require("./data/categories.json"));

export const keyStore = new KeyStore();
keyStore.keys = observable(require("./data/keys.json"));

export const userGroupStore = new UserGroupStore();
userGroupStore.userGroups = observable(require("./data/groups.json"));

export const userStore = new UserStore();
userStore.users = observable(require("./data/users.json"));

export const tagStore = new TagStore();
tagStore.tags = observable(require("./data/tags.json"));

export const eventStore = new EventStore();

export const invocationHelper = new InvocationHelper();

export const stores = {authStore, authorityStore, categoryStore, keyStore, userGroupStore, userStore, eventStore, invocationHelper, tagStore};

export const notificationService = new NotificationService();

export const webSocketService = {};

export const VERSION = "0.0-code-coverage";

export const emptyFunction = () => {};
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
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {AUTHORITIES, CATEGORIES, USER_GROUP, KEYS, USERS} from "../../src/services/apiRequestMappings";

const apiService = axios.create({timeout: 5000});
var mock = new MockAdapter(apiService);

mock.onGet(AUTHORITIES).reply(function(config) {
  return [200, require('../__mockData__/data/authorities.json')];
});

mock.onGet(CATEGORIES).reply(function(config) {
  return [200, require('../__mockData__/data/categories.json')];
});

mock.onGet(USER_GROUP).reply(function(config) {
  return [200, require('../__mockData__/data/groups.json')];
});

mock.onGet(KEYS).reply(function(config) {
  return [200, require('../__mockData__/data/keys.json')];
});

mock.onGet(USERS).reply(function(config) {
  return [200, require('../__mockData__/data/users.json')];
});

export default apiService;
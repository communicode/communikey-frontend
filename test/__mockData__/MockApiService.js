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
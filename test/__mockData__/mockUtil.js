jest.mock("../../src/Communikey", () => require("./mockUtil"));
import {observable} from "mobx";
import AuthStore from "../../src/stores/AuthStore";
import AuthorityStore from "../../src/stores/AuthorityStore";
import CategoryStore from "../../src/stores/CategoryStore";
import KeyStore from "../../src/stores/KeyStore";
import UserGroupStore from "../../src/stores/UserGroupStore";
import UserStore from "../../src/stores/UserStore";

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

export const stores = {authStore, authorityStore, categoryStore, keyStore, userGroupStore, userStore};

export const VERSION = "0.0-code-coverage";

export const emptyFunction = () => {};
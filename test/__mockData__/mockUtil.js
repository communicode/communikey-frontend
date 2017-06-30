import { observable } from "mobx";

export const categories = observable(require('./data/categories.json'));
export const groups = observable(require('./data/groups.json'));
export const keys =  observable(require('./data/keys.json'));
export const users = observable(require('./data/users.json'));

export const emptyFunction = () => {};
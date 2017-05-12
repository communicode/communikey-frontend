import {observable} from "mobx";

class AuthStore {
  @observable login
  @observable oAuthToken
  @observable loggedIn
  @observable isAdmin
  @observable firstLogin

  constructor() {
    this.login = ""
    this.oAuthToken = ""
    this.loggedIn = false
    this.isAdmin = false
    this.firstLogin = true
  }
}

export let authStore = new AuthStore();
export default AuthStore;

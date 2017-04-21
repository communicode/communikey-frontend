import { autorun, observable } from "mobx"

class AuthStore {
  @observable login
  @observable oAuthToken
  @observable loggedIn
  @observable isAdmin

  constructor() {
    this.login = null
    this.oAuthToken = null
    this.loggedIn = false
    this.isAdmin = false
  }

  set login(login) {
    this.login = login;
  }

  get login() {
    return login;
  }

  set oAuthToken(oAuthToken) {
    this.oAuthToken = oAuthToken;
  }

  get oAuthToken() {
    return this.oAuthToken;
  }

  set loggedIn(loggedIn) {
    this.loggedIn = loggedIn;
  }

  get loggedIn() {
    return this.loggedIn;
  }

  set isAdmin(isAdmin) {
    this.isAdmin = isAdmin;
  }

  get isAdmin(){
    return this.isAdmin;
  }
}

export var authStore = new AuthStore()

export default AuthStore

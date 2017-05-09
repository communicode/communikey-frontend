import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect } from "react-router";
import { observer } from "mobx-react"
import { autorun } from "mobx"
import Login, { LoginConfirmation, Logout } from "./components/Login";
import Index from "./components/Index"
import Home from "./components/Home"
import Categories from "./components/Categories"
import Settings from "./components/Settings"
import About from "./components/About"
import Admin from "./components/Admin"
import { authStore } from "./stores/AuthStore"
import { userStore } from "./stores/UserStore"
import { categoryStore } from "./stores/CategoryStore"
import { groupStore } from "./stores/GroupStore"
import { authorityStore } from "./stores/AuthorityStore"
import * as constants from './util/Constants'

@observer
class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRedirect to={constants.FRONTEND_HOME} />
          <Route path={constants.FRONTEND_LOGIN} component={Login} authService={this.authService} />
          <Route path={constants.FRONTEND_LOGINCONFIRMATION} component={LoginConfirmation} authService={this.authService}/>
          <Route path={constants.FRONTEND_LOGOUT} component={Logout} authService={this.authService} />
          <Route component={Index}>
            <Route path={constants.FRONTEND_HOME} component={Home} onEnter={Home.willTransitionTo} />
            <Route path={constants.FRONTEND_CATEGORIES} component={Categories} onEnter={Categories.willTransitionTo} />
            <Route path={constants.FRONTEND_SETTINGS} component={Settings} onEnter={Settings.willTransitionTo} />
            <Route path={constants.FRONTEND_ABOUT} component={About} onEnter={About.willTransitionTo} />
            <Route path={constants.FRONTEND_ADMIN} component={Admin} onEnter={Admin.willTransitionTo} />
          </Route>
       </Route>
       <Route>
         <Route path={constants.FRONTEND_ADMIN} component={Index} />
       </Route>
    </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))

autorun(() => {
  if(authStore.loggedIn && authStore.firstLogin) {
    authorityStore.fetchAuthorities();
    categoryStore.fetchCategories();
    groupStore.fetchGroups();
    userStore.fetchUsers();
    authStore.firstLogin = false;
  }
});

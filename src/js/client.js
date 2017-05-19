import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { useStrict } from 'mobx';
import {Provider} from "mobx-react";
import { Router, Route, browserHistory, IndexRedirect } from "react-router";
import Login, { LoginConfirmation, Logout } from "./components/Login";
import Index from "./components/Index"
import Home from "./components/Home"
import Keys from "./components/Keys"
import Settings from "./components/Settings"
import About from "./components/About"
import UserManagement from "./components/management/UserManagement"
import CategoryManagement from "./components/management/CategoryManagement"
import KeyManagement from "./components/management/KeyManagement"
import {categoryStore} from "./stores/CategoryStore";
import {keyStore} from "./stores/KeyStore";
import {userStore} from "./stores/UserStore";
import * as constants from './util/Constants'

useStrict(true);

const stores = {categoryStore, keyStore, userStore};

class App extends React.Component {
  constructor() {
    super();
    categoryStore.fetchCategories();
    keyStore.fetchKeys();
    userStore.fetchUsers();
  }

  render() {
    return (
      <Provider {... stores}>
        <Router history={browserHistory}>
          <Route path="/">
            <IndexRedirect to={constants.FRONTEND_HOME} />
            <Route path={constants.FRONTEND_LOGIN} component={Login} authService={this.authService} />
            <Route path={constants.FRONTEND_LOGINCONFIRMATION} component={LoginConfirmation} authService={this.authService}/>
            <Route path={constants.FRONTEND_LOGOUT} component={Logout} authService={this.authService} />
            <Route component={Index}>
              <Route path={constants.FRONTEND_HOME} component={Home} onEnter={Home.willTransitionTo} />
              <Route path={constants.FRONTEND_KEYS} component={Keys} onEnter={Keys.willTransitionTo} />
              <Route path={constants.FRONTEND_SETTINGS} component={Settings} onEnter={Settings.willTransitionTo} />
              <Route path={constants.FRONTEND_ABOUT} component={About} onEnter={About.willTransitionTo} />
              <Route path={constants.FRONTEND_MANAGEMENT + "/" + constants.FRONTEND_USER} component={UserManagement} onEnter={UserManagement.willTransitionTo}/>
              <Route path={constants.FRONTEND_MANAGEMENT + "/" + constants.FRONTEND_CATEGORY} component={CategoryManagement} onEnter={CategoryManagement.willTransitionTo} />
              <Route path={constants.FRONTEND_MANAGEMENT + "/" + constants.FRONTEND_KEY} component={KeyManagement} onEnter={KeyManagement.willTransitionTo} />
            </Route>
          </Route>
          <Route>
            <Route path={constants.FRONTEND_ADMIN} component={Index} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

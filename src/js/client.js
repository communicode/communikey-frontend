import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect } from "react-router";
import { observer } from "mobx-react"
import { autorun } from "mobx"

import { authService } from './util/AuthService';
import Login, { LoginConfirmation } from "./components/Login";
import Index from "./components/Index"
import Home from "./components/Home"
import Categories from "./components/Categories"
import Settings from "./components/Settings"
import About from "./components/About"
import Admin from "./components/Admin"
import { authStore } from "./stores/AuthStore"
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
          <Route path={constants.FRONTEND_LOGIN} component={Login} authService={this.authService}/>
          <Route path={constants.FRONTEND_LOGINCONFIRMATION} component={LoginConfirmation} authService={this.authService} />
          <Route component={Index} >
            <Route path={constants.FRONTEND_HOME} component={Home} onEnter={Home.willTransitionTo} />
            <Route path={constants.FRONTEND_CATEGORIES} component={Categories} onEnter={Categories.willTransitionTo} />
            <Route path={constants.FRONTEND_SETTINGS} component={Settings} onEnter={Settings.willTransitionTo} />
            <Route path={constants.FRONTEND_ABOUT} component={About} onEnter={About.willTransitionTo} />
            <Route path={constants.FRONTEND_ADMIN} component={Admin} onEnter={Admin.willTransitionTo} />
          </Route>
       </Route>
       <Route onEnter={this.requireAdminAuth}>
         <Route path={constants.FRONTEND_ADMIN} component={Index} />
       </Route>
    </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))

autorun(() => {
  console.log("Change!");
});

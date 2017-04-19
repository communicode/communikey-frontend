import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect } from "react-router";

import AuthService from './util/AuthService';
import Login, { LoginConfirmation } from "./components/Login";
import Index from "./components/Index"
import Home from "./components/Home"
import Categories from "./components/Categories"
import Settings from "./components/Settings"
import About from "./components/About"
import Admin from "./components/Admin"

const loggedIn = true;
const isAdmin = false;

const requireAdminAuth = (nextState, replace) => {
  if (!isAdmin) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const requireAuth = (nextState, replace) => {
  if (!loggedIn) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

class App extends React.Component {
  authService = new AuthService();
  constructor() {
    super();
    this.authService = new AuthService();
  }

  requireAuth(nextState, replace) {
    // if(this.authService.isLoggedIn()) {
    //   replace({
    //             pathname: '/login',
    //             state: { nextPathname: nextState.location.pathname }
    //           })
    // }
  }

  requireAdminAuth(nextState, replace) {
    // if(this.authService.isAdmin()) {
    //   replace({
    //             pathname: '/login',
    //             state: { nextPathname: nextState.location.pathname }
    //           })
    // }
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRedirect to="home" />
          <Route path={"login"} component={Login} />
          <Route path={"loginConfirmation"} component={LoginConfirmation} authService={this.authService}/>
          <Route onEnter={this.requireAuth}>
            <Route component={Index} onEnter={requireAuth}>
              <Route path={"home"} component={Home} authService={this.authService}/>
              <Route path={"categories"} component={Categories} />
              <Route path={"settings"} component={Settings} />
              <Route path={"about"} component={About} />
              <Route path={"admin"} component={Admin} />
            </Route>
          </Route>
       </Route>
       <Route onEnter={this.requireAdminAuth}>
         <Route path={"admin"} component={Index} authService={this.authService}/>
       </Route>
    </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))

import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect } from "react-router";
import Login, { LoginConfirmation } from "./components/Login";
import Index from "./components/Index"
import AuthService from './util/AuthService';

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
          <IndexRedirect to="home"/>
          <Route path={"login"} component={Login} authService={this.authService}/>
          <Route path={"loginConfirmation"} component={LoginConfirmation} authService={this.authService}/>
          <Route onEnter={this.requireAuth}>
            <Route path={"home"} component={Index} authService={this.authService}/>
          </Route>
          <Route onEnter={this.requireAdminAuth}>
            <Route path={"admin"} component={Index} authService={this.authService}/>
          </Route>
        </Route>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))

import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect } from "react-router";

import Login from "./components/Login";
import Index from "./components/Index"

const loggedIn = true;
const isAdmin = true;

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
    render() {
        return (
          <Router history={browserHistory}>
              <Route path="/">
                  <IndexRedirect to="home" />
                  <Route path={"login"} component={Login} />
                  <Route onEnter={requireAuth}>
                      <Route path={"home"} component={Index} />
                  </Route>
                  <Route onEnter={requireAdminAuth}>
                      <Route path={"admin"} component={Index} />
                  </Route>
              </Route>
          </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))

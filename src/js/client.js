import '../../semantic/dist/semantic.min.css';
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";

import Layout from "./components/Layout/Layout";
import Login from "./components/Login";
import Index from "./components/Index"

class App extends React.Component {
    render() {
        return (
          <Router history={browserHistory}>
              <Route path={"login"} component={Login} />
              <Route path={"/index"} component={Index} />
          </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))

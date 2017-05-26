import React from "react";
import ReactDOM from "react-dom";
import {useStrict} from "mobx";
import {Provider} from "mobx-react";
import {BrowserRouter, Route, Switch, Link, Redirect} from "react-router-dom";
import Login, {LoginConfirmation} from "./routes/Login";
import Logout from "./routes/Logout";
import Index from "./components/Index"
import {authStore} from "./stores/AuthStore";
import {categoryStore} from "./stores/CategoryStore";
import {keyStore} from "./stores/KeyStore";
import {userStore} from "./stores/UserStore";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

useStrict(true);

const stores = {authStore, categoryStore, keyStore, userStore};

/**
 * A simple centralized, cross-platform credential manager.
 *
 * This class is the main application layout including routes and injected MobX stores.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 */
class Communikey extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuthorized: localStorage.getItem("access_token") !== null
    }
  }

  /**
   * Sets the authorization status in the state on successful redirection.
   *
   * @since 0.7.0
   */
  handleLoginConfirmationRedirect = (newStatus) => {
    this.setState({isAuthorized: newStatus})
  };

  render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/loginConfirmation" render={props => {
              return <LoginConfirmation onRedirect={this.handleLoginConfirmationRedirect} {...props}/>;
            }}/>
            <Route path="/logout" component={Logout}/>
            <AuthenticatedRoute exact path="/" component={Index} isAuthorized={this.state.isAuthorized}/>
            <Route render={() => {
              return this.state.isAuthorized ? <Redirect to="/"/> : <Redirect to="/login"/>;
            }}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<Communikey/>, document.getElementById("communikey"));









/*class Communikey extends React.Component {
  constructor() {
    super();
  }


  render() {

    const renderRouter = () => (
      <Provider {...stores}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route path="/login" component={Login}/>
            <Route path="/loginConfirmation" component={LoginConfirmation}/>
            <Route path="/logout" component={Logout}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );

    return renderRouter();
  }
}*/

/*
<Provider {...stores}>
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRedirect to={constants.FRONTEND_HOME}/>
      <Route path={constants.FRONTEND_LOGIN} component={Login}/>
      <Route path={constants.FRONTEND_LOGINCONFIRMATION} component={LoginConfirmation}/>
      <Route path={constants.FRONTEND_LOGOUT} component={Logout}/>
      <Route component={Index}>
        <Route path={constants.FRONTEND_HOME} component={Home} onEnter={Home.willTransitionTo}/>
        <Route path={constants.FRONTEND_KEYS} component={Keys} onEnter={Keys.willTransitionTo}/>
        <Route path={constants.FRONTEND_USER_DASHBOARD} component={UserDashboard} onEnter={UserDashboard.willTransitionTo}/>
        <Route path={constants.FRONTEND_CATEGORY_DASHBOARD} component={CategoryDashboard} onEnter={CategoryDashboard.willTransitionTo}/>
        <Route path={constants.FRONTEND_KEY_DASHBOARD} component={KeyDashboard} onEnter={KeyDashboard.willTransitionTo}/>
      </Route>
    </Route>
    <Route>
      <Route path={constants.FRONTEND_ADMIN} component={Index}/>
    </Route>
  </Router>
</Provider>*/

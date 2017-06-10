import React from "react";
import ReactDOM from "react-dom";
import {Provider, observer} from "mobx-react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {LocaleProvider, Spin} from "antd";
import QueueAnim from "rc-queue-anim";
import {useStrict} from "mobx";
import BaseLayout from "./BaseLayout";
import AuthService from "./services/AuthService";
import AuthenticatedRoute from "./components/hoc/AuthenticatedRoute";
import PublicRoute from "./components/hoc/PublicRoute";
import SignIn from "./routes/SignIn";
import SignOut from "./routes/SignOut";
import CategoryAdministration from "./routes/administration/CategoryAdministration";
import KeyAdministration from "./routes/administration/KeyAdministration";
import UserAdministration from "./routes/administration/UserAdministration";
import Dashboard from "./routes/Dashboard";
import Keys from "./routes/Keys";
import {authStore} from "./stores/AuthStore";
import {categoryStore} from "./stores/CategoryStore";
import {keyStore} from "./stores/KeyStore";
import {userStore} from "./stores/UserStore";
import appConfig from "./config/app";
import motionConfig from "./config/motion";
import {
  ROUTE_ADMINISTRATION_CATEGORIES,
  ROUTE_ADMINISTRATION_KEYS,
  ROUTE_ADMINISTRATION_USERS,
  ROUTE_DASHBOARD,
  ROUTE_KEYS,
  ROUTE_SIGNIN,
  ROUTE_SIGNOUT,
  ROUTE_ROOT
} from "./routes/routeMappings";
import enUS from "antd/lib/locale-provider/en_US";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "./config/constants";
import "antd/lib/spin/style/index.less";

useStrict(true);

/**
 * The wrapper for all store instances to be injected via a MobX {@linkplain Provider} components.
 *
 * @type {Object.<{Object}>} stores
 */
const stores = {authStore, categoryStore, keyStore, userStore};

/**
 * The communikey version.
 * The value can be injected through the {@linkcode COMMUNIKEY_VERSION} environment variable during the compile time.
 *
 * @constant
 * @default local-dev
 * @type {string}
 * @since 0.6.0
 */
export const VERSION = process.env.COMMUNIKEY_VERSION || "local-dev";

/**
 * A simple centralized, cross-platform credential manager.
 *
 * This is the main application class with the base layout, routes and injected MobX stores.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 */
@observer
class Communikey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initialized: false};
  }

  componentDidMount() {
    localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) && AuthService.validateLocalStorageOAuth2AccessToken()
      .then(() => stores.authStore.setIsAuthorized(true))
      .catch(error => console.error(error));
    this.setState({initialized: true});
  }

  render() {
    const spinner = () => <div className="cckey-layout-center-div"><Spin spinning={true} size="large"/></div>;
    const routes = () => {
      return <Provider {...stores}>
        <LocaleProvider locale={enUS}>
          <BrowserRouter>
            <Switch>
              <Route path={ROUTE_SIGNOUT} component={SignOut}/>
              <PublicRoute path={ROUTE_SIGNIN} component={SignIn} authorized={stores.authStore.isAuthorized}/>
              <BaseLayout>
                <Route render={({location}) => {
                  return (
                    <QueueAnim
                      delay={motionConfig.routes.delay}
                      duration={motionConfig.routes.duration}
                      ease={motionConfig.routes.ease}
                      type={motionConfig.routes.type}
                    >
                      <Switch key={location.key} location={location}>
                        <AuthenticatedRoute path={ROUTE_DASHBOARD} component={Dashboard} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_ADMINISTRATION_CATEGORIES} component={CategoryAdministration}
                                            authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_ADMINISTRATION_KEYS} component={KeyAdministration} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_ADMINISTRATION_USERS} component={UserAdministration} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_KEYS} component={Keys} authorized={stores.authStore.isAuthorized}/>
                        <Redirect from={ROUTE_ROOT} to={ROUTE_DASHBOARD}/>
                      </Switch>
                    </QueueAnim>
                  );
                }}/>
              </BaseLayout>
            </Switch>
          </BrowserRouter>
        </LocaleProvider>
      </Provider>;
    };

    return this.state.initialized ? routes() : spinner();
  }
}

ReactDOM.render((<Communikey/>), document.getElementById(appConfig.name));

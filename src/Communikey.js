/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from "react";
import ReactDOM from "react-dom";
import {Provider, observer} from "mobx-react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {LocaleProvider, Spin} from "antd";
import QueueAnim from "rc-queue-anim";
import {useStrict} from "mobx";
import BaseLayout from "./BaseLayout";
import AuthService from "./services/AuthService";
import NotificationService from "./services/NotificationService";
import EncryptionService from "./services/EncryptionService";
import WebSocketService from "./services/WebSocketService";
import CrowdEncryptionService from "./services/CrowdEncryptionService";
import LiveEntityUpdateService from "./services/LiveEntityUpdateService";
import AuthenticatedRoute from "./components/hoc/AuthenticatedRoute";
import AuthenticatedPrivilegedRoute from "./components/hoc/AuthenticatedPrivilegedRoute";
import PublicForwardRoute from "./components/hoc/PublicForwardRoute";
import KeyDeepLinkAuthenticatedRoute from "./components/hoc/KeyDeepLinkAuthenticatedRoute";
import CategoryDeepLinkAuthenticatedRoute from "./components/hoc/CategoryDeepLinkAuthenticatedRoute";
import SignIn from "./routes/SignIn";
import SignOut from "./routes/SignOut";
import UserAdministration from "./routes/administration/UserAdministration";
import UserGroupAdministration from "./routes/administration/UserGroupAdministration";
import TagAdministration from "./routes/administration/TagAdministration";
import Dashboard from "./routes/Dashboard";
import Keys from "./routes/Keys";
import AuthorityStore from "./stores/AuthorityStore";
import AuthStore from "./stores/AuthStore";
import CategoryStore from "./stores/CategoryStore";
import KeyStore from "./stores/KeyStore";
import UserGroupStore from "./stores/UserGroupStore";
import UserStore from "./stores/UserStore";
import TagStore from "./stores/TagStore";
import EncryptionJobStore from "./stores/EncryptionJobStore";
import EventStore from "./stores/EventStore";
import InvocationHelper from "./stores/InvocationHelper";
import appConfig from "./config/app";
import motionConfig from "./config/motion";
import {
  ROUTE_ADMINISTRATION_USERS,
  ROUTE_ADMINISTRATION_USER_GROUPS,
  ROUTE_ADMINISTRATION_TAGS,
  ROUTE_DASHBOARD,
  ROUTE_KEYS,
  ROUTE_LINKED_KEY,
  ROUTE_LINKED_CATEGORY,
  ROUTE_SIGNIN,
  ROUTE_SIGNOUT,
  ROUTE_ROOT,
  ROUTE_WIZARD
} from "./routes/routeMappings";
import enUS from "antd/lib/locale-provider/en_US";
import {LOCAL_STORAGE_ACCESS_TOKEN} from "./config/constants";
import "antd/lib/spin/style/index.less";
useStrict(true);

/**
 * The authentication store instance.
 *
 * @type {AuthStore}
 * @since 0.9.0
 */
export const authStore = new AuthStore();

/**
 * The authority store instance.
 *
 * @type {AuthorityStore}
 * @since 0.11.0
 */
export const authorityStore = new AuthorityStore();

/**
 * The category store instance.
 *
 * @type {CategoryStore}
 * @since 0.9.0
 */
export const categoryStore = new CategoryStore();

/**
 * The key store instance.
 *
 * @type {KeyStore}
 * @since 0.9.0
 */
export const keyStore = new KeyStore();

/**
 * The user group store instance.
 *
 * @type {UserGroupStore}
 * @since 0.9.0
 */
export const userGroupStore = new UserGroupStore();

/**
 * The user store instance.
 *
 * @type {UserStore}
 * @since 0.9.0
 */
export const userStore = new UserStore();

/**
 * The encryption job store instance.
 *
 * @type {EncryptionJobStore}
 * @since 0.15.0
 */
export const encryptionJobStore = new EncryptionJobStore();


/**
 * The event store instance.
 *
 * @type {EventStore}
 * @since 0.15.0
 */
export const eventStore = new EventStore();

/**
 * The invocation helper instance
 *
 * @type {LiveEntityUpdateService}
 * @since 0.15.0
 */
export const invocationHelper = new InvocationHelper();

/**
 * The tag store instance.
 *
 * @type {TagStore}
 * @since 0.18.0
 */
export const tagStore = new TagStore();

/**
 * The wrapper for all store instances to be injected via a MobX {@linkplain Provider} components.
 *
 * @type {Object.<{AuthorityStore}, {AuthStore}, {CategoryStore}, {KeyStore},
 *       {UserGroupStore}, {UserStore}, {EncryptionJobStore}, {EventStore}, {InvocationHelper}>}
 */
const stores = {authorityStore, authStore, categoryStore, keyStore, userGroupStore, userStore, encryptionJobStore, eventStore, invocationHelper, tagStore};

/**
 * The notification service instance.
 *
 * @type {NotificationService}
 * @since 0.13.0
 */
export const notificationService = new NotificationService();

/**
 * The encryption service instance.
 *
 * @type {EncryptionService}
 * @since 0.15.0
 */
export const encryptionService = new EncryptionService();

/**
 * The websocket service instance
 *
 * @type {WebSocketService}
 * @since 0.15.0
 */
export const webSocketService = new WebSocketService();

/**
 * The crowd encryption logic service instance
 *
 * @type {CrowdEncryptionService}
 * @since 0.15.0
 */
export const crowdEncryptionService = new CrowdEncryptionService();

/**
 * The live entity update service instance
 *
 * @type {LiveEntityUpdateService}
 * @since 0.15.0
 */
export const liveEntityUpdateService = new LiveEntityUpdateService();

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
    this.state = {
      initialized: false,
      passphraseNeeded: false
    };
    encryptionService.passphraseNeeded = (this.setPassphraseNeeded);
  }

  setPassphraseNeeded = (state, resolve, reject) => {
    this.setState({
      passphraseNeeded: state,
      passphraseNeededResolve: resolve,
      passphraseNeededReject: reject
    });
  };

  onPassphraseModalClose = () => {
    this.setState({
      passphraseNeeded: false
    });
  };

  componentDidMount() {
    localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) && AuthService.validateLocalStorageOAuth2AccessToken()
      .then(() => stores.authStore._setIsAuthorized(true))
      .catch(error => console.error(error));
    this.setState({initialized: true});
    window.addEventListener("beforeunload", this.keepOnPage);
  }

  keepOnPage = () => {
    webSocketService.initialized && webSocketService.close();
  };

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.keepOnPage);
  }

  render() {
    const spinner = () => <div className="cckey-layout-center-div"><Spin spinning={true} size="large"/></div>;
    const routes = () => {
      return <Provider {...stores}>
        <LocaleProvider locale={enUS}>
          <BrowserRouter>
            <Switch>
              <Route path={ROUTE_SIGNOUT} component={SignOut}/>
              <PublicForwardRoute path={ROUTE_SIGNIN} component={SignIn} authorized={stores.authStore.isAuthorized}/>
              <BaseLayout
                passphraseNeeded={this.state.passphraseNeeded}
                passphraseNeededResolve={this.state.passphraseNeededResolve}
                passphraseNeededReject={this.state.passphraseNeededReject}
                onPassphraseModalClose={this.onPassphraseModalClose}
              >
                <Route render={({location}) => {
                  return (
                    <QueueAnim
                      delay={motionConfig.routes.delay}
                      duration={motionConfig.routes.duration}
                      ease={motionConfig.routes.ease}
                      type={motionConfig.routes.type}
                    >
                      <Switch key={location.key} location={location}>
                        <AuthenticatedRoute exact path={ROUTE_ROOT} component={Dashboard} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_DASHBOARD} component={Dashboard} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_WIZARD} component={Dashboard} openWizard={true} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedPrivilegedRoute
                          path={ROUTE_ADMINISTRATION_USERS}
                          component={UserAdministration}
                          authorized={stores.authStore.isAuthorized}
                          privileged={stores.authStore.privileged}
                        />
                        <AuthenticatedPrivilegedRoute
                          path={ROUTE_ADMINISTRATION_USER_GROUPS}
                          component={UserGroupAdministration}
                          authorized={stores.authStore.isAuthorized}
                          privileged={stores.authStore.privileged}
                        />
                        <AuthenticatedPrivilegedRoute
                          path={ROUTE_ADMINISTRATION_TAGS}
                          component={TagAdministration}
                          authorized={stores.authStore.isAuthorized}
                          privileged={stores.authStore.privileged}
                        />
                        <KeyDeepLinkAuthenticatedRoute path={ROUTE_LINKED_KEY} component={Keys} authorized={stores.authStore.isAuthorized}/>
                        <CategoryDeepLinkAuthenticatedRoute path={ROUTE_LINKED_CATEGORY} component={Keys} authorized={stores.authStore.isAuthorized}/>
                        <AuthenticatedRoute path={ROUTE_KEYS} component={Keys} authorized={stores.authStore.isAuthorized}/>
                      </Switch>
                    </QueueAnim>
                  );
                }}/>
              </BaseLayout>
              <Redirect from={ROUTE_ROOT} to={ROUTE_DASHBOARD}/>
            </Switch>
          </BrowserRouter>
        </LocaleProvider>
      </Provider>;
    };

    return this.state.initialized ? routes() : spinner();
  }
}

ReactDOM.render((<Communikey/>), document.getElementById(appConfig.name));

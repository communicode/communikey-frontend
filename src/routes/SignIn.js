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
import AuthService from "./../services/AuthService";
import {inject, observer, PropTypes as MobxPropTypes} from "mobx-react";
import keydown, {Keys} from "react-keydown";
import {Button, Form, Icon, Input, Tooltip} from "antd";
import appConfig from "../config/app";
import {VERSION} from "./../Communikey";
import {AUTH_STORE} from "../stores/storeConstants";
import {LOGIN_INFORMATION_TEXT} from "../config/constants";
import "antd/lib/button/style/index.less";
import "antd/lib/row/style/css";
import "antd/lib/form/style/index.less";
import "antd/lib/input/style/index.less";
import "./SignIn.less";

/**
 * The sign in for the application.
 *
 * @author dvonderbey@communicode.de
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.3.0
 */
const ManagedForm = Form.create()(
  (props) => {
    const {form, handleSubmit, signInFailed, login} = props;
    const {getFieldDecorator} = form;
    const suffix = login
      ? <Icon type="close-circle" onClick={this.resetLoginInputValue}/>
      : <Tooltip title={LOGIN_INFORMATION_TEXT}><Icon type="info-circle-o"/> </Tooltip>;

    return (
      <Form hideRequiredMark={true}>
        <div>
          <Form.Item
            validateStatus={form.getFieldError("login") || signInFailed ? "error"  : ""}
            colon={false}
          >
            {getFieldDecorator("login", {
              rules: [{required: true, message: "Email is required"}]
            })(
            <Input
              name="login"
              suffix={suffix}
              prefix={<Icon type="mail"/>}
              addonAfter={appConfig.EMAIL_PREFIX}
              placeholder="Email"
              onPressEnter={handleSubmit}
            />)
            }
          </Form.Item>
          <Form.Item
            validateStatus={form.getFieldError("password") || signInFailed ? "error" : ""}
            colon={false}
          >
            {getFieldDecorator("password", {
              rules: [{required: true, message: "Password is required"}]
            })(
              <Input
                name="password"
                prefix={<Icon type="lock"/>}
                type="password"
                placeholder="Password"
                onPressEnter={handleSubmit}
              />)
            }
          </Form.Item>
        </div>
      </Form>
    );
  }
);

@inject(AUTH_STORE) @observer
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * @type {string} login - The login of the user
       */
      login: "",

      /**
       * @type {string} password - The password of the user
       */
      password: "",

      /**
       * @type {boolean} processing - The current processing status
       */
      processing: false,

      /**
       * @type {boolean} signInFailed - The status of the last request
       */
      signInFailed: false
    };
  }

  /**
   * Authorizes the user and populates the local storage and {@link AuthStore} on success.
   *
   * @since 0.8.0
   */
  signIn = (login, password) => {
    this.setState({processing: true});
    AuthService.getOAuth2AccessToken(login, password)
      .then(oAuth2Data => {
        Object.entries(oAuth2Data).map(([key, value]) => localStorage.setItem(key, value));
        this.props.authStore.fetch()
          .catch(error => console.error(error));
      })
      .catch(() => {
        this.setState({
          processing: false,
          signInFailed: true
        });
      });
  };

  /**
   * Handles the action button click event.
   *
   * @since 0.15.0
   */
  handleSubmit = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      this.setState({processing: true});
      this.signIn(payload.login, payload.password);
    }
  });

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.15.0
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Calls the signIn function.
   *
   * @since 0.12.0
   */
  @keydown(Keys.ENTER)
  signInOnKeyPress() {
    this.handleSubmit();
  }

  /**
   * Resets the value of the login input.
   *
   * @since 0.8.0
   */
  resetLoginInputValue = () => {
    this.loginInput.focus();
    this.setState({login: ""});
  };

  render() {
    const {login, processing} = this.state;
    const footer = () => (
      <footer className="cckey-signin-footer-container">
        <p>version {VERSION}</p>
        <p>Made with <Icon type="heart" className="heart"/> by <a href="https://communicode.de">communicode</a></p>
      </footer>
    );

    return (
      <div className="cckey-signin-form-wrapper">
        <div className="form">
          <div className="logo">
            <img src={appConfig.assets.logoLightDropshadow}/>
          </div>
          <p className="app-title">{appConfig.name}</p>
          <ManagedForm
            ref={this.saveManagedFormRef}
            handleSubmit={this.handleSubmit}
            signInFailed={this.state.signInFailed}
            login={login}
          />
          <Button
            type="primary"
            size="large"
            onClick={this.handleSubmit}
            loading={processing}
          >
            Sign in
          </Button>
        </div>
        {footer()}
      </div>
    );
  }
}

export default SignIn;

SignIn.propTypes = {
  /**
   * @type {ObservableArray} authStore - The injected authentication store
   */
  authStore: MobxPropTypes.observableArray
};

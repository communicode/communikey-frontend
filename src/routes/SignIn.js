import React from "react";
import AuthService from "./../services/AuthService";
import {inject, observer, PropTypes as MobxPropTypes} from "mobx-react";
import {Button, Form, Icon, Input, Row} from "antd";
import appConfig from "../config/app";
import {AUTH_STORE} from "../stores/storeConstants";
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
 * @since 0.3.0
 */
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
      processing: false
    };
  }

  /**
   * Authorizes the user and populates the local storage and {@link AuthStore} on success.
   *
   * @since 0.8.0
   */
  signIn = () => {
    this.setState({processing: true});
    AuthService.getOAuth2AccessToken(this.state.login, this.state.password)
      .then(oAuth2Data => {
        Object.entries(oAuth2Data).map(([key, value]) => localStorage.setItem(key, value));
        this.props.authStore.fetch()
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error))
      .then(() => this.setState({processing: false}));
  };

  /**
   * Resets the value of the login input.
   *
   * @since 0.8.0
   */
  resetLoginInputValue = () => {
    this.loginInput.focus();
    this.setState({login: ""});
  };

  /**
   * Handles all input value change events.
   *
   * @param event - The change event
   * @since 0.8.0
   */
  handleInputChange = (event) => this.setState({[event.target.name]: event.target.value});

  render() {
    const {login, processing} = this.state;
    const suffix = login ? <Icon type="close-circle" onClick={this.resetLoginInputValue}/> : null;

    return (
      <div className="form">
        <div className="logo">
          <img src={appConfig.assets.logoLightDropshadow}/>
        </div>
        <p className="app-title">{appConfig.name}</p>
        <Form>
          <Form.Item>
            <Input
              name="login"
              prefix={<Icon type="mail"/>}
              addonAfter={appConfig.EMAIL_PREFIX}
              onChange={this.handleInputChange}
              placeholder="Email"
              value={login}
              suffix={suffix}
              ref={node => this.loginInput = node}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="password"
              prefix={<Icon type="lock"/>}
              type="password"
              onChange={this.handleInputChange}
              placeholder="Password"
            />
          </Form.Item>
          <Row>
            <Button type="primary" size="large" onClick={this.signIn} loading={processing}>Sign in</Button>
          </Row>
        </Form>
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
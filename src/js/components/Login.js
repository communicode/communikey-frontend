import React from "react";
import { Loader, Segment, Button, Divider, Input, Image } from "semantic-ui-react";
import "../../css/components/Login.css";
import { authService } from '../util/AuthService';
import * as constants from '../util/Constants';
import { authStore } from "../stores/AuthStore"
import { browserHistory } from 'react-router';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

  handleKeyPress = (event) => {
    if(event.key == 'Enter') {
      authService.login(this.state.username, this.state.password);
    }
  }

  handleClick = () => {
    authService.login(this.state.username, this.state.password);
  }

  handleUsernameChange(e) {
    const username = e.target.value;
    this.state.username = username;
  }

  handlePasswordChange(e) {
    const password = e.target.value;
    this.state.password = password;
  }

  render() {
    return (
      <div>
        <Image
          src='../../img/communikey-logo_transparent.svg'
          height="300px"
          class="centerHorizontal"
          id="logo"
        />
        <div class="AuthenticationPanel">
          <Segment padded>
            <div class="login">
              <Input
                label={{ basic: true, content: '@communicode.de' }}
                labelPosition='right'
                placeholder='E-Mail'
                fluid
                ref="email"
                onChange={this.handleUsernameChange.bind(this)}
                onKeyPress={this.handleKeyPress}
              />
              <br />
              <Input
                id="password"
                fluid
                icon='key'
                placeholder='Password...'
                ref="password"
                type="password"
                onChange={this.handlePasswordChange.bind(this)}
                onKeyPress={this.handleKeyPress}
              />
              <br />
              <Button primary fluid onClick={this.handleClick}>Login</Button>
            </div>
          </Segment>
          <p class="lover">Made with ♡ in Essen</p>
        </div>
      </div>
    );
  }
}

export class LoginConfirmation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var hash = this.props.location.hash.replace('#','');
    var hashParams = hash.split('&');
    for(var i = 0; i< hashParams.length; i++) {
      var param = hashParams[i].split('=')
      if(param[0] == 'access_token') {
        if(param[1] == '') {
          browserHistory.push(constants.PROTOCOL + constants.FRONTEND + "/login");
        }
        localStorage.setItem('access_token', param[1]);
        authStore.oAuthToken = param[1];
      } else if(param[0] == 'token_type') {
        localStorage.setItem('token_type', param[1]);
      } else if(param[0] == 'expires_in') {
        localStorage.setItem('expires_in', param[1]);
      }
    }
    browserHistory.push(constants.PROTOCOL + constants.FRONTEND + "/home");
    return (
      <div>
        <Loader size='large'>Loading</Loader>
      </div>
    );
  }
}

export class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    authService.logout();
    browserHistory.push(constants.PROTOCOL + constants.FRONTEND + "/" + constants.FRONTEND_LOGIN);
    return (
      <div>
        <Loader size='large'>Loading</Loader>
      </div>
    );
  }
}

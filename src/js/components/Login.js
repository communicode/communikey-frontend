import React from "react";
import { Segment, Button, Divider, Input, Image } from "semantic-ui-react";
import "../../css/components/Login.css";

export default class Login extends React.Component {
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
                          />
                          <br />
                          <Input
                              id="password"
                              fluid icon='key'
                              placeholder='Password...'
                              ref="password"
                              type="password"
                          />
                          <br />
                          <Button primary fluid>Login</Button>
                      </div>
                      <Divider horizontal>Or</Divider>
                      <div class="register">
                          <Input
                              label={{ basic: true, content: '@communicode.de' }}
                              labelPosition='right'
                              placeholder='E-Mail'
                              fluid
                              ref="registerEmail"
                          />
                          <br />
                          <Input
                              id="password"
                              fluid
                              icon='key'
                              placeholder='Password...'
                              ref="registerPassword"
                              type="password"
                          />
                          <br />
                          <Input
                              id="password"
                              fluid
                              icon='key'
                              placeholder='Password confirmation...'
                              ref="registerPasswordConfirmation"
                              type="password"
                          />
                          <br />
                          <Button secondary fluid>Sign Up Now</Button>
                      </div>
                  </Segment>
                  <p class="lover">Made with ♡ in Essen</p>
              </div>
          </div>
        );
    }
}

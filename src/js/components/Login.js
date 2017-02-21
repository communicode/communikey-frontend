import React from "react";
import { Segment, Button, Divider, Input, Image } from "semantic-ui-react";
import "../../css/components/Login.css";

export default class Login extends React.Component {
    render() {
        return (
          <div>
              <Image src='../../img/communikey-logo.svg' size='small' class="centerHorizontal" id="logo" />
              <div class="AuthenticationPanel">
                  <Segment padded>
                      <div class="login">
                          <Input
                              label={{ basic: true, content: '@communicode.de' }}
                              labelPosition='right'
                              placeholder='E-Mail'
                              fluid
                          />
                          <br />
                          <Input id="password" fluid icon='key' placeholder='Password...' />
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
                          />
                          <br />
                          <Input id="password" fluid icon='key' placeholder='Password...' />
                          <br />
                          <Input id="password" fluid icon='key' placeholder='Password confirmation...' />
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

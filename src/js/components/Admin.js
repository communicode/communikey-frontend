import React, { Component } from 'react'
import { Image, List, Container, Header } from 'semantic-ui-react'
import UserDetails from "./UserDetails";
import AuthenticatedRoute from "./AuthenticatedRoute";
import "../../css/components/Admin.css";

export default class Admin extends AuthenticatedRoute {
  static get privilegeRequired() {
      return true;
  }

  constructor(props) {
    super(props);
    this.state = { show : false};

    this.showUserDetails = this.showUserDetails.bind(this)
  }

  showUserDetails = () => {
    console.log("test345678");

    const {show} = this.state;
    this.setState({show : !show})
  }

  render() {
    return (
      <div>
          <Header as='h1'> Admin View </Header>
          <div>
            <List animated divided size='big' verticalAlign='middle'>
              <List.Item onClick={this.showUserDetails}>
                <Image avatar src='../../img/communikey-logo.svg' />
                <List.Content>
                  <List.Header as='a'>Daniel Louise</List.Header>
                </List.Content>
              </List.Item>
              {this.state.show && <UserDetails class="UserDetails" />}
              <List.Item>
                <Image avatar src='../../img/communikey-logo.svg' />
                <List.Content>
                  <List.Header as='a'>Stevie Feliciano</List.Header>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='../../img/communikey-logo.svg' />
                <List.Content>
                  <List.Header as='a'>Elliot Fu</List.Header>
                </List.Content>
              </List.Item>
            </List>
          </div>
      </div>
    )
  }
}

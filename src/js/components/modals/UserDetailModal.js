import React, { Component } from 'react'
import { Icon, Label, Radio, Button, List, Modal, Image, Input } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'


class UserDetailModal extends AdminRoute  {

  constructor(props) {
    super(props);
    this.state = {
      cardUser: this.props.cardUser
    }
  }

  handleChange(event) {
    //TODO: handle input value updates
    this.setState({ [`cardUser.${event.target.name}`]: event.target.value});
  }


  handleSubmit() {
    userService.editUser(this.state.email, this.state.firstName, this.state.lastName, this.state.activated, this.state.cardUser.login);
  }

  render() {
    return (
      <Modal size="small" dimmer='inverted' open={true}>
        <Modal.Header>{this.state.cardUser.firstName}'s details: </Modal.Header>
        <Modal.Content image>
          <Image wrapped size='small' src='http://react.semantic-ui.com/assets/images/avatar/large/matthew.png' />
          <Modal.Description>
            <List relaxed divided>
              <List.Item>
                <List.Icon name='user' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>First Name</List.Header>
                  <List.Description>
                    <Input
                      name="firstName"
                      value={this.state.cardUser.firstName}
                      class='modalInput'
                      onChange={this.handleChange.bind(this)}
                    />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='user' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Last Name</List.Header>
                  <List.Description>
                    <Input
                      name="lastName"
                      value={this.state.cardUser.lastName}
                      class='modalInput'
                      onChange={this.handleChange.bind(this)}
                    />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='at' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>E-Mail</List.Header>
                  <List.Description>
                    <Input
                      name="email"
                      value={this.state.cardUser.email}
                      class='modalInput'
                      onChange={this.handleChange.bind(this)}
                    />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='unlock alternate' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Activated</List.Header>
                  <List.Description>
                    <Radio
                      name="activated"
                      toggle={true}
                      checked={this.state.cardUser.activated}
                      onChange={this.handleChange.bind(this)}
                    />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='birthday' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Activation-Token</List.Header>
                  <List.Description>{this.state.cardUser.activationKey}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='repeat' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Reset-Token</List.Header>
                  <List.Description>{this.state.cardUser.resetKey}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='privacy' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Authorities</List.Header>
                  <List.Description>
                    <Input size='mini' icon='diamond' iconPosition='left' placeholder='Search authorities...' /> <br /><br />
                    <Label as='a'>
                      <Icon name='users' />
                      User
                      <Icon name='delete' />
                    </Label>
                    <Label as='a'>
                      <Icon name='diamond' />
                      Admin
                      <Icon name='delete' />
                    </Label>
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='users' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Groups</List.Header>
                  <List.Description>
                    <Input size='mini' icon='diamond' iconPosition='left' placeholder='Search groups...' /> <br /><br />
                    <Label as='a'>
                      group A
                      <Icon name='delete' />
                    </Label>
                    <Label as='a'>
                      group B
                      <Icon name='delete' />
                    </Label>
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='teal' onClick={this.handleSubmit.bind(this)}>
            Save
          </Button>
          <Button color='teal' onClick={this.props.onModalClose}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default UserDetailModal;
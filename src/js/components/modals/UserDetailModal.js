import React, { Component } from 'react'
import { Icon, Label, Radio, Button, List, Modal, Image, Input, Popup } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { userService } from '../../util/UserService'

class UserDetailModal extends AdminRoute  {

  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.cardUser.firstName,
      lastName: this.props.cardUser.lastName,
      email: this.props.cardUser.email,
      cardUser: this.props.cardUser
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      //TODO: use cardUser object, delete single attributes
      [name]: value
    });
  };

  handleInputSubmit = () => {
    console.log(this.state.activated);
    userService.editUser(this.state.email, this.state.firstName, this.state.lastName, this.state.cardUser.login);
    this.props.onModalClose();
  };

  handleDeleteUser = () => {
    userService.deleteUser(this.state.cardUser.login);
    this.props.onModalClose();
  };

  handleDeactivateUser = () => {
    userService.deactivateUser(this.state.cardUser.login);
    this.props.onModalClose();
  };

  handleActivateUser = () => {
    userService.activateUser(this.state.cardUser.activationKey);
    this.props.onModalClose();
  };

  render() {
    return (
        <Modal size="small" dimmer='inverted' open={true}>
          <Modal.Header>{this.state.firstName}'s details: </Modal.Header>
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
                        value={this.state.firstName}
                        class='modalInput'
                        onChange={this.handleInputChange}
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
                        value={this.state.lastName}
                        class='modalInput'
                        onChange={this.handleInputChange}
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
                        value={this.state.email}
                        class='modalInput'
                        onChange={this.handleInputChange}
                      />
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='unlock alternate' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header>Activated</List.Header>
                    <List.Description>
                      <Popup
                        trigger={
                          <Radio
                            name="activated"
                            toggle={true}
                            checked={this.state.cardUser.activated}
                            type="checkbox"
                          />
                        }
                        content='Use the button below to activate/deactivate this user'
                        on='click'
                        hideOnScroll
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
                    {/*TODO: Replaceholders */}
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
                    {/*TODO: Replaceholders */}
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
            <Button color='red' onClick={this.props.onModalClose}>
              Cancel
            </Button>
            {
              this.state.cardUser.activated &&
              <Button color='black' onClick={this.handleDeactivateUser}>
                Deactivate
              </Button>
            }
            { !this.state.cardUser.activated &&
            <Button color='black' onClick={this.handleActivateUser}>
              Activate
            </Button>
            }
            <Button color='black' onClick={this.handleDeleteUser}>
              Delete
            </Button>
            <Button color='teal' onClick={this.handleInputSubmit}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export default UserDetailModal;
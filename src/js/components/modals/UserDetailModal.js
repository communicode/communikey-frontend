import React from 'react'
import {inject} from "mobx-react";
import { Radio, Button, List, Modal, Image, Input, Popup } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import UserAuthorities from '../listItems/UserAuthorities'
import UserGroups from '../listItems/UserGroups'
import UserKeyCategories from '../listItems/UserKeyCategories'
import UserKeys from '../listItems/UserKeys'
import '../../../css/components/Admin.css'

@inject("userStore")
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
    this.props.userStore.updateUser(this.state.cardUser.login, this.state.email, this.state.firstName, this.state.lastName);
    this.props.onModalClose();
  };

  handleDeleteUser = () => {
    this.props.userStore.deleteUser(this.state.cardUser.login);
    this.props.onModalClose();
  };

  handleDeactivateUser = () => {
    this.props.userStore.deactivateUser(this.state.cardUser.login);
    this.props.onModalClose();
  };

  handleActivateUser = () => {
    this.props.userStore.activateUser(this.state.cardUser.activationKey);
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
                <UserAuthorities selectedUser={this.state.cardUser}/>
                <UserGroups selectedUser={this.state.cardUser}/>
                <UserKeyCategories selectedUser={this.state.cardUser}/>
                <UserKeys selectedUser={this.state.cardUser}/>
              </List>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            {
              this.state.cardUser.activated &&
              <Button class="otherActionButton" content="Deactivate" icon="hide" onClick={this.handleDeactivateUser}/>
            }
            {
              !this.state.cardUser.activated &&
              <Button class="otherActionButton" content="Activate" icon="unhide" onClick={this.handleActivateUser}/>
            }
            <Button class="deleteButton" icon="remove user" content="Delete" onClick={this.handleDeleteUser}/>
            <Button class="saveButton" content="Save" icon="save" onClick={this.handleInputSubmit}/>
            <Button class="cancelButton" content="Cancel" icon="remove" onClick={this.props.onModalClose}/>
          </Modal.Actions>
        </Modal>
    )
  }
}

export default UserDetailModal;
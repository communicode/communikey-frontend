import React, { Component } from 'react'
import { Button, List, Modal, Image, Input } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { userService } from '../../util/UserService'


class UserDetailModal extends AdminRoute  {
  render() {
    return (
      <Modal size="small" dimmer='inverted'>
        <Modal.Header>{user.firstName}'s details: </Modal.Header>
        <Modal.Content image>
          <Image wrapped size='small' src='http://react.semantic-ui.com/assets/images/avatar/large/matthew.png' />
          <Modal.Description>
            <List relaxed divided>
              <List.Item>
                <List.Icon name='user' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Name</List.Header>
                  <List.Description>{user.firstName} {user.lastName}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='at' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>E-Mail</List.Header>
                  <List.Description>
                    <Input
                      value={user.email}
                      class='modalInput'
                    />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='key' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Password</List.Header>
                  <List.Description>
                    <Input class='modalInput' />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='key' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Confirm password</List.Header>
                  <List.Description>
                    <Input class='modalInput'/>
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='unlock alternate' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Activated</List.Header>
                  <List.Description>
                    <Radio toggle />
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='birthday' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Activation-Token</List.Header>
                  <List.Description>{user.activationKey}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='repeat' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header>Reset-Token</List.Header>
                  <List.Description>{user.resetKey}</List.Description>
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
          <Button color='teal' onClick={closeUserDetails}>
            X
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default UserDetailModal;
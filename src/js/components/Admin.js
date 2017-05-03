import React, { Component } from 'react'
import { Grid, Table, Input, Radio, Segment, Label, Card, Icon, Popup, Button, Header, Image, Modal, List, Container, Divider } from 'semantic-ui-react'
import AdminRoute from './AdminRoute'
import { userStore } from '../stores/UserStore'
import { userService } from '../util/UserService'
import '../../css/components/Admin.css'

export default class Admin extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      openUserDetails: false,
      openAddUser: false,
      user: "",
      email: ""
    }
  }

  handleEmailChange(e) {
    const email = e.target.value;
    this.state.email = email;
    console.log(email);
  }

  render() {
    var showUserDetails = (user) => () => this.setState({openUserDetails: true, user})
    var closeUserDetails = () => this.setState({openUserDetails: false})
    const {openUserDetails, user} = this.state;

    var showAddUser = () => this.setState({openAddUser: true})
    var closeAddUser = () => this.setState({openAddUser: false})
    var handleEmailChangeClick = (email) => this.handleEmailChange(email)
    const {openAddUser} = this.state;

    var saveUser = () => userService.addUser(this.state.email);



    {/* addUser */}
    function AddUser(props) {
      return (
        <Modal size="small" dimmer={false} open={openAddUser} onClose={closeAddUser}>
          <Modal.Header>Add an user</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <List relaxed divided>
                <List.Item>
                  <List.Icon name='user' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header>Firstname</List.Header>
                    <List.Description>
                      <Input class='modalInput' />
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='user' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header>Lastname</List.Header>
                    <List.Description>
                      <Input class='modalInput' />
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='at' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header>E-Mail</List.Header>
                    <List.Description>
                      <Input
                        class='modalInput'
                        onChange={(e) => handleEmailChangeClick(e)}
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
              </List>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={closeAddUser}>
              Cancel
            </Button>
            <Button color='green' onClick={saveUser}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>

      )
    }

    {/* userDetailView */}
    function UserDetails(props) {
      return (
              <Modal size="small" dimmer={false} open={openUserDetails} onClose={closeUserDetails}>
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

    {/* userCard */}
    function UserList() {
      if(userStore.users.length > 0) {
        var rows = [];
        userStore.users.map(function(user) {
          rows.push(
            <Grid.Column key={user.id}>
              <Card onClick={showUserDetails(user)}>
                <Card.Content>
                  <Card.Header>
                    {user.firstName} {user.lastName}
                  </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                      {user.lastModifiedDate}
                    </span>
                  </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Icon name='mail' />
                  {user.email}
                </Card.Content>
              </Card>
            </Grid.Column>
          );
        })
        return <tbody>{rows}</tbody>;
      } else return null
    }

    return (
      <Segment class="adminUserView">
        <Header as='h1'>
          Admin user view
          <Popup
            trigger={
              <Button
                icon='add'
                content='Add an user'
                onClick={showAddUser}
              />
            }
            content='Opens an popup to add an user.'
            on='hover'
          />
        </Header>
        <Divider />
        <Grid stackable>
          <UserList/>
        </Grid>
        <UserDetails/>
        <AddUser/>
      </Segment>
    )
  }
}

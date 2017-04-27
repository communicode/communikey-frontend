import React, { Component } from 'react'
import { Grid, Table, Input, Radio, Segment, Label, Card, Icon, Popup, Button, Header, Image, Modal, List, Container, Divider } from 'semantic-ui-react'
import AdminRoute from './AdminRoute'
import { userStore } from '../stores/UserStore'
import '../../css/components/Admin.css'

export default class Admin extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      user: ""
    }
  }

  render() {
    var show = (user) => () => this.setState({open: true, user})
    var close = () => this.setState({open: false})
    const {open, user} = this.state;

    function UserDetails(props) {
      return (
              <Modal size="small" dimmer={false} open={open} onClose={close}>
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
                                label={{ basic: true, content: '@communicode.de' }}
                                labelPosition='right'
                                placeholder={user.email}
                                fluid
                                size='mini'
                            />
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
                  <Button color='teal' onClick={close}>
                    X
                  </Button>
                </Modal.Actions>
              </Modal>
      )
    }

    function UserList() {
      if(userStore.users.length > 0) {
        var rows = [];
        userStore.users.map(function(user) {
          rows.push(
            <Grid.Column key={user.id}>
              <Card onClick={show(user)}>
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
            <div class="adminUserView">
              <Header as='h1'>Admin user view</Header>
              <Divider />
              <Grid stackable>
                <UserList/>
              </Grid>
              <UserDetails/>
            </div>
    )
  }
}

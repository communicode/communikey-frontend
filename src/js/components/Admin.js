import React, { Component } from 'react'
import { Grid, Input, Radio, Segment, Label, Card, Icon, Popup, Button, Header, Image, Modal, List, Divider, Form } from 'semantic-ui-react'
import AdminRoute from './AdminRoute'
import AddUserModal from './modals/AddUserModal'
import { userService } from '../util/UserService'
import '../../css/components/Admin.css'
import UserList from './lists/UserList'

class Admin extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      addUserModalIsOpen: false
    };
  }

  toggleAddUserModal = () => {const {addUserModalIsOpen} = this.state; this.setState({addUserModalIsOpen: !addUserModalIsOpen})};

  render() {
    return (
      <Segment class="adminUserView">
        <Header as='h1'>
          Admin user view
          <Button icon='add' content='Add an user' onClick={this.toggleAddUserModal}/>
        </Header>
        <Divider />
        <Grid stackable>
          <UserList/>
        </Grid>
        {this.state.addUserModalIsOpen && <AddUserModal onModalClose={this.toggleAddUserModal}/>}
      </Segment>
    )
  }
}
export default Admin;

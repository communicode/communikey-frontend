import React, { Component } from 'react'
import { Grid, Segment, Button, Header, Divider } from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'
import AddUserModal from '../modals/AddUserModal'
import '../../../css/components/Admin.css'
import UserList from './../lists/UserList'

class UserManagement extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      addUserModalIsOpen: false
    };
  }

  toggleAddUserModal = () => {
    const {addUserModalIsOpen} = this.state;
    this.setState({addUserModalIsOpen: !addUserModalIsOpen})
  };

  render() {
    return (
      <Segment class="adminView">
        <Header as='h1'>
          User management
          <Button class="headerButton" icon='add user' content='User' onClick={this.toggleAddUserModal}/>
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
export default UserManagement;
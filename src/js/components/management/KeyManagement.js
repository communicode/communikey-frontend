import React, { Component } from 'react'
import { Grid, Segment, Button, Header, Divider } from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'
import AddUserModal from '../modals/AddUserModal'
import '../../../css/components/Admin.css'
import KeyList from './../lists/KeyList'
import AddKeyModal from "./../modals/AddKeyModal"

/**
 * @author mskyschally@communicode.de
 */
class UserManagement extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      addKeyModalIsOpen: false
    };
  }

  toggleAddKeyModal = () => {
    const {addKeyModalIsOpen} = this.state;
    this.setState({addKeyModalIsOpen: !addKeyModalIsOpen})
  };

  render() {
    return (
      <Segment class="adminView">
        <Header as='h1'>
          Key management
          <Button class="headerButton" icon='add circle' content='Key' onClick={this.toggleAddKeyModal}/>
        </Header>
        <Divider />
        <Grid stackable>
          <KeyList/>
        </Grid>
        {this.state.addKeyModalIsOpen && <AddKeyModal onModalClose={this.toggleAddKeyModal}/>}
      </Segment>
    )
  }
}
export default UserManagement;
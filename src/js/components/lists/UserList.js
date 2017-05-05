import React, { Component } from 'react'
import {Grid, Card, Icon} from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { userStore } from '../../stores/UserStore'
import UserDetailModal from './../modals/UserDetailModal'

class UserList extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      userDetailModalIsOpen: false,
      cardUser: null
    };
  }

  toggleUserDetailModal = (user) => {
    const {userDetailModalIsOpen} = this.state;
    this.setState({
      userDetailModalIsOpen: !userDetailModalIsOpen,
      cardUser: user
    });
  };

  render() {

    const userCardList = userStore.users.map(user => {
      return (
        <Grid.Column key={user.id}>
          <Card onClick={() => this.toggleUserDetailModal(user)}>
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
      )
    });

    return (
      <div>
        {userCardList}
        {this.state.userDetailModalIsOpen && <UserDetailModal cardUser={this.state.cardUser} onModalClose={this.toggleUserDetailModal}/>}
      </div>

    )
  }
}

export default UserList;


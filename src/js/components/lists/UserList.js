import React, { Component } from 'react'
import {Grid, Card, Icon} from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { userStore } from '../../stores/UserStore'

class UserList extends AdminRoute {
  render() {

    const userCardList = userStore.users.map(user => {
      return (
        <Grid.Column key={user.id}>
          <Card>
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
      </div>

    )
  }
}

export default UserList;


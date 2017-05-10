import React, { Component } from 'react'
import {Label, Input, List} from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'

/**
 * @author mskyschally@communicode.de
 */
class UserKeys extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.selectedUser
    };
  }

  render() {
    return (
      <List.Item>
        <List.Icon name='privacy' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>Keys</List.Header>
          {/*TODO: Implement search */}
          <List.Description>
            <Input size='mini' icon='search' iconPosition='left' placeholder='Search keys...' /> <br /><br />
            <div>
              {
                this.state.user.keys.map(keys => {
                  return (
                    <Label>
                      {keys.name}
                    </Label>
                  );
                })
              }
            </div>
          </List.Description>
        </List.Content>
      </List.Item>
    )
  }
}
export default UserKeys;


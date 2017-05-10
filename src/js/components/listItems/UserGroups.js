import React, { Component } from 'react'
import {Label, Input, List} from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'

/**
 * @author mskyschally@communicode.de
 */
class UserGroups extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.selectedUser
    };
  }

  render() {
    return (
      <List.Item>
        <List.Icon name='users' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>Groups</List.Header>
          {/*TODO: Implement search */}
          <List.Description>
            <Input size='mini' icon='search' iconPosition='left' placeholder='Search groups...' /> <br /><br />
            <div>
              {
                this.state.user.groups.map(groups => {
                  return (
                    <Label>
                      {groups.name}
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
export default UserGroups;


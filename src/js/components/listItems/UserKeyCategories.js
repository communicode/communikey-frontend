import React, { Component } from 'react'
import {Label, Input, List} from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'

/**
 * @author mskyschally@communicode.de
 */
class UserKeyCategories extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.selectedUser
    };
  }

  render() {
    return (
      <List.Item>
        <List.Icon name='tags' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>Key Categories</List.Header>
          {/*TODO: Implement search */}
          <List.Description>
            <Input size='mini' icon='search' iconPosition='left' placeholder='Search key categories...' /> <br /><br />
            <div>
              {
                this.state.user.keyCategories.map(keyCategories => {
                  return (
                    <Label>
                      {keyCategories.name}
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
export default UserKeyCategories;


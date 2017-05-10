import React, { Component } from 'react'
import {Label, Input, List} from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'

/**
 * @author mskyschally@communicode.de
 */
class UserAuthorities extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.selectedUser
    };
  }

  render() {
    return (
      <List.Item>
        <List.Icon name='legal' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>Authorities</List.Header>
          {/*TODO: Implement search */}
          <List.Description>
            <Input size='mini' icon='search' iconPosition='left' placeholder='Search authorities...' /> <br /><br />
            <div>
              {
                this.state.user.authorities.map(authorities => {
                  return (
                    <Label>
                      {authorities.name}
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
export default UserAuthorities;


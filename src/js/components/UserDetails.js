import React, { Component } from 'react'
import { Grid, Table, Icon, Input, Radio, Segment, Button, Label } from 'semantic-ui-react'
import KeyCard from "./KeyCard";
import "../../css/components/UserDetails.css";

export default class UserDetails extends React.Component {
  render() {
    return (
      <div>
        <Table singleLine>
          <Table.Body>

            {/* name */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='user' />
              </Table.Cell>
              <Table.Cell collapsing>name</Table.Cell>
              <Table.Cell collapsing>first name</Table.Cell>
              <Table.Cell collapsing>last name</Table.Cell>
            </Table.Row>

            {/* email (changeable) */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='at' />
              </Table.Cell>
              <Table.Cell collapsing> email </Table.Cell>
              <Table.Cell collapsing colSpan='2'>
                <Input
                    label={{ basic: true, content: '@communicode.de' }}
                    labelPosition='right'
                    placeholder='E-Mail'
                    fluid
                    ref="email"
                    size='mini'
                />
              </Table.Cell>
            </Table.Row>

            {/* activated? */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='unlock alternate' />
              </Table.Cell>
              <Table.Cell collapsing>activated</Table.Cell>
              <Table.Cell collapsing colSpan='2'>
                <Radio toggle />
              </Table.Cell>
            </Table.Row>

            {/* activation token */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='birthday' />
              </Table.Cell>
              <Table.Cell collapsing>activation token</Table.Cell>
              <Table.Cell collapsing colSpan='2'>placeholder</Table.Cell>
            </Table.Row>

            {/* reset token */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon loading name='repeat' />
              </Table.Cell>
              <Table.Cell collapsing>reset token</Table.Cell>
              <Table.Cell collapsing colSpan='2'>placeholder</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='wait' />
              </Table.Cell>
              <Table.Cell collapsing>reset date</Table.Cell>
              <Table.Cell collapsing colSpan='2'>placeholder</Table.Cell>
            </Table.Row>

            {/* authorities */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='privacy' />
              </Table.Cell>
              <Table.Cell collapsing>authorities</Table.Cell>
              <Table.Cell collapsing colSpan='2'>
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
              </Table.Cell>
            </Table.Row>

            {/* groups */}
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='users' />
              </Table.Cell>
              <Table.Cell collapsing>groups</Table.Cell>
              <Table.Cell collapsing colSpan='2'>
                <Input size='mini' icon='users' iconPosition='left' placeholder='Search groups...' /> <br /><br />
                <Label as='a'>
                  group A
                  <Icon name='delete' />
                </Label>
                <Label as='a'>
                  group B
                  <Icon name='delete' />
                </Label>

                <Label as='a'>
                  group A
                  <Icon name='delete' />
                </Label>
                <Label as='a'>
                  group B
                  <Icon name='delete' />
                </Label>
                <Label as='a'>
                  group A
                  <Icon name='delete' />
                </Label>
                <Label as='a'>
                  group B
                  <Icon name='delete' />
                </Label>
              </Table.Cell>
            </Table.Row>

            {/* key-cards */}
            <Table.Row>
              <Table.Cell colSpan='4'>
                <Grid stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                    <Grid.Column>
                      <KeyCard></KeyCard>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Table.Cell>
            </Table.Row>
          </Table.Body>

          {/* table-footer */}
          <Table.Footer fullWidth>
            <Table.Row>

              {/* buttons */}
              <Table.HeaderCell />
              <Table.HeaderCell colSpan='4'>
                <Button.Group floated='right' basic size='small'>
                  <Button icon='save'/>
                  <Button icon='dont'/>
                  <Button icon='delete' />
                </Button.Group>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}

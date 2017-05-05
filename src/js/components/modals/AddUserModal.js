import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { userService } from '../../util/UserService'

export default class AddUserModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  };

  handleChange(event) {
    if (!event.target.name) {
      //TODO handle
      return;
    }
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(){
    userService.addUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password);
    console.log(
      'first Name: ', this.state.firstName,
      'last Name: ', this.state.lastName,
      'email: ', this.state.email,
      'password: ', this.state.password
    );
    this.props.onModalClose();
  }

    render() {
      return (
        <Modal size="small" dimmer='inverted' open={true}  >
          <Modal.Header>Add an user</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Group>
                  <Form.Input name="firstName" placeholder="First Name" label="First Name" onChange={this.handleChange.bind(this)}/>
                  <Form.Input name="lastName" placeholder="Last Name" label="Last Name" onChange={this.handleChange.bind(this)}/>
                </Form.Group>
                <Form.Group>
                  <Form.Input name="email" placeholder="Email" label="Email" onChange={this.handleChange.bind(this)}/>
                </Form.Group>
                <Form.Group>
                  <Form.Input name="password" placeholder="Password" label="Password" type='password' onChange={this.handleChange.bind(this)}/>
                </Form.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.props.onModalClose}>
              Cancel
            </Button>
            <Button color='green' onClick={this.handleSubmit.bind(this)}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
      )
  }
}
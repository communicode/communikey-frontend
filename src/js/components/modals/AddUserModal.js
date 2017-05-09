import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { userService } from '../../util/UserService'

class AddUserModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  handleSubmit = () => {
    userService.addUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password);
    this.props.onModalClose();
  };

    render() {
      return (
        <Modal size="small" dimmer='inverted' open={true}  >
          <Modal.Header>Add an user</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Group>
                  <Form.Input name="firstName" placeholder="First Name" label="First Name" onChange={this.handleChange}/>
                  <Form.Input name="lastName" placeholder="Last Name" label="Last Name" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group>
                  <Form.Input name="email" placeholder="Email" label="Email" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group>
                  <Form.Input name="password" placeholder="Password" label="Password" type='password' onChange={this.handleChange}/>
                </Form.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.props.onModalClose}>
              Cancel
            </Button>
            <Button color='teal' onClick={this.handleSubmit}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
      )
  }
}

export default AddUserModal;
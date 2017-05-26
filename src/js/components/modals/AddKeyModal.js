import React from 'react'
import {inject} from "mobx-react";
import { Button, Modal, Form } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import SelectCategoryModal from './SelectCategoryModal'

/**
 * A modal to add a new key.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject("keyStore")
class AddKeyModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      login: "",
      selectCategoryModalIsOpen: false,
      isLoading: false
    }
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  handleSubmit = () => {
    this.setState({isLoading: true});
    this.props.keyStore.createKey(this.state.name, this.state.password, this.state.login);
    this.props.onModalClose();
    this.setState({isLoading: false});
  };

  toggleSelectCategoryModal = () => {
    const {selectCategoryModalIsOpen} = this.state;
    this.setState({selectCategoryModalIsOpen: !selectCategoryModalIsOpen})
  };

  render() {
    return (
      <Modal size="small" dimmer='inverted' open={true}>
        <Modal.Header>Add a key</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Group>
                <Form.Input name="name" placeholder="Name" label="Name" onChange={this.handleChange}/>
                <Form.Input name="login" placeholder="Login" label="Login" onChange={this.handleChange}/>
                <Form.Input name="password" placeholder="Password" label="Password" onChange={this.handleChange}/>
              </Form.Group>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button class="saveButton" content="Save" icon="save" onClick={this.handleSubmit} loading={this.state.isLoading}/>
          <Button content="Cancel" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
        {this.state.selectCategoryModalIsOpen && <SelectCategoryModal onModalClose={this.toggleSelectCategoryModal}/>}
      </Modal>
    )
  }
}

export default AddKeyModal;

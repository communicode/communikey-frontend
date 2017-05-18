import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { keyService } from '../../util/KeyService'
import SelectCategoryModal from './SelectCategoryModal'

/**
 * @author mskyschally@communicode.de
 */
class AddKeyModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      password: null,
      selectCategoryModalIsOpen: false

    }
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  handleSubmit = () => {
    keyService.addKey(this.state.name, this.state.password);
    this.props.onModalClose();
    this.setState({selectCategoryModalIsOpen: true})
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
                <Form.Input name="password" placeholder="Password" label="Password" onChange={this.handleChange}/>
              </Form.Group>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button class="saveButton" content="Save" icon="save" onClick={this.handleSubmit}/>
          <Button content="Cancel" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
        {this.state.selectCategoryModalIsOpen && <SelectCategoryModal onModalClose={this.toggleSelectCategoryModal}/>}
      </Modal>
    )
  }
}

export default AddKeyModal;
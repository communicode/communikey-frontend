import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { categoryService } from '../../util/CategoryService'

class AddCategoryModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      name: null
    }
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  handleSubmit = () => {
    categoryService.createCategory(this.state.name);
    this.props.onModalClose();
  };

  render() {
    return (
      <Modal size="small" dimmer={false} open={true}  >
        <Modal.Header>New Category</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Group>
                <Form.Input name="name" placeholder="Category name" label="Name" onChange={this.handleChange}/>
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

export default AddCategoryModal;
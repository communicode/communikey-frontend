import React from "react";
import {inject} from "mobx-react";
import {Button, Modal, Form} from "semantic-ui-react";
import AdminRoute from "./../AdminRoute";

@inject("categoryStore")
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
    this.props.categoryStore.create(this.state.name);
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
          <Button class="saveButton" content="Save" icon="save" onClick={this.handleSubmit}/>
          <Button content="Cancel" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default AddCategoryModal;
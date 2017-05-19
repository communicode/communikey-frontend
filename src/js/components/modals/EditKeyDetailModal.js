import React from "react";
import {inject} from "mobx-react";
import {Button, Modal, Form} from "semantic-ui-react";
import AdminRoute from "./../AdminRoute";
import SelectCategoryModal from "./SelectCategoryModal";

/**
 * @author mskyschally@communicode.de
 */
@inject("keyStore")
class EditKeyDetailModal extends AdminRoute {

  constructor(props) {
    super(props);
    this.state = {
      passedKey: this.props.passedKey,
      name: this.props.passedKey.name,
      password: this.props.passedKey.password,
      selectCategoryModalIsOpen: false
    }
  }

  handleDeleteKey = () => {
    this.props.keyStore.deleteKey(this.state.passedKey.id);
    this.props.onModalClose();
  };

  toggleSelectCategoryModal = () => {
    const {selectCategoryModalIsOpen} = this.state;
    this.setState({
      selectCategoryModalIsOpen: !selectCategoryModalIsOpen
    })
  };

  handleAddKeyToCategory = (category) => {
    this.props.keyStore.addKey(category.id, this.state.passedKey.id);
    this.props.onModalClose();
  };



  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      //TODO: use passedKey object, delete single attributes
      [name]: value
    });
  };

  handleInputSubmit = () => {
    this.props.keyStore.updateKey(this.state.passedKey.id, this.state.name, this.state.password);
    this.props.onModalClose();
  };

  render() {
    return (
      <Modal size="small" dimmer={true} open={true}  >
        <Modal.Header>Edit key: {this.state.name}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Input
                name="name"
                label="Name"
                value={this.state.name}
                class='modalInput'
                onChange={this.handleInputChange}
              />
              <Form.Input
                name="password"
                label="Password"
                value={this.state.password}
                class='modalInput'
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Delete" class="deleteButton" icon="delete calendar" onClick={this.handleDeleteKey}/>
          <Button content="Add to category" class="otherActionButton" icon="tags" onClick={this.toggleSelectCategoryModal}/>
          <Button class="saveButton" content="Save" icon="save" onClick={this.handleInputSubmit}/>
          <Button content="Cancel" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
        {this.state.selectCategoryModalIsOpen && <SelectCategoryModal onSelectCategory={this.handleAddKeyToCategory} onModalClose={this.toggleSelectCategoryModal}/>}
      </Modal>
    )
  }
}

export default EditKeyDetailModal;
import React from "react";
import {inject} from "mobx-react";
import {Button, Modal, Accordion, Icon, Menu} from "semantic-ui-react";
import AdminRoute from "./../AdminRoute";
import CategoryTree from "./../lists/CategoryTree";

/**
 * @author mskyschally@communicode.de
 */
@inject("categoryStore")
class SelectCategoryModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null
    }
  };

  setSelectedCategory = (selectedCategory) => {
    this.setState({selectedCategory: selectedCategory});
  };

  handleSubmit = () => {
    this.props.onAddKeyToCategory(this.state.selectedCategory);
    this.props.onModalClose();
  };

  render() {
    return (
      <Modal size="small" dimmer="inverted" open={true}>
        <Modal.Header>Select category</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Menu vertical={true} fluid={true}>
              <CategoryTree categories={this.props.categoryStore.categories} onCategorySelect={this.setSelectedCategory}/>
            </Menu>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content="OK" class="saveButton" onClick={this.handleSubmit}/>
          <Button content="Cancel" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default SelectCategoryModal;

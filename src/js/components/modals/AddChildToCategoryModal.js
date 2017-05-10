import React, { Component } from 'react'
import { Button, Modal, Accordion, Icon } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { categoryService } from '../../util/CategoryService'
import { categoryStore } from "../../stores/CategoryStore"

class AddChildToCategoryModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      childID: this.props.selectedCategory.id
    }
  };

  handleSubmit = (parentID) => {
    console.log("parentID " + parentID + ", childID " + this.state.childID)
    categoryService.addChild(parentID, this.state.childID);
    this.props.onModalClose();
  };

  render() {
    //TODO: Remove duplicate
    // CategoryTree, CategoryManagement & AddChildToCategoryModal use the same function (CategoryList) with different onClick

    let handleClick = (parentID) => this.handleSubmit(parentID);

    function CategoryList(props) {
      if(props.node !== undefined && props.node.length > 0) {
        let rows = [];
        props.node.map(function(category) {
          rows.push(
            <Accordion fluid activeIndex={0} key={category.id}>
              <Accordion.Title onClick={() => handleClick(category.id)}>
                <Icon name='triangle right' />
                {category.name}
              </Accordion.Title>
              <Accordion.Content>
                <CategoryList node={category.children} />
              </Accordion.Content>
            </Accordion>
          );
        })
        return <tbody>{rows}</tbody>;
      } else return null
    }

    return (
      <Modal size="small" dimmer={true} open={true}  >
        <Modal.Header>Add "{this.props.selectedCategory.name}" as child to..</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <CategoryList node={categoryStore.categories} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default AddChildToCategoryModal;
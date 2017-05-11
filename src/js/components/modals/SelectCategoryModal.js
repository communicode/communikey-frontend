import React, { Component } from 'react'
import { Button, Modal, Accordion, Icon } from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { categoryService } from '../../util/CategoryService'
import { categoryStore } from "../../stores/CategoryStore"

/**
 * @author mskyschally@communicode.de
 */
class SelectCategoryModal extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null
    }
  };

  handleSubmit = (selectedCategory) => {
    /*console.log("parentID " + parentID + ", childID " + this.state.childID)
    categoryService.addChild(parentID, this.state.childID);
    this.props.onModalClose();*/
    this.setState({
      selectedCategory: selectedCategory
    })
  };

  render() {
    //TODO: Remove duplicate
    // CategoryTree, CategoryManagement & AddChildToCategoryModal use the same function (CategoryList) with different onClick

    let handleClick = (category) => this.props.onSelectCategory(category);

    function CategoryList(props) {
      if(props.node !== undefined && props.node.length > 0) {
        let rows = [];
        props.node.map(function(category) {
          rows.push(
            <Accordion fluid activeIndex={0} key={category.id}>
              <Accordion.Title onClick={() => handleClick(category)}>
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
        <Modal.Header>Select category</Modal.Header>
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

export default SelectCategoryModal;
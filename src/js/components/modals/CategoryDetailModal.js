import React, { Component } from 'react'
import { Button, List, Modal} from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { categoryService } from '../../util/CategoryService'
import AddChildToCategoryModal from '../modals/AddChildToCategoryModal'

class UserDetailModal extends AdminRoute  {

  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: this.props.selectedCategory,
      name: this.props.selectedCategory.name,
      addChildToCategoryModalIsOpen: null
    }
  }

  handleDeleteCategory = () => {
    categoryService.deleteCategory(this.state.selectedCategory.id);
    this.props.onModalClose();
  };

  toggleAddChildToCategoryModal = () => {
    const {addChildToCategoryModalIsOpen} = this.state;
    this.setState({addChildToCategoryModalIsOpen: !addChildToCategoryModalIsOpen})
  };

  render() {
    return (
      <Modal size="small" dimmer={true} open={true}  >
        <Modal.Header>Edit category: {this.state.name}</Modal.Header>
        <Modal.Content>
          <List divided relaxed>
            <List.Item>
              <List.Icon name='hashtag' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>ID</List.Header>
                <List.Description> {this.state.selectedCategory.id} </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='address book' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Name</List.Header>
                <List.Description> {this.state.selectedCategory.name} </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='calendar' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Created by</List.Header>
                <List.Description> {this.state.selectedCategory.createdBy} </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='copyright' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Creation date</List.Header>
                <List.Description> {this.state.selectedCategory.createdDate} </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='edit' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Last modified by</List.Header>
                <List.Description> {this.state.selectedCategory.lastModifiedBy} </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='wait' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Last modifed date</List.Header>
                <List.Description> {this.state.selectedCategory.lastModifiedDate} </List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.props.onModalClose}>
            Cancel
          </Button>
          <Button color='black' onClick={this.handleDeleteCategory}>
            Delete
          </Button>
          <Button color='teal' onClick={this.toggleAddChildToCategoryModal}>
            Add as child
          </Button>
        </Modal.Actions>
        {this.state.addChildToCategoryModalIsOpen && <AddChildToCategoryModal selectedCategory={this.state.selectedCategory} onModalClose={this.toggleAddChildToCategoryModal}/>}
      </Modal>

    )
  }
}

export default UserDetailModal;
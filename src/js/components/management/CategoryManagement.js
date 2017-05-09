import React, { Component } from 'react'
import {Segment, Header, Divider, Button, Accordion, Icon} from 'semantic-ui-react'
import AdminRoute from '../AdminRoute'
import '../../../css/components/Admin.css'
import { categoryStore } from "../../stores/CategoryStore"
import CategoryDetailModal from '../modals/CategoryDetailModal'
import AddCategoryModal from '../modals/AddCategoryModal'

class CategorieManagement extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      categoryDetailModalIsOpen: false,
      selectedCategory: null,
      addCategoryModalIsOpen: false
    };
  }

  toggleCategoryDetailModal = (category) => {
    const {categoryDetailModalIsOpen} = this.state;
    this.setState({
      categoryDetailModalIsOpen: !categoryDetailModalIsOpen,
      selectedCategory: category
    })
  };

  toggleAddCategoryModal = () => {
    const {addCategoryModalIsOpen} = this.state;
    this.setState({addCategoryModalIsOpen: !addCategoryModalIsOpen})
  };

  render() {
    //TODO: Remove duplicate
    // CategoryTree, CategoryManagement & AddChildToCategoryModal use the same function (CategoryList) with different onClick

    let handleClick = (category) => this.toggleCategoryDetailModal(category)

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
      <Segment class="adminView">
        <Header as='h1'>
          Category management
          <Button class="headerButton" icon='add' content='Categorie' onClick={this.toggleAddCategoryModal}/>
        </Header>
        <Divider />
        <CategoryList node={categoryStore.categories} />
        {this.state.addCategoryModalIsOpen && <AddCategoryModal onModalClose={this.toggleAddCategoryModal}/>}
        {this.state.categoryDetailModalIsOpen && <CategoryDetailModal selectedCategory={this.state.selectedCategory} onModalClose={this.toggleCategoryDetailModal}/>}
      </Segment>
    )
  }
}
export default CategorieManagement;
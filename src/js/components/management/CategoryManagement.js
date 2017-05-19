import React from "react";
import {inject, observer} from "mobx-react";
import {Segment, Header, Button, Grid, Message, Menu, Container, Rail, Icon} from "semantic-ui-react";
import "../../../css/components/Admin.css";
import AdminRoute from "../AdminRoute";
import CategoryDetailModal from "../modals/CategoryDetailModal";
import AddCategoryModal from "../modals/AddCategoryModal";
import CategoryCard from "./../cards/CategoryCard";
import CategoryTree from "../lists/CategoryTree";

/**
 * A board to manage categories.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject("categoryStore") @observer
class CategoryManagement extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      addCategoryModalIsOpen: false,
      selectedCategory: null,
      categoryDetailModalIsOpen: false
    };
  }

  componentDidMount() {
    this.props.categoryStore.fetchCategories();
  }

  toggleCategoryDetailModal = () => {
    const {categoryDetailModalIsOpen} = this.state;
    this.setState({categoryDetailModalIsOpen: !categoryDetailModalIsOpen})
  };

  /**
   * Handles a category card change.
   *
   * @callback handleCategoryCardChange
   * @param {string} categoryAttribute - The name of the attribute to change
   * @param value - The new attribute value
   */
  handleCategoryCardChange = (categoryAttribute, value) => this.state.selectedCategory[categoryAttribute] = value;

  /**
   * Handles a category card deletion.
   *
   * @callback handleCategoryCardDelete
   */
  handleCategoryCardDelete = () => {
    this.props.categoryStore.delete(this.state.selectedCategory.id);
    this.setState({selectedCategory: null});
    this.props.categoryStore.fetchCategories();
  };

  /**
   * Handles a category card save.
   *
   * @callback handleCategoryCardSave
   */
  handleCategoryCardSave = () => this.props.categoryStore.update(this.state.selectedCategory);

  toggleAddCategoryModal = () => {
    const {addCategoryModalIsOpen} = this.state;
    this.setState({addCategoryModalIsOpen: !addCategoryModalIsOpen})
  };

  toggleVisibility = () => this.setState({visible: !this.state.visible});

  setSelectedCategory = (category) => {
    this.state.selectedCategory !== category && this.setState({selectedCategory: category});
  };

  render() {
    const {categoryStore} = this.props;
    const {selectedCategory, addCategoryModalIsOpen, categoryDetailModalIsOpen} = this.state;

    const renderCategories = () => (
      <div>
        <Container textAlign="left" fluid={true}>
          <Button icon={<Icon name="add" bordered={false}/>} content="New" labelPosition="left" onClick={this.toggleAddCategoryModal}/>
        </Container>
        <Grid centered={true} columns={2}>
          <Grid.Column>
            {selectedCategory &&
            <CategoryCard
              category={selectedCategory}
              editable={true}
              onChange={this.handleCategoryCardChange}
              onDelete={this.handleCategoryCardDelete}
              onSave={this.handleCategoryCardSave}/>
            }
            <Rail dividing={true} position="left">
              <Menu vertical={true} fluid={true}>
                <CategoryTree categories={categoryStore.categories} onCategorySelect={this.setSelectedCategory}/>
              </Menu>
            </Rail>
          </Grid.Column>
        </Grid>
      </div>
    );

    const renderNoCategoriesMessage = () => (
      <Grid centered={true} columns={1}>
        <Grid.Column>
          <Message
            icon="inbox" compact={true} attached={true}
            header="There are no categories yet."
            content="You can create one by clicking on the button below."/>
          <Button icon="add" attached="bottom" onClick={this.toggleAddCategoryModal}/>
        </Grid.Column>
      </Grid>
    );


    return (
      <Segment class="adminView">
        <Header as="h1" textAlign="center">
          <Header.Content>Categories</Header.Content>
          <Header.Subheader>Manage category settings and the structure</Header.Subheader>
        </Header>
        {categoryStore.categories.length > 0 ? renderCategories() : renderNoCategoriesMessage()}
        {addCategoryModalIsOpen && <AddCategoryModal onModalClose={this.toggleAddCategoryModal}/>}
        {categoryDetailModalIsOpen && <CategoryDetailModal
          selectedCategory={selectedCategory}
          onModalClose={this.toggleCategoryDetailModal}/>
        }
      </Segment>
    )
  }
}

export default CategoryManagement;
import React, { Component } from 'react'
import { Accordion, Icon, Card, Image } from 'semantic-ui-react'
import "../../css/components/CategoryTree.css";

class CategoryTree extends Component {
  render() {
    var subCategories = ['Subcategory 1', 'Subcategory 2', 'Subcategory 3'];
    var subCategoryList = subCategories.map(function(subCategory) {
      return (
        <Accordion fluid>
          <Accordion.Title>
            <Icon name='triangle right' />
            { subCategory }
          </Accordion.Title>
        </Accordion>
      )
    })
    var categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'];
    var categoryList = categories.map(function(category) {
      return (
        <Accordion fluid>
          <Accordion.Title>
            <Icon name='dropdown' />
            {category}
          </Accordion.Title>
          <Accordion.Content>
            {subCategoryList}
          </Accordion.Content>
        </Accordion>
      )
    })
    return (
      <Card>
        { categoryList }
      </Card>
      )
    }
  }

  export default CategoryTree

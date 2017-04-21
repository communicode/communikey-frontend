import React, { Component } from 'react'
import { Accordion, Icon, Card, Image } from 'semantic-ui-react'
import axios from 'axios'
import KeyCardView from "./KeyCardView"
import "../../css/components/CategoryTree.css"
import * as constants from '../util/Constants'

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
      <div>
        <Card class="box" raised>
          { categoryList }
        </Card>
        <KeyCardView/>
      </div>
      )
    }
  }

  export default CategoryTree

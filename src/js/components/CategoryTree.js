import React, { Component } from 'react'
import { Accordion, Icon, Card, Image } from 'semantic-ui-react'
import axios from 'axios'
import KeyCardView from "./KeyCardView"
import "../../css/components/CategoryTree.css"
import * as constants from '../util/Constants'
import { categoryStore } from "../stores/CategoryStore"

class CategoryTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: ""
    }
  }

  changeMyState(category) {
    console.log(this.state.selectedCategory.id);
    this.state.selectedCategory = category;
    console.log(this.state.selectedCategory.id);
    // this.forceUpdate();
    this.setState(this.state);
  }

  render() {
    var handleTitleClick = (category) => this.changeMyState(category)

    function CategoryList(props) {
      if(props.node !== undefined) {
        if(props.node.length > 0) {
          var rows = [];
          props.node.map(function(category) {
            rows.push(
              <Accordion fluid>
                <Accordion.Title onClick={() => handleTitleClick(category)}>
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
      } else return null
    }

    return (
      <div>
        <Card class="box" raised>
          <CategoryList node={categoryStore.categories} />
        </Card>
        <KeyCardView category={this.state.selectedCategory}/>
      </div>
      )
    }
  }

  export default CategoryTree

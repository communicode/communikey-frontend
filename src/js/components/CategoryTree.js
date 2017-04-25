import React, { Component } from 'react'
import { Accordion, Icon, Segment, Image } from 'semantic-ui-react'
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
    // console.log(this.state);
    // this.state.selectedCategory = category;
    // this.forceUpdate();
    this.setState({selectedCategory: category});
  }

  render() {
    const { activeIndex, selectedCategory } = this.state
    var handleClick = (category, index) => this.changeMyState(category)

    function CategoryList(props) {
      if(props.node !== undefined) {
        if(props.node.length > 0) {
          var rows = [];
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
      } else return null
    }

    return (
      <div>
        <Segment class="categoryTree">
          <CategoryList node={categoryStore.categories} />
        </Segment>
        <KeyCardView category={this.state.selectedCategory}/>
      </div>
      )
    }
  }

  export default CategoryTree

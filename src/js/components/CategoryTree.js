import React, { Component } from "react";
import {inject, observer} from "mobx-react";
import {Accordion, Icon, Segment} from "semantic-ui-react";
import KeyCardView from "./KeyCardView";
import "../../css/components/CategoryTree.css"

@inject("categoryStore") @observer
class CategoryTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: ""
    }
  }

  changeMyState(category) {
    //TODO: Remove comments
    // console.log(this.state);
    // this.state.selectedCategory = category;
    // this.forceUpdate();
    this.setState({selectedCategory: category});
  }

  componentDidMount() {
    this.props.categoryStore.fetchCategories();
  }

  render() {
    const { activeIndex, selectedCategory } = this.state
    let handleClick = (category, index) => this.changeMyState(category)

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
      <div>
        <Segment class="categoryTree">
          <CategoryList node={this.props.categoryStore.categories} />
        </Segment>
        <KeyCardView category={this.state.selectedCategory}/>
      </div>
      )
    }
  }

  export default CategoryTree

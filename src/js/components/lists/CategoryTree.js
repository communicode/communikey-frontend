import React, {Component} from "react";
import {PropTypes} from "mobx-react";
import {Accordion, Icon} from "semantic-ui-react";

/**
 * A tree for categories to be wrapped into a {@link Menu} Semantic UI component.
 *
 * @author sgreb@communicode.de
 * @since 0.6.0
 */
class CategoryTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The currently selected category.
       *
       * @type {object}
       * @default null
       */
      selectedCategory: null
    }
  }

  /**
   * Handles the event when the category name gets clicked.
   * Fires the {@code onCategorySelect()} prop callback function.
   *
   * @param {object} category - The category of which the title has been clicked
   */
  handleTitleClick = (category) => {
    this.setState({selectedCategory: category});
    this.props.onCategorySelect(category);
  };

  render() {
    return (
      <div>
        {this.props.categories.map(category => (
            <Accordion fluid={true} key={category.id} className="link item" onTitleClick={() => this.handleTitleClick(category)}>
              <Accordion.Title>
                <Icon name="dropdown"/>
                {category.name}
              </Accordion.Title>
              <Accordion.Content>
                {category.children &&
                <CategoryTree
                  categories={category.children}
                  onTitleClick={() => this.handleTitleClick(category)}
                  onCategorySelect={this.props.onCategorySelect}
                />}
              </Accordion.Content>
            </Accordion>
          )
        )}
      </div>
    )
  }
}

CategoryTree.propTypes = {
  /**
   * @type {ObservableArray} categories - The observable array of categories
   */
  categories: PropTypes.observableArray.isRequired
};

export default CategoryTree;
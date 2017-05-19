import React from "react";
import {inject, observer} from "mobx-react";
import CategoryTree from "./lists/CategoryTree";
import KeyCard from "./KeyCard";
import {Button, Grid, Header, Rail, Menu, Message, Segment} from "semantic-ui-react"
import AuthenticatedRoute from "./AuthenticatedRoute";

/**
 * A board to view keys.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject("categoryStore") @observer
class Keys extends AuthenticatedRoute {

  constructor(props) {
    super(props);
    this.state = {
      /**
       * The selected category.
       *
       * @type {object}
       */
      selectedCategory: null,

      /**
       * The current key.
       *
       * @type {object}
       */
      currentKey: null
    }
  }

  /**
   * Sets the currently selected category.
   *
   * @callback setSelectedCategory
   * @param {object} category - The selected category to set
   */
  setSelectedCategory = (category) => this.state.selectedCategory !== category && this.setState({selectedCategory: category});

  render() {
    const {categoryStore} = this.props;
    const {selectedCategory} = this.state;

    /**
     * Renders the {@link KeyCard}s.
     *
     * @since 0.6.0
     */
    const renderKeyCards = () => (
      selectedCategory.keys.map(key => (
        <KeyCard passedKey={key} key={key.id}/>
      ))
    );

    /**
     * Renders the keys of the selected category in a {@link Grid}.
     *
     * @since 0.6.0
     */
    const renderKeys = () => (
      <div>
        <Grid centered={true} columns={2}>
          <Grid.Column width={10}>
            <Grid>
              {selectedCategory && renderKeyCards()}
            </Grid>
            <Rail dividing={true} position="left">
              <Menu vertical={true} fluid={true}>
                <CategoryTree categories={categoryStore.categories} onCategorySelect={this.setSelectedCategory}/>
              </Menu>
            </Rail>
          </Grid.Column>
        </Grid>
      </div>
    );

    /**
     * Renders a message when there are no categories.
     *
     * @since 0.6.0
     */
    const renderNoCategoriesMessage = () => (
      <Grid centered={true} columns={1}>
        <Grid.Column>
          <Message
            icon="inbox" compact={true} attached={true}
            header="There are no categories yet."
            content="You can create one by clicking on the button below."/>
          <Button icon="add" attached="bottom" disabled={true}/>
        </Grid.Column>
      </Grid>
    );

    return (
      <Segment basic={true} padded="very">
        <Header as="h1" textAlign="center">
          <Header.Content>Keys</Header.Content>
        </Header>
        {categoryStore.categories.length > 0 ? renderKeys() : renderNoCategoriesMessage()}
      </Segment>
    )
  }
}

export default Keys;

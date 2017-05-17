import React, {Component} from "react";
import PropTypes from "prop-types";
import {Card, Divider, Grid, Icon, Image, Input, Label, List, Popup} from "semantic-ui-react";

/**
 * A category represented as a card.
 *
 * @author sgreb@communicode.de
 * @since 0.6.0
 */
class CategoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The lock status of the category card.
       *
       * @type {boolean}
       * @default true
       */
      isLocked: true,
      /**
       * The current category.
       *
       * @type {object}
       * @default props.category
       */
      category: props.category
    };
  }

  /**
   * Updates the state with the next props received from the parent component.
   *
   * @param nextProps - The next props received from the parent component
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      category: nextProps.category
    });
  }

  /**
   * Handles the category deletion event.
   * Fires the {@code onDelete()} prop callback function.
   */
  handleDeleteRequest = () => {
    this.setState({isLocked: !this.state.isLocked});
    this.props.onDelete(this.state.category);
  };

  /**
   * Handles category attribute value change events from input components.
   *
   * @param event - The change event
   */
  handleInputChange = (event) => {
    this.state.category[event.target.name] = event.target.value;
  };

  /**
   * Toggles the lock status.
   * Fires the {@code onSave()} prop callback function.
   */
  toggleLockStatus = () => {
    this.setState({isLocked: !this.state.isLocked});
    this.state.isLocked || this.props.onSave(this.state.category);
  };

  render() {
    const {category} = this.state;

    /**
     * The creation date attribute of a category as localized string.
     *
     * @return {string} The creation date as localized string
     */
    const createdDate = () => category.createdDate && new Date(category.createdDate).toLocaleString();

    /**
     * The last modified date attribute of a category as localized string.
     *
     * @return {string} The last modified date as localized string
     */
    const lastModifiedDate = () => category.lastModifiedDate && new Date(category.lastModifiedDate).toLocaleString();

    /**
     * Returns the name of lock icon depending on the current lock status.
     */
    const lockIcon = () => this.state.isLocked ? "pencil" : "save";

    return (
      <Card>
        {this.props.image}
        <Card.Content>
          <Card.Header>
            <Input
              name="name"
              /*
               * The "key" prop is important to override the default value with the updated value from the state after initialization, otherwise the
               * input will be handled as uncontrolled component which prevents React from updating the value in the DOM.
               * Reference: https://facebook.github.io/react/docs/uncontrolled-components.html
               * */
              key={category.id}
              onChange={this.handleInputChange}
              defaultValue={category.name}
              readOnly={this.state.isLocked}
              size="mini"
              transparent={this.state.isLocked}
            />
            {this.props.editable && <Label as="a" corner="right" icon={lockIcon()} onClick={this.toggleLockStatus}/>}
            {!this.state.isLocked && <Label as="a" corner="left" icon="trash outline" onClick={this.handleDeleteRequest}/>}
          </Card.Header>
          <Card.Meta>
            <Divider/>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Grid>
            <Grid.Column floated="left">
              <a><Icon name="user"/>{category.responsible.firstName} {category.responsible.lastName}</a>
            </Grid.Column>
            <Grid.Column floated="right">
              <Popup trigger={<Icon name="clock"/>} flowing={true} hoverable={true} hideOnScroll={true}>
                <List>
                  <List.Item><Label content="Created" detail={createdDate()}/></List.Item>
                  <List.Item><Label content="Modified" detail={lastModifiedDate()}/></List.Item>
                </List>
              </Popup>
            </Grid.Column>
          </Grid>
        </Card.Content>
      </Card>
    )
  }
}

CategoryCard.propTypes = {
  /**
   * @type {object} category- The category
   */
  category: PropTypes.object.isRequired,

  /**
   * @type {bool} editable - Determines whether the category card can be edited
   */
  editable: PropTypes.bool,

  /**
   * @type {Image} image - The image of the category
   */
  image: PropTypes.element,

  /**
   * @type {object} The callback function to handle category deletion
   */
  onDelete: PropTypes.func.isRequired,

  /**
   * @type {object} The callback function to handle category changes
   */
  onSave: PropTypes.func.isRequired
};

CategoryCard.defaultProps = {
  editable: false,
  image: <Image src="/assets/images/wireframe/image.png"/>
};

export default CategoryCard;
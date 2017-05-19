import React, { Component } from "react";
import PropTypes from "prop-types";
import {Button, Card, Divider, Grid, Header, Image, Input} from "semantic-ui-react";
import "../../css/components/KeyCard.css";
import "../../css/components/Admin.css";
import CopyToClipboard from "react-copy-to-clipboard";

class KeyCard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      inputType: "password"
    }
  }

  togglePasswordInputVisibility = () =>
    this.state.inputType === "password" ? this.setState({inputType: "text"}) : this.setState({inputType: "password"});

  render() {
      return (
        <Grid.Column>
          <Card>
            <Card.Content>
              <Card.Header>
                <Grid>
                  <Grid.Column stretched={true}>
                    <Header as="h4" textAlign="center">{this.props.passedKey.name}</Header>
                  </Grid.Column>
                  <Grid.Column floated="right">
                    {this.props.keyIcon}
                  </Grid.Column>
                </Grid>
              </Card.Header>
            <Card.Meta>
              <Divider/>
            </Card.Meta>
              <Input defaultValue={this.props.passedKey.password} type={this.state.inputType} disabled={true} fluid={true}/>
            </Card.Content>
            <Card.Content extra>
              <Grid>
                <Grid.Column floated="left">
                  <Button icon="eye" circular={true} onClick={this.togglePasswordInputVisibility}/>
                  <CopyToClipboard text={this.props.passedKey.password}>
                    <Button icon="copy" circular={true}/>
                  </CopyToClipboard>
                </Grid.Column>
                <Grid.Column floated="right">
                  <Button
                    icon="ellipsis horizontal"
                    circular={true}
                    disabled={true}
                    onClick={() => this.props.onCardDetailsClick(this.props.passedKey)}/>
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        </Grid.Column>
      )
  }
}

KeyCard.propTypes = {
  /**
   * @type {bool} editable - Determines whether the key card can be edited
   */
  editable: PropTypes.bool,

  /**
   * @type {Image} image - The image of the key
   */
  keyIcon: PropTypes.element,

  /**
   * @type {handleKeyCardChange} The callback function to handle key changes
   */
  onChange: PropTypes.func,

  /**
   * @type {handleKeyCardDeletion} The callback function to handle key deletions
   */
  onDelete: PropTypes.func,

  /**
   * @type {handleKeyCardSave} The callback function to handle key saves
   */
  onSave: PropTypes.func,

  /**
   * @type {object} key - The passed key
   */
  passedKey: PropTypes.object.isRequired
};

KeyCard.defaultProps = {
  editable: false,
  keyIcon: <Image src="/assets/images/wireframe/image.png" size="mini"/>
};

export default KeyCard;

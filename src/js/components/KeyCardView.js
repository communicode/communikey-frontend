import React, { Component } from 'react'
import { Grid, Segment, Divider } from 'semantic-ui-react'
import KeyCard from "./KeyCard";
import "../../css/components/KeyCardView.css";

class KeyCardView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    function KeyCards(props) {
      if(props.keys !== undefined) {
        if(props.keys.length > 0) {
          var rows = [];
          props.keys.map(function(key) {
            rows.push(
              <KeyCard passedKey={key}/>
            );
          })
          return <tbody>{rows}</tbody>;
        } else return null
      } else return null
    }

    return (
      <Segment class="keycardView" raised>
        <h1>Company internal:</h1>
        <Divider />
        <Grid stackable>
          <Grid.Column>
            <KeyCards keys={this.props.category.keys}/>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

export default KeyCardView

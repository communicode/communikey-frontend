import React, { Component } from 'react'
import { Grid, Segment, Divider } from 'semantic-ui-react'
import KeyCard from "./KeyCard";
import "../../css/components/KeyCardView.css";

class KeyCardView extends Component {
  render() {
    return (
      <Segment class="keycardView" raised>
        <h1>Company internal:</h1>
        <Divider />
        <Grid stackable class="asd">
          <Grid.Column>
            <KeyCard></KeyCard>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

export default KeyCardView

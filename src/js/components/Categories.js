import React from "react";
import KeyCard from "./KeyCard";
// import "../../css/components/Index.css";
import { Header, Card, Grid, Segment, Divider } from 'semantic-ui-react'

export default class Categories extends React.Component {
  render() {
    return (
      <div class="container">
          <Header as='h1'> Keys </Header>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
              </Grid.Row>
            </Grid>
      </div>
    )
  }
}

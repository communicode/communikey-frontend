import React from "react";
import KeyCard from "./KeyCard";
import NavBar from "./NavBar";
import Header from "./Header";
import "../../css/components/Index.css";
import { Card, Grid, Segment, Divider } from 'semantic-ui-react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <NavBar/>
        <div class="content">
          <Segment raised>
            <h1>Company internal:</h1>
            <Divider />
            <div class="asd">
              <Grid stackable>
                <Grid.Column>
                  <KeyCard></KeyCard>
                </Grid.Column>
              </Grid>
            </div>
            <Divider />
            <Grid stackable>
              <Grid.Column>
                <KeyCard></KeyCard>
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
      </div>
    )
  }
}

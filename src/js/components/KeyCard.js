import React, { Component } from 'react'
import { Grid,Input,Card,Image } from 'semantic-ui-react'
import "../../css/components/KeyCard.css";

class KeyCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.passedKey !== undefined) {
      return (
        <Grid.Column>
          <Card>
            <Card.Content header={this.props.passedKey.name} />
              <Card.Meta>
                <span className='date'>
                  {/*Placeholder*/}
                  Created 23rd January 2016
                </span>
              </Card.Meta>
            <Card.Content description>
              <Input
                action={{ color: 'teal', icon: 'copy' }}
                defaultValue={this.props.passedKey.password}
                type='password'
                fluid
              />
            </Card.Content>
            <Card.Content extra>
              <Image src='/assets/img/communikey-logo.svg' avatar />
              <span>Responsible user</span>
            </Card.Content>
          </Card>
        </Grid.Column>
      )
    } else {
      return null
    }
  }
}

export default KeyCard;

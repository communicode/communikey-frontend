import React, { Component } from 'react'
import { Card, Image } from 'semantic-ui-react'
import "../../css/components/KeyCard.css";

class KeyCard extends Component {
    render() {
      return (
        <Card>
            <Card.Content header='Card 1' />
                <Card.Meta>
                    <span className='date'>
                        Created 23rd January 2016
                    </span>
                </Card.Meta>
            <Card.Content description="Lorem ipsum dolor sit amet" />
            <Card.Content extra>
                <Image src='../../img/communikey-logo.svg' avatar />
                <span>Username</span>
            </Card.Content>
        </Card>
      )
    }
}

export default KeyCard

import React, { Component } from 'react'
import { Grid,Input,Card,Image, Button } from 'semantic-ui-react'
import "../../css/components/KeyCard.css";
import "../../css/components/Admin.css";
import CopyToClipboard from 'react-copy-to-clipboard';

class KeyCard extends Component {
  constructor(props) {
    super(props);
    this.state= {
      inputType: "password"
    }
  }

  changeInputType = () => {
    this.state.inputType = (this.state.inputType === "text") ? this.setState({inputType: "password"}) : this.setState({inputType: "text"});
  };

  render() {
    if(this.props.passedKey !== undefined) {
      return (
        <Grid.Column>
          <Card>
            <Card.Content header={this.props.passedKey.name} />
              <Card.Meta>
                <span className='date'>
                  {/*Placeholder*/}
                  {this.props.passedKey.createdBy}
                </span>
              </Card.Meta>
            <Card.Content>
              <Input
                defaultValue={this.props.passedKey.password}
                type={this.state.inputType}
                disabled
                fluid
                class="passwordInput"
              />
            </Card.Content>
            <Card.Content extra>
              <Image src='/assets/images/communikey-logo.svg' avatar />
              <span>Responsible user</span>
            </Card.Content>
            <Card.Content extra>
                <Button circular icon='eye' onClick={this.changeInputType}/>
                <CopyToClipboard text={this.props.passedKey.password}>
                  <Button circular icon='copy' />
                </CopyToClipboard>
                <Button floated="right" circular icon='ellipsis horizontal' onClick={() => this.props.onCardClick(this.props.passedKey)}/>
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

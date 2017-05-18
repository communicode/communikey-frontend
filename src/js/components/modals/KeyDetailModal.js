import React, { Component } from 'react'
import { Button, List, Modal, Input} from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import CopyToClipboard from 'react-copy-to-clipboard';

/**
 * @author mskyschally@communicode.de
 */
class KeyDetailModal extends AdminRoute  {

  constructor(props) {
    super(props);
    this.state = {
      passedKey: this.props.passedKey,
      inputType: "password"
    }
  }

  changeInputType = () => {
    this.state.inputType = (this.state.inputType === "text") ? this.setState({inputType: "password"}) : this.setState({inputType: "text"});
  };

  render() {
    return (
      <Modal size="small" dimmer={true} open={true}  >
        <Modal.Header>details: {this.state.passedKey.name}</Modal.Header>
        <Modal.Content>
          <List divided relaxed>
            <List.Item>
              <List.Icon name='address book' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Name</List.Header>
                <List.Description>{this.state.passedKey.name}</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='privacy' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header>Password</List.Header>
                <Input
                  defaultValue={this.state.passedKey.password}
                  type={this.state.inputType}
                  disabled
                  class="passwordInput"
                />
              </List.Content>
            </List.Item>
          </List>
        </Modal.Content>
        <Modal.Actions>
          <CopyToClipboard text={this.props.passedKey.password}>
            <Button content="Copy" class="otherActionButton" icon="copy"/>
          </CopyToClipboard>
          <Button content="Show" class="otherActionButton" icon="eye" onClick={this.changeInputType}/>
          <Button content="Close" class="cancelButton" icon="remove" onClick={this.props.onModalClose}/>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default KeyDetailModal;
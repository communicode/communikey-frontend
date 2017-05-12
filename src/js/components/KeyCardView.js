import React, { Component } from 'react'
import { Grid, Segment, Divider, Header } from 'semantic-ui-react'
import KeyCard from "./KeyCard";
import "../../css/components/KeyCardView.css";
import KeyDetailModal from "./modals/KeyDetailModal"
import AddUserModal from "./modals/AddUserModal"

class KeyCardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addKeyModalIsOpen: false,
      keyDetailModalIsOpen: false
    };
  }

  toggleKeyDetailModal = () => {
    const {keyDetailModalIsOpen} = this.state;
    this.setState({
      keyDetailModalIsOpen: !keyDetailModalIsOpen
    });
  };

  toggleCardClick = (passedKey) => {
    this.setState({
      passedKey: passedKey,
      keyDetailModalIsOpen: true
    });
  };

  render() {
    let handleClick = (passedKey) => this.toggleCardClick(passedKey)
    function KeyCards(props) {
      if(props.keys !== undefined) {
        if(props.keys.length > 0) {
          let rows = [];
          props.keys.map(function(key) {
            rows.push(
              <KeyCard passedKey={key} onCardClick={handleClick}/>
            );
          })
          return <tbody>{rows}</tbody>;
        } else {
          return null
        }
      } else {
        return null
      }
    }

    return (
      <Segment class="keycardView">
        <Header as='h1'>
          Keys: {this.props.category.name}
        </Header>
        <Divider />
        <Grid stackable>
          <KeyCards keys={this.props.category.keys}/>
        </Grid>
        {this.state.addUserModalIsOpen && <AddUserModal onModalClose={this.toggleAddUserModal}/>}
        {this.state.keyDetailModalIsOpen && <KeyDetailModal passedKey={this.state.passedKey} onModalClose={this.toggleKeyDetailModal}/>}
      </Segment>
    )
  }
}

export default KeyCardView;

import React, { Component } from 'react'
import {Grid, Card, Icon} from 'semantic-ui-react'
import AdminRoute from './../AdminRoute'
import { keyStore } from '../../stores/KeyStore'
import UserDetailModal from './../modals/UserDetailModal'
import KeyCard from "./../KeyCard";

/**
 * @author mskyschally@communicode.de
 */
class KeyList extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      /*userDetailModalIsOpen: false,
      cardUser: null*/
    };
  }

  toggleUserDetailModal = (user) => {
   /* const {userDetailModalIsOpen} = this.state;
    this.setState({
      userDetailModalIsOpen: !userDetailModalIsOpen,
      cardUser: user
    });*/
  };

  render() {
    const keyList = keyStore.keys.map(key => {
      return (
        <KeyCard passedKey={key}/>
      )
    });

    return (
      <div>
        {keyList}
        {/*{this.state.userDetailModalIsOpen && <UserDetailModal cardUser={this.state.cardUser} onModalClose={this.toggleUserDetailModal}/>}*/}
      </div>

    )
  }
}

export default KeyList;


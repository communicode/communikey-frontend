import React, { Component } from 'react'
import AdminRoute from './../AdminRoute'
import { keyStore } from '../../stores/KeyStore'
import EditKeyDetailModal from "../modals/EditKeyDetailModal"
import KeyCard from "./../KeyCard"

/**
 * @author mskyschally@communicode.de
 */
class KeyList extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      keyDetailModalIsOpen: false,
      passedKey: null
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
    const keyList = keyStore.keys.map(key => {
      return (
        <KeyCard passedKey={key} onCardClick={this.toggleCardClick}/>
      )
    });

    return (
      <div>
        {keyList}
        {this.state.keyDetailModalIsOpen && <EditKeyDetailModal passedKey={this.state.passedKey} onModalClose={this.toggleKeyDetailModal}/>}
      </div>
    )
  }
}

export default KeyList;


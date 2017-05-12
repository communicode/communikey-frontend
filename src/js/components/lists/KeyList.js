import React from 'react'
import {observer, inject} from "mobx-react";
import AdminRoute from './../AdminRoute'
import { keyStore } from '../../stores/KeyStore'
import KeyDetailModal from "./../modals/KeyDetailModal"
import KeyCard from "./../KeyCard"

/**
 * A observer list of {@link KeyCard}s.
 *
 * @author mskyschally@communicode.de
 * @author sgreb@communicode.de
 * @since 0.5.0
 */
@inject("keyStore") @observer
class KeyList extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      keyDetailModalIsOpen: false,
      passedKey: null
    };
  }

  componentDidMount() {
    this.props.keyStore.fetchKeys();
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
    const keyList = this.props.keyStore.keys.map(key => {
      return (
        <KeyCard key={key.id} passedKey={key} onCardClick={this.toggleCardClick}/>
      )
    });

    return (
      <div>
        {keyList}
        {this.state.keyDetailModalIsOpen && <KeyDetailModal passedKey={this.state.passedKey} onModalClose={this.toggleKeyDetailModal}/>}
      </div>
    )
  }
}

export default KeyList;

